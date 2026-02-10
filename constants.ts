import { Participant } from './types';

// Helper to normalize names to IDs
const toId = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

export const PARTICIPANTS_RAW = [
  { name: 'Andreia', code: '8403' },
  { name: 'Augusto', code: '8765' },
  { name: 'Berin', code: '8378' },
  { name: 'Binho', code: '3088' },
  { name: 'Chafi', code: '1508' },
  { name: 'Cláudio', code: '2974' },
  { name: 'Fafá', code: '3569' },
  { name: 'Fernanda', code: '2862' },
  { name: 'Gisele', code: '5858' },
  { name: 'Gugu', code: '1123' },
  { name: 'Jezer', code: '2356' },
  { name: 'Juliane', code: '6428' },
  { name: 'Julio', code: '8723' },
  { name: 'Kelen', code: '9706' },
  { name: 'Nani', code: '7245' },
  { name: 'Paula do Berin', code: '2453' },
  { name: 'Paula do Jezer', code: '9862' },
  { name: 'Rafael', code: '2976' },
  { name: 'Rodrigo', code: '9322' },
  { name: 'Rosana', code: '8762' },
  { name: 'Sharon', code: '8692' },
  { name: 'Soraia', code: '2722' },
];

export const PARTICIPANTS: Participant[] = PARTICIPANTS_RAW.map(p => ({
  ...p,
  id: toId(p.name)
}));

export const STORAGE_KEY = 'carnival_voting_app_data_v1';
export const ADMIN_PASSWORD = '1508';