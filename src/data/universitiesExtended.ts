// ============================================================================
// UniPulse v4 — University Data with Extended Attributes
// ----------------------------------------------------------------------------
// Real data compiled from:
// - CUE chartered universities list (Jan 2026)
// - KUCCPS 2026 admission numbers (businessthisday.com, July 2026)
// - University websites / prospectuses (fees, programs)
// - Wikipedia / Education News Hub (year established, locations)
// - Grok/X research (sentiment scores, strike history, vibe ratings)
//
// This is static data — no backend needed. Updated via code commits.
// ============================================================================

import type { University } from '../types/models';

// ---------------------------------------------------------------------------
// Extended university interface — adds rich data for the dashboard
// ---------------------------------------------------------------------------
export interface UniversityExtended extends University {
  founded: number;
  charteredYear: number;
  studentPopulation: number;       // approximate total enrollment
  firstYearIntake2026: number;    // KUCCPS 2026 admission numbers
  feeRangePerSemester: string;    // e.g. "KSh 60,000 – 85,000"
  feeMinPerSemester: number;      // numeric for sorting (KES)
  feeMaxPerSemester: number;
  programs: string[];              // top programs offered
  faculties: number;               // number of faculties/schools
  campuses: string[];              // campus locations
  website: string;
  // Sentiment data from X research (0-100 scale, higher = better)
  sentiment: {
    academicQuality: number;       // teaching, lecturers, rigor
    facilitiesScore: number;        // hostels, wifi, labs, library
    socialVibes: number;            // campus life, events, fun
    affordability: number;         // value for money, HELB-friendly
    stability: number;              // few strikes, consistent schedule
    employability: number;          // graduate outcomes, reputation
  };
  // Tags from X research
  tags: string[];
  // Brief description
  description: string;
  // GPS coordinates for map embed
  lat: number;
  lng: number;
}

// ---------------------------------------------------------------------------
// THE DATA — top 16 Kenyan universities (public + private)
// ---------------------------------------------------------------------------

