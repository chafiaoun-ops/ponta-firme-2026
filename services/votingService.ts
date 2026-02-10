import { AppState, Vote, VotingStatus } from '../types';
import { STORAGE_KEY } from '../constants';
import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  getDoc,
  updateDoc 
} from 'firebase/firestore';

// Collection references
const META_DOC = 'election_metadata'; // stores status
const VOTES_COLLECTION = 'votes';

// Default initial state
const initialState: AppState = {
  status: VotingStatus.WAITING,
  votes: []
};

// --- Local Storage Helpers (Fallback) ---
const getLocalState = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  return initialState;
};

const saveLocalState = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event('storage'));
};

// --- Service Methods ---

// Subscribe to real-time updates
export const subscribeToData = (callback: (state: AppState) => void) => {
  if (db) {
    // Realtime listener for Status
    const unsubscribeStatus = onSnapshot(doc(db, 'config', META_DOC), (docSnap) => {
      const status = docSnap.exists() ? (docSnap.data().status as VotingStatus) : VotingStatus.WAITING;
      
      // Realtime listener for Votes (nested to combine state)
      // Note: In a massive app we wouldn't pull all votes, but for < 100 people it's fine
      onSnapshot(collection(db, VOTES_COLLECTION), (querySnapshot) => {
        const votes: Vote[] = [];
        querySnapshot.forEach((doc) => {
          votes.push(doc.data() as Vote);
        });
        
        callback({ status, votes });
      });
    });

    return () => unsubscribeStatus(); // Return cleanup function
  } else {
    // LocalStorage polling/event listener
    const localHandler = () => callback(getLocalState());
    window.addEventListener('storage', localHandler);
    // Initial call
    callback(getLocalState());
    return () => window.removeEventListener('storage', localHandler);
  }
};

export const castVote = async (voterId: string, candidateId: string) => {
  if (db) {
    // 1. Check if voting is open
    const configRef = doc(db, 'config', META_DOC);
    const configSnap = await getDoc(configRef);
    const currentStatus = configSnap.exists() ? configSnap.data().status : VotingStatus.WAITING;

    if (currentStatus !== VotingStatus.OPEN) {
      throw new Error('A votação não está aberta.');
    }

    // 2. Check if already voted (Firestore read)
    const voteRef = doc(db, VOTES_COLLECTION, voterId);
    const voteSnap = await getDoc(voteRef);
    
    if (voteSnap.exists()) {
      throw new Error('Você já votou!');
    }

    // 3. Cast vote
    const newVote: Vote = {
      voterId,
      candidateId,
      timestamp: Date.now()
    };
    
    await setDoc(voteRef, newVote);

  } else {
    // Local fallback
    const state = getLocalState();
    const hasVoted = state.votes.find(v => v.voterId === voterId);
    
    if (hasVoted) throw new Error('Você já votou!');
    if (state.status !== VotingStatus.OPEN) throw new Error('A votação não está aberta.');

    const newVote: Vote = {
      voterId,
      candidateId,
      timestamp: Date.now()
    };

    saveLocalState({
      ...state,
      votes: [...state.votes, newVote]
    });
  }
};

export const updateStatus = async (status: VotingStatus) => {
  if (db) {
    const configRef = doc(db, 'config', META_DOC);
    await setDoc(configRef, { status }, { merge: true });
  } else {
    const state = getLocalState();
    saveLocalState({ ...state, status });
  }
};

export const resetElection = async () => {
  if (db) {
    // Reset status
    await updateStatus(VotingStatus.WAITING);
    // Note: Deleting collection in client SDK is hard, usually we just ignore old votes 
    // or use a new collection ID/Year. For simplicity here, assuming admin manually clears
    // or we just set status to waiting. 
    // To properly clear in a simple way for this app:
    // We would need to list all docs and delete them.
    // For now, let's just alert the user in console.
    alert("No modo Firebase, apague a coleção 'votes' manualmente no console para zerar completamente, ou mude o ano da eleição.");
  } else {
    const newState: AppState = {
      status: VotingStatus.WAITING,
      votes: []
    };
    saveLocalState(newState);
  }
};

export const calculateResults = (votes: Vote[]) => {
  const counts: Record<string, number> = {};

  votes.forEach(v => {
    counts[v.candidateId] = (counts[v.candidateId] || 0) + 1;
  });

  const sortedResults = Object.entries(counts)
    .sort(([, countA], [, countB]) => countB - countA)
    .map(([candidateId, count]) => ({ candidateId, count }));

  return sortedResults;
};