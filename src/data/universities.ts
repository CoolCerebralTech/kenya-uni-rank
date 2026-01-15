import type { University } from '../types';

export const universities: University[] = [
  // --- PUBLIC UNIVERSITIES ---
  {
    id: 'uon',
    slug: 'uon',
    name: 'University of Nairobi',
    shortName: 'UoN',
    type: 'Public',
    location: 'Nairobi CBD',
    color: '#1E3A8A', // UoN Blue
  },
  {
    id: 'ku',
    slug: 'ku',
    name: 'Kenyatta University',
    shortName: 'KU',
    type: 'Public',
    location: 'Kahawa Sukari',
    color: '#0F766E', // KU Green
  },
  {
    id: 'jkuat',
    slug: 'jkuat',
    name: 'Jomo Kenyatta University of Agriculture & Technology',
    shortName: 'JKUAT',
    type: 'Public',
    location: 'Juja',
    color: '#15803D', // JKUAT Green
  },
  {
    id: 'moi',
    slug: 'moi',
    name: 'Moi University',
    shortName: 'Moi',
    type: 'Public',
    location: 'Eldoret',
    color: '#B45309', // Moi Gold/Brown
  },
  {
    id: 'egerton',
    slug: 'egerton',
    name: 'Egerton University',
    shortName: 'Egerton',
    type: 'Public',
    location: 'Njoro',
    color: '#047857', // Green
  },
  {
    id: 'maseno',
    slug: 'maseno',
    name: 'Maseno University',
    shortName: 'Maseno',
    type: 'Public',
    location: 'Kisumu',
    color: '#1D4ED8', // Blue
  },
  {
    id: 'tuk',
    slug: 'tuk',
    name: 'Technical University of Kenya',
    shortName: 'TUK',
    type: 'Public',
    location: 'Nairobi CBD',
    color: '#DC2626', // Red
  },
  {
    id: 'mmust',
    slug: 'mmust',
    name: 'Masinde Muliro University',
    shortName: 'MMUST',
    type: 'Public',
    location: 'Kakamega',
    color: '#2563EB', // Blue
  },
  {
    id: 'dekut',
    slug: 'dekut',
    name: 'Dedan Kimathi University of Technology',
    shortName: 'DeKUT',
    type: 'Public',
    location: 'Nyeri',
    color: '#4B5563', // Grey/Green
  },
  {
    id: 'mmu',
    slug: 'mmu',
    name: 'Multimedia University of Kenya',
    shortName: 'MMU',
    type: 'Public',
    location: 'Rongai',
    color: '#7C3AED', // Purpleish
  },

  // --- PRIVATE UNIVERSITIES ---
  {
    id: 'strath',
    slug: 'strath',
    name: 'Strathmore University',
    shortName: 'Strathmore',
    type: 'Private',
    location: 'Madaraka',
    color: '#1e3a8a', // Deep Blue
  },
  {
    id: 'usiu',
    slug: 'usiu',
    name: 'United States International University – Africa',
    shortName: 'USIU',
    type: 'Private',
    location: 'Roysambu',
    color: '#F59E0B', // Gold/Yellow
  },
  {
    id: 'daystar',
    slug: 'daystar',
    name: 'Daystar University',
    shortName: 'Daystar',
    type: 'Private',
    location: 'Athi River / Valley Rd',
    color: '#0EA5E9', // Light Blue
  },
  {
    id: 'mku',
    slug: 'mku',
    name: 'Mount Kenya University',
    shortName: 'MKU',
    type: 'Private',
    location: 'Thika',
    color: '#2563EB', // Royal Blue
  },
  {
    id: 'cuea',
    slug: 'cuea',
    name: 'Catholic University of Eastern Africa',
    shortName: 'CUEA',
    type: 'Private',
    location: 'Karen',
    color: '#DC2626', // Red
  },
  {
    id: 'kca',
    slug: 'kca',
    name: 'KCA University',
    shortName: 'KCA',
    type: 'Private',
    location: 'Ruaraka',
    color: '#7C3AED', // Purple
  },
  {
    id: 'zetech',
    slug: 'zetech',
    name: 'Zetech University',
    shortName: 'Zetech',
    type: 'Private',
    location: 'Ruiru',
    color: '#2563EB', // Blue
  },
  {
    id: 'anu',
    slug: 'anu',
    name: 'Africa Nazarene University',
    shortName: 'ANU',
    type: 'Private',
    location: 'Ongata Rongai',
    color: '#B91C1C', // Red
  },
  {
    id: 'riara',
    slug: 'riara',
    name: 'Riara University',
    shortName: 'Riara',
    type: 'Private',
    location: 'Mbagathi Way',
    color: '#D97706', // Orange
  },
  {
    id: 'kabarak',
    slug: 'kabarak',
    name: 'Kabarak University',
    shortName: 'Kabarak',
    type: 'Private',
    location: 'Nakuru',
    color: '#4B5563', // Grey
  }
];

// Helper to find a uni by ID quickly
export const getUni = (id: string) => universities.find((u) => u.id === id);