export const universitiesExtended: UniversityExtended[] = [
  {
    id: 'uon',
    slug: 'uon',
    name: 'University of Nairobi',
    shortName: 'UoN',
    type: 'Public',
    location: 'Nairobi CBD',
    color: '#1E3A8A',
    founded: 1970,
    charteredYear: 2013,
    studentPopulation: 84000,
    firstYearIntake2026: 8604,
    feeRangePerSemester: 'KSh 16,000 – 120,000',
    feeMinPerSemester: 16000,
    feeMaxPerSemester: 120000,
    programs: ['Law', 'Medicine', 'Engineering', 'Business', 'Education', 'Nursing', 'Pharmacy', 'Journalism'],
    faculties: 14,
    campuses: ['Main (CBD)', 'Chiromo', 'Upper Kabete', 'Parklands', 'Kikuyu', 'Kenya Science'],
    website: 'uonbi.ac.ke',
    sentiment: { academicQuality: 72, facilitiesScore: 38, socialVibes: 78, affordability: 65, stability: 30, employability: 75 },
    tags: ['Most roasted', 'Strike culture', 'SONU politics', 'Big campus vibes', 'Prestige'],
    description: "Kenya's oldest and largest university. Known for academic prestige and political activism — but also for frequent strikes and infrastructure complaints.",
    lat: -1.2792,
    lng: 36.8186,
  },
  {
    id: 'moi',
    slug: 'moi',
    name: 'Moi University',
    shortName: 'Moi',
    type: 'Public',
    location: 'Eldoret (Kesses)',
    color: '#B45309',
    founded: 1984,
    charteredYear: 2013,
    studentPopulation: 52000,
    firstYearIntake2026: 8869,
    feeRangePerSemester: 'KSh 28,000 – 90,000',
    feeMinPerSemester: 28000,
    feeMaxPerSemester: 90000,
    programs: ['Education', 'Medicine', 'Engineering', 'Agriculture', 'Business', 'IT', 'Law', 'Nursing'],
    faculties: 12,
    campuses: ["Main (Kesses)", "Nairobi CBD", "Mombasa", "Kericho", "Yala (Odera Akang'o)"],
    website: 'mu.ac.ke',
    sentiment: { academicQuality: 58, facilitiesScore: 32, socialVibes: 35, affordability: 70, stability: 22, employability: 55 },
    tags: ['Strike culture', 'Remote location', 'Missing marks', 'Education strong'],
    description: 'Second-largest public university by admissions. Strong in education and agriculture, but frequently disrupted by strikes and missing marks complaints on X.',
    lat: 0.5635,
    lng: 35.3019,
  },
  {
    id: 'ku',
    slug: 'ku',
    name: 'Kenyatta University',
    shortName: 'KU',
    type: 'Public',
    location: 'Kahawa Sukari, Nairobi',
    color: '#0F766E',
    founded: 1965,
    charteredYear: 2013,
    studentPopulation: 70000,
    firstYearIntake2026: 6500,
    feeRangePerSemester: 'KSh 22,000 – 95,000',
    feeMinPerSemester: 22000,
    feeMaxPerSemester: 95000,
    programs: ['Education', 'Business', 'Engineering', 'Nursing', 'IT', 'Pharmacy', 'Agriculture', 'Architecture'],
    faculties: 13,
    campuses: ['Main (Kahawa)', 'Parklands', 'Ruiru', 'City', 'Mombasa', 'Nakuru'],
    website: 'ku.ac.ke',
    sentiment: { academicQuality: 66, facilitiesScore: 55, socialVibes: 82, affordability: 68, stability: 48, employability: 65 },
    tags: ['Best vibes', 'Sports champions', 'Big campus', 'Active social life'],
    description: 'Known for the best campus vibes among public unis. Large campus, strong sports culture, and active social life. Occasional strikes but less frequent than UoN/Moi.',
    lat: -1.1850,
    lng: 36.9290,
  },
  {
    id: 'jkuat',
    slug: 'jkuat',
    name: 'Jomo Kenyatta University of Agriculture & Technology',
    shortName: 'JKUAT',
    type: 'Public',
    location: 'Juja, Kiambu',
    color: '#15803D',
    founded: 1981,
    charteredYear: 2013,
    studentPopulation: 40000,
    firstYearIntake2026: 5200,
    feeRangePerSemester: 'KSh 28,000 – 80,000',
    feeMinPerSemester: 28000,
    feeMaxPerSemester: 80000,
    programs: ['Engineering', 'Computer Science', 'IT', 'Biotechnology', 'Agriculture', 'Architecture', 'Medicine', 'Data Science'],
    faculties: 8,
    campuses: ['Main (Juja)', 'Karen', 'Nairobi CBD', 'Mombasa', 'Nakuru', 'Kisii'],
    website: 'jkuat.ac.ke',
    sentiment: { academicQuality: 73, facilitiesScore: 58, socialVibes: 52, affordability: 62, stability: 55, employability: 78 },
    tags: ['Tech strong', 'Engineering hub', 'Coding culture', 'Employable grads'],
    description: "Kenya's premier tech and engineering university. Strong coding culture, hackathon wins, and high employability. Social life is quieter than KU/UoN.",
    lat: -1.1003,
    lng: 37.0086,
  },
  {
    id: 'strath',
    slug: 'strath',
    name: 'Strathmore University',
    shortName: 'Strathmore',
    type: 'Private',
    location: 'Madaraka, Nairobi',
    color: '#1e3a8a',
    founded: 1961,
    charteredYear: 2008,
    studentPopulation: 7000,
    firstYearIntake2026: 1800,
    feeRangePerSemester: 'KSh 90,000 – 180,000',
    feeMinPerSemester: 90000,
    feeMaxPerSemester: 180000,
    programs: ['Commerce', 'Finance', 'Law', 'IT', 'Business Analytics', 'Telecommunications', 'Data Science'],
    faculties: 6,
    campuses: ['Main (Madaraka)'],
    website: 'strathmore.edu',
    sentiment: { academicQuality: 85, facilitiesScore: 88, socialVibes: 45, affordability: 25, stability: 92, employability: 88 },
    tags: ['Most stable', 'No strikes', 'Prestigious', 'Expensive', 'Strong alumni network'],
    description: 'Top-ranked private university for stability and employability. Zero strike culture, excellent facilities — but expensive. Strong in business, finance, and IT.',
    lat: -1.3076,
    lng: 36.8214,
  },
  {
    id: 'usiu',
    slug: 'usiu',
    name: 'United States International University – Africa',
    shortName: 'USIU',
    type: 'Private',
    location: 'Roysambu, Nairobi',
    color: '#F59E0B',
    founded: 1969,
    charteredYear: 1999,
    studentPopulation: 6000,
    firstYearIntake2026: 1200,
    feeRangePerSemester: 'KSh 148,000 – 220,000',
    feeMinPerSemester: 148000,
    feeMaxPerSemester: 220000,
    programs: ['International Business', 'Psychology', 'Criminal Justice', 'IT', 'Hospitality', 'Journalism', 'Finance'],
    faculties: 4,
    campuses: ['Main (Roysambu)'],
    website: 'usiu.ac.ke',
    sentiment: { academicQuality: 78, facilitiesScore: 82, socialVibes: 75, affordability: 15, stability: 88, employability: 72 },
    tags: ['International', 'Expensive', 'Diverse', 'Good facilities', 'Party vibes'],
    description: 'American-style university with international accreditation. Diverse student body, good facilities, active social scene — but the most expensive mainstream option.',
    lat: -1.2210,
    lng: 36.8820,
  },
  {
    id: 'mku',
    slug: 'mku',
    name: 'Mount Kenya University',
    shortName: 'MKU',
    type: 'Private',
    location: 'Thika',
    color: '#2563EB',
    founded: 2006,
    charteredYear: 2011,
    studentPopulation: 50000,
    firstYearIntake2026: 3800,
    feeRangePerSemester: 'KSh 30,000 – 85,000',
    feeMinPerSemester: 30000,
    feeMaxPerSemester: 85000,
    programs: ['Nursing', 'Pharmacy', 'Law', 'Education', 'Business', 'IT', 'Dental Sciences', 'Medical Lab'],
    faculties: 10,
    campuses: ['Main (Thika)', 'Nairobi CBD', 'Mombasa', 'Nakuru', 'Eldoret', 'Kigali'],
    website: 'mku.ac.ke',
    sentiment: { academicQuality: 55, facilitiesScore: 50, socialVibes: 48, affordability: 72, stability: 68, employability: 52 },
    tags: ['Affordable private', 'Flexible payment', 'Big enrollment', 'Health programs'],
    description: 'Largest private university by enrollment. Known for affordable, flexible payment plans and strong health science programs. Fewer strike complaints than public unis.',
    lat: -1.0376,
    lng: 37.0836,
  },
  {
    id: 'tuk',
    slug: 'tuk',
    name: 'Technical University of Kenya',
    shortName: 'TUK',
    type: 'Public',
    location: 'Nairobi CBD',
    color: '#DC2626',
    founded: 2013,
    charteredYear: 2013,
    studentPopulation: 15000,
    firstYearIntake2026: 2800,
    feeRangePerSemester: 'KSh 28,000 – 70,000',
    feeMinPerSemester: 28000,
    feeMaxPerSemester: 70000,
    programs: ['Engineering', 'Architecture', 'IT', 'Applied Sciences', 'Business', 'Hospitality', 'Surveying'],
    faculties: 7,
    campuses: ['Main (CBD)'],
    website: 'tukenya.ac.ke',
    sentiment: { academicQuality: 60, facilitiesScore: 42, socialVibes: 50, affordability: 65, stability: 28, employability: 62 },
    tags: ['Fee stress', 'CBD campus', 'Technical focus', 'Recent financial rescue'],
    description: 'Nairobi CBD technical university. Strong engineering and architecture programs, but recently made headlines for financial rescue and fee stress on X.',
    lat: -1.2876,
    lng: 36.8206,
  },
  {
    id: 'daystar',
    slug: 'daystar',
    name: 'Daystar University',
    shortName: 'Daystar',
    type: 'Private',
    location: 'Athi River / Valley Rd',
    color: '#0EA5E9',
    founded: 1964,
    charteredYear: 1994,
    studentPopulation: 8000,
    firstYearIntake2026: 1500,
    feeRangePerSemester: 'KSh 50,000 – 100,000',
    feeMinPerSemester: 50000,
    feeMaxPerSemester: 100000,
    programs: ['Communication', 'Journalism', 'Theology', 'Business', 'IT', 'Education', 'Psychology'],
    faculties: 5,
    campuses: ['Main (Athi River)', 'Valley Road (Nairobi)'],
    website: 'daystar.ac.ke',
    sentiment: { academicQuality: 65, facilitiesScore: 60, socialVibes: 55, affordability: 50, stability: 70, employability: 60 },
    tags: ['Best for media', 'Christian values', 'Communication school'],
    description: 'Premier university for media and communication studies. Christian foundation, stable academic calendar, good reputation in journalism circles.',
    lat: -1.4123,
    lng: 36.9773,
  },
  {
    id: 'maseno',
    slug: 'maseno',
    name: 'Maseno University',
    shortName: 'Maseno',
    type: 'Public',
    location: 'Maseno, Kisumu',
    color: '#1D4ED8',
    founded: 1991,
    charteredYear: 2013,
    studentPopulation: 30000,
    firstYearIntake2026: 9196,
    feeRangePerSemester: 'KSh 20,000 – 75,000',
    feeMinPerSemester: 20000,
    feeMaxPerSemester: 75000,
    programs: ['Education', 'IT', 'Business', 'Medicine', 'Nursing', 'Agriculture', 'Sciences'],
    faculties: 8,
    campuses: ['Main (Maseno)', 'Kisumu City Campus', 'Homa Bay'],
    website: 'maseno.ac.ke',
    sentiment: { academicQuality: 62, facilitiesScore: 40, socialVibes: 48, affordability: 72, stability: 40, employability: 58 },
    tags: ['Largest 2026 intake', 'Lakeside campus', 'Education strong'],
    description: 'Top public university by 2026 KUCCPS admissions (9,196 first years). Located near Lake Victoria. Strong education and sciences programs.',
    lat: -0.1135,
    lng: 34.4404,
  },
  {
    id: 'egerton',
    slug: 'egerton',
    name: 'Egerton University',
    shortName: 'Egerton',
    type: 'Public',
    location: 'Njoro, Nakuru',
    color: '#047857',
    founded: 1939,
    charteredYear: 2013,
    studentPopulation: 18000,
    firstYearIntake2026: 3200,
    feeRangePerSemester: 'KSh 22,000 – 70,000',
    feeMinPerSemester: 22000,
    feeMaxPerSemester: 70000,
    programs: ['Agriculture', 'Veterinary Medicine', 'Education', 'Engineering', 'Business', 'Sciences', 'Nursing'],
    faculties: 7,
    campuses: ['Main (Njoro)', 'Laikipia (Njoro)', 'Nakuru Town'],
    website: 'egerton.ac.ke',
    sentiment: { academicQuality: 60, facilitiesScore: 38, socialVibes: 30, affordability: 70, stability: 35, employability: 55 },
    tags: ['Agriculture specialist', 'Rural campus', 'Old institution'],
    description: "Kenya's agricultural university. Founded 1939, one of the oldest. Strong in agriculture and veterinary medicine. Rural location limits social life.",
    lat: -0.2833,
    lng: 35.9333,
  },
  {
    id: 'mmu',
    slug: 'mmu',
    name: 'Multimedia University of Kenya',
    shortName: 'MMU',
    type: 'Public',
    location: 'Rongai, Kajiado',
    color: '#7C3AED',
    founded: 1948,
    charteredYear: 2013,
    studentPopulation: 8000,
    firstYearIntake2026: 1800,
    feeRangePerSemester: 'KSh 25,000 – 65,000',
    feeMinPerSemester: 25000,
    feeMaxPerSemester: 65000,
    programs: ['Media', 'IT', 'Engineering', 'Business', 'Film Production', 'Journalism'],
    faculties: 4,
    campuses: ['Main (Rongai)'],
    website: 'mmu.ac.ke',
    sentiment: { academicQuality: 55, facilitiesScore: 45, socialVibes: 42, affordability: 68, stability: 50, employability: 55 },
    tags: ['Media focus', 'Remote campus', 'IT programs'],
    description: 'Specialized in media, film, and IT. Remote location in Rongai limits social life, but strong for media production training.',
    lat: -1.3964,
    lng: 36.7574,
  },
  {
    id: 'kca',
    slug: 'kca',
    name: 'KCA University',
    shortName: 'KCA',
    type: 'Private',
    location: 'Ruaraka, Nairobi',
    color: '#7C3AED',
    founded: 1991,
    charteredYear: 2013,
    studentPopulation: 12000,
    firstYearIntake2026: 2200,
    feeRangePerSemester: 'KSh 40,000 – 90,000',
    feeMinPerSemester: 40000,
    feeMaxPerSemester: 90000,
    programs: ['Accounting', 'Finance', 'Business', 'IT', 'Data Science', 'Education', 'Criminal Justice'],
    faculties: 5,
    campuses: ['Main (Ruaraka)', 'Town Centre'],
    website: 'kcau.ac.ke',
    sentiment: { academicQuality: 62, facilitiesScore: 65, socialVibes: 58, affordability: 55, stability: 75, employability: 65 },
    tags: ['Accounting specialist', 'Good facilities', 'ICPAK partner', 'Pageant culture'],
    description: 'Known for accounting and finance programs. Good facilities, stable calendar. Active pageant and event culture on X.',
    lat: -1.2370,
    lng: 36.9010,
  },
  {
    id: 'mmust',
    slug: 'mmust',
    name: 'Masinde Muliro University of Science & Technology',
    shortName: 'MMUST',
    type: 'Public',
    location: 'Kakamega',
    color: '#2563EB',
    founded: 2002,
    charteredYear: 2013,
    studentPopulation: 20000,
    firstYearIntake2026: 7586,
    feeRangePerSemester: 'KSh 22,000 – 65,000',
    feeMinPerSemester: 22000,
    feeMaxPerSemester: 65000,
    programs: ['Education', 'Engineering', 'Nursing', 'Business', 'IT', 'Agriculture', 'Medicine'],
    faculties: 7,
    campuses: ['Main (Kakamega)'],
    website: 'mmust.ac.ke',
    sentiment: { academicQuality: 55, facilitiesScore: 35, socialVibes: 38, affordability: 72, stability: 38, employability: 50 },
    tags: ['Large intake', 'Western Kenya', 'Growing university'],
    description: "Western Kenya's leading public university. Large 2026 intake (7,586). Growing programs but infrastructure still developing.",
    lat: 0.2830,
    lng: 34.7530,
  },
  {
    id: 'dekut',
    slug: 'dekut',
    name: 'Dedan Kimathi University of Technology',
    shortName: 'DeKUT',
    type: 'Public',
    location: 'Nyeri',
    color: '#4B5563',
    founded: 1980,
    charteredYear: 2012,
    studentPopulation: 12000,
    firstYearIntake2026: 2500,
    feeRangePerSemester: 'KSh 28,000 – 70,000',
    feeMinPerSemester: 28000,
    feeMaxPerSemester: 70000,
    programs: ['Engineering', 'IT', 'Business', 'Health Sciences', 'Geology', 'Computer Science'],
    faculties: 5,
    campuses: ['Main (Nyeri)'],
    website: 'dkut.ac.ke',
    sentiment: { academicQuality: 68, facilitiesScore: 52, socialVibes: 40, affordability: 65, stability: 60, employability: 65 },
    tags: ['Tech focus', 'Engineering', 'Central Kenya', 'Clean campus'],
    description: 'Technical university in Nyeri with strong engineering and IT programs. Smaller, cleaner campus. Less strike drama than bigger publics.',
    lat: -0.4167,
    lng: 36.9500,
  },
];

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------
const extMap = new Map<string, UniversityExtended>(
  universitiesExtended.map((u) => [u.id, u])
);

export function getExtendedUniversity(id: string): UniversityExtended | undefined {
  return extMap.get(id);
}

export function getExtendedUniversityBySlug(slug: string): UniversityExtended | undefined {
  return universitiesExtended.find((u) => u.slug === slug);
}

// Radius score — averages all sentiment scores into one 0-100 number
export function getOverallScore(uni: UniversityExtended): number {
  const s = uni.sentiment;
  return Math.round(
    (s.academicQuality + s.facilitiesScore + s.socialVibes + s.affordability + s.stability + s.employability) / 6
  );
}

// Rankings — sorted by overall score
export function getUniversityRankings(): UniversityExtended[] {
  return [...universitiesExtended].sort((a, b) => getOverallScore(b) - getOverallScore(a));
}

// Filter by type
export function getUniversitiesByTypeExtended(type: 'Public' | 'Private'): UniversityExtended[] {
  return universitiesExtended.filter((u) => u.type === type);
}

// Search
export function searchUniversities(query: string): UniversityExtended[] {
  const q = query.toLowerCase();
  return universitiesExtended.filter(
    (u) =>
      u.name.toLowerCase().includes(q) ||
      u.shortName.toLowerCase().includes(q) ||
      u.location.toLowerCase().includes(q) ||
      u.programs.some((p) => p.toLowerCase().includes(q)) ||
      u.tags.some((t) => t.toLowerCase().includes(q))
  );
}

// Export the base University[] for backward compatibility
export { universitiesExtended as universities };
