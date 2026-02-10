export interface Participant {
  name: string;
  code: string;
  id: string; // generated from name for internal use
}

export interface Vote {
  voterId: string;
  candidateId: string;
  timestamp: number;
}

export enum VotingStatus {
  WAITING = 'WAITING', // Admin hasn't opened yet
  OPEN = 'OPEN',       // Voting is active
  CLOSED = 'CLOSED'    // Voting finished, show results
}

export interface AppState {
  status: VotingStatus;
  votes: Vote[];
}