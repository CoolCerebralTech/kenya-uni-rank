-- ============================================================================
-- UniPulse PHASE 2 - PERMANENT SEED DATA
-- This data should NEVER be deleted (run in production)
-- Universities + Core Polls (Kenyan Student Context)
-- ============================================================================

-- ============================================================================
-- 1. UNIVERSITIES (All 20 - Permanent Reference Data)
-- ============================================================================
INSERT INTO universities (id, slug, name, short_name, type, location, color, established, student_population) VALUES
-- PUBLIC UNIVERSITIES
('uon', 'uon', 'University of Nairobi', 'UoN', 'Public', 'Nairobi CBD', '#1E3A8A', 1970, 84000),
('ku', 'ku', 'Kenyatta University', 'KU', 'Public', 'Kahawa Sukari', '#0F766E', 1985, 70000),
('jkuat', 'jkuat', 'Jomo Kenyatta University of Agriculture & Technology', 'JKUAT', 'Public', 'Juja', '#15803D', 1981, 50000),
('moi', 'moi', 'Moi University', 'Moi', 'Public', 'Eldoret', '#B45309', 1984, 45000),
('egerton', 'egerton', 'Egerton University', 'Egerton', 'Public', 'Njoro', '#047857', 1987, 35000),
('maseno', 'maseno', 'Maseno University', 'Maseno', 'Public', 'Kisumu', '#1D4ED8', 1991, 30000),
('tuk', 'tuk', 'Technical University of Kenya', 'TUK', 'Public', 'Nairobi CBD', '#DC2626', 2013, 20000),
('mmust', 'mmust', 'Masinde Muliro University', 'MMUST', 'Public', 'Kakamega', '#2563EB', 2007, 25000),
('dekut', 'dekut', 'Dedan Kimathi University of Technology', 'DeKUT', 'Public', 'Nyeri', '#4B5563', 2012, 15000),
('mmu', 'mmu', 'Multimedia University of Kenya', 'MMU', 'Public', 'Rongai', '#7C3AED', 2013, 18000),

-- PRIVATE UNIVERSITIES
('strath', 'strath', 'Strathmore University', 'Strathmore', 'Private', 'Madaraka', '#1e3a8a', 2002, 10000),
('usiu', 'usiu', 'United States International University – Africa', 'USIU', 'Private', 'Roysambu', '#F59E0B', 1977, 8000),
('daystar', 'daystar', 'Daystar University', 'Daystar', 'Private', 'Athi River / Valley Rd', '#0EA5E9', 1994, 6000),
('mku', 'mku', 'Mount Kenya University', 'MKU', 'Private', 'Thika', '#2563EB', 2011, 50000),
('cuea', 'cuea', 'Catholic University of Eastern Africa', 'CUEA', 'Private', 'Karen', '#DC2626', 1992, 7000),
('kca', 'kca', 'KCA University', 'KCA', 'Private', 'Ruaraka', '#7C3AED', 2013, 12000),
('zetech', 'zetech', 'Zetech University', 'Zetech', 'Private', 'Ruiru', '#2563EB', 2014, 15000),
('anu', 'anu', 'Africa Nazarene University', 'ANU', 'Private', 'Ongata Rongai', '#B91C1C', 2002, 5000),
('riara', 'riara', 'Riara University', 'Riara', 'Private', 'Mbagathi Way', '#D97706', 2015, 4000),
('kabarak', 'kabarak', 'Kabarak University', 'Kabarak', 'Private', 'Nakuru', '#4B5563', 2008, 8000)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. POLLS - KENYAN STUDENT CONTEXT (What They REALLY Care About)
-- Grouped by categories, optimized for rivalry and engagement
-- ============================================================================

-- ----------------------------------------------------------------------------
-- CATEGORY: GENERAL (Overall University Experience) - 12 polls
-- ----------------------------------------------------------------------------
INSERT INTO polls (question, slug, category, cycle_month, is_active, display_order) VALUES
('Which university would you choose if you had to do it all over again?', 'do-over-choice', 'general', '2026-01', TRUE, 1),
('Which uni would you recommend to your younger sibling?', 'recommend-sibling', 'general', '2026-01', TRUE, 2),
('Best overall value for money (fees vs quality)?', 'best-value', 'general', '2026-01', TRUE, 3),
('Which uni has the happiest students overall?', 'happiest-students', 'general', '2026-01', TRUE, 4),
('Best university for personal growth and maturity?', 'best-growth', 'general', '2026-01', TRUE, 5),
('Which uni makes you most proud to be an alumni?', 'proudest-alumni', 'general', '2026-01', TRUE, 6),
('Most underrated university (hidden gem)?', 'most-underrated', 'general', '2026-01', TRUE, 7),
('Most overrated university (overhyped)?', 'most-overrated', 'general', '2026-01', TRUE, 8),
('Which uni exceeded your expectations the most?', 'exceeded-expectations', 'general', '2026-01', TRUE, 9),
('Best campus to spend 4 years of your life?', 'best-4-years', 'general', '2026-01', TRUE, 10),
('Which uni prepares you best for the real world?', 'best-real-world-prep', 'general', '2026-01', TRUE, 11),
('Best university for building lifelong connections?', 'best-connections', 'general', '2026-01', TRUE, 12),

-- ----------------------------------------------------------------------------
-- CATEGORY: VIBES (Campus Culture & Lifestyle) - 20 polls
-- This is the VIRAL ENGINE - what students share on Instagram/TikTok
-- ----------------------------------------------------------------------------
('Which campus has the best vibes overall?', 'best-vibes', 'vibes', '2026-01', TRUE, 1),
('Which campus feels most like home?', 'feels-like-home', 'vibes', '2026-01', TRUE, 2),
('Most Instagram-worthy campus?', 'most-instagrammable', 'vibes', '2026-01', TRUE, 3),
('Which uni throws the craziest parties?', 'craziest-parties', 'vibes', '2026-01', TRUE, 4),
('Best campus for introverts (chill & quiet)?', 'best-introverts', 'vibes', '2026-01', TRUE, 5),
('Best campus for extroverts (energy & social)?', 'best-extroverts', 'vibes', '2026-01', TRUE, 6),
('Which uni has the most school spirit and pride?', 'most-spirit', 'vibes', '2026-01', TRUE, 7),
('Best orientation week experience?', 'best-orientation', 'vibes', '2026-01', TRUE, 8),
('Most diverse and inclusive campus?', 'most-inclusive', 'vibes', '2026-01', TRUE, 9),
('Which campus has the best green spaces to chill?', 'best-green-spaces', 'vibes', '2026-01', TRUE, 10),
('Where would you take a campus photoshoot?', 'best-photoshoot-spot', 'vibes', '2026-01', TRUE, 11),
('Which uni has the coolest student clubs and societies?', 'coolest-clubs', 'vibes', '2026-01', TRUE, 12),
('Best campus music and entertainment scene?', 'best-music-scene', 'vibes', '2026-01', TRUE, 13),
('Which campus has the most legendary stories?', 'legendary-stories', 'vibes', '2026-01', TRUE, 14),
('Best campus fashion and drip?', 'best-fashion', 'vibes', '2026-01', TRUE, 15),
('Which uni has the most fun traditions?', 'best-traditions', 'vibes', '2026-01', TRUE, 16),
('Most romantic campus for dates?', 'most-romantic', 'vibes', '2026-01', TRUE, 17),
('Which campus is most TikTok famous?', 'most-tiktok', 'vibes', '2026-01', TRUE, 18),
('Best place to make memories that last forever?', 'best-memories', 'vibes', '2026-01', TRUE, 19),
('Which campus feels most like a movie set?', 'movie-vibes', 'vibes', '2026-01', TRUE, 20),

-- ----------------------------------------------------------------------------
-- CATEGORY: ACADEMICS (Learning & Programs) - 18 polls
-- Structured around SCHOOLS not individual courses
-- ----------------------------------------------------------------------------
('Which uni has the strongest academic reputation overall?', 'strongest-academics', 'academics', '2026-01', TRUE, 1),
('Best library and study spaces?', 'best-library', 'academics', '2026-01', TRUE, 2),
('Which uni has the most helpful and accessible lecturers?', 'helpful-lecturers', 'academics', '2026-01', TRUE, 3),
('Best School of Engineering & Technology?', 'best-engineering-school', 'academics', '2026-01', TRUE, 4),
('Best School of Business & Economics?', 'best-business-school', 'academics', '2026-01', TRUE, 5),
('Best School of Computing & IT?', 'best-computing-school', 'academics', '2026-01', TRUE, 6),
('Best School of Health Sciences & Medicine?', 'best-health-sciences', 'academics', '2026-01', TRUE, 7),
('Best School of Law & Governance?', 'best-law-school', 'academics', '2026-01', TRUE, 8),
('Best School of Arts, Media & Communications?', 'best-arts-media', 'academics', '2026-01', TRUE, 9),
('Best School of Education & Teaching?', 'best-education-school', 'academics', '2026-01', TRUE, 10),
('Best School of Agriculture & Environmental Sciences?', 'best-agriculture-school', 'academics', '2026-01', TRUE, 11),
('Best School of Architecture & Design?', 'best-architecture-school', 'academics', '2026-01', TRUE, 12),
('Which uni has the best research opportunities?', 'best-research', 'academics', '2026-01', TRUE, 13),
('Most industry-relevant curriculum (real-world skills)?', 'industry-relevant', 'academics', '2026-01', TRUE, 14),
('Best internship and attachment placements?', 'best-internships', 'academics', '2026-01', TRUE, 15),
('Which campus has the fastest WiFi?', 'fastest-wifi', 'academics', '2026-01', TRUE, 16),
('Best campus for serious, focused studying?', 'best-study-environment', 'academics', '2026-01', TRUE, 17),
('Which uni has the best guest speakers and industry connections?', 'best-guest-speakers', 'academics', '2026-01', TRUE, 18),

-- ----------------------------------------------------------------------------
-- CATEGORY: SPORTS (Athletics & Fitness) - 15 polls
-- Kenyan students LOVE sports - this drives major rivalry
-- ----------------------------------------------------------------------------
('Which uni has the best sports facilities overall?', 'best-sports-facilities', 'sports', '2026-01', TRUE, 1),
('Best football (soccer) program?', 'best-football', 'sports', '2026-01', TRUE, 2),
('Best basketball program?', 'best-basketball', 'sports', '2026-01', TRUE, 3),
('Best rugby program?', 'best-rugby', 'sports', '2026-01', TRUE, 4),
('Best volleyball program?', 'best-volleyball', 'sports', '2026-01', TRUE, 5),
('Best athletics and track program?', 'best-athletics', 'sports', '2026-01', TRUE, 6),
('Best gym and fitness center?', 'best-gym', 'sports', '2026-01', TRUE, 7),
('Which uni dominates inter-university sports tournaments?', 'tournament-dominance', 'sports', '2026-01', TRUE, 8),
('Most athletic and fit student body?', 'most-athletic-students', 'sports', '2026-01', TRUE, 9),
('Best swimming pool and aquatic facilities?', 'best-pool', 'sports', '2026-01', TRUE, 10),
('Which campus has the most passionate sports fans?', 'best-sports-fans', 'sports', '2026-01', TRUE, 11),
('Best cheerleading and dance squad?', 'best-cheerleaders', 'sports', '2026-01', TRUE, 12),
('Best campus for morning runs and outdoor fitness?', 'best-running-campus', 'sports', '2026-01', TRUE, 13),
('Which uni has the best sports culture and spirit?', 'best-sports-culture', 'sports', '2026-01', TRUE, 14),
('Best intramural and casual sports scene?', 'best-casual-sports', 'sports', '2026-01', TRUE, 15),

-- ----------------------------------------------------------------------------
-- CATEGORY: SOCIAL (Community & Networking) - 15 polls
-- The "brotherhood/sisterhood" factor
-- ----------------------------------------------------------------------------
('Friendliest and most welcoming campus?', 'friendliest-campus', 'social', '2026-01', TRUE, 1),
('Best place to network and make connections?', 'best-networking', 'social', '2026-01', TRUE, 2),
('Which uni has the strongest alumni network?', 'strongest-alumni-network', 'social', '2026-01', TRUE, 3),
('Best campus for entrepreneurs and hustlers?', 'best-for-entrepreneurs', 'social', '2026-01', TRUE, 4),
('Most supportive peer community?', 'most-supportive-peers', 'social', '2026-01', TRUE, 5),
('Best campus for side hustles and gigs?', 'best-side-hustles', 'social', '2026-01', TRUE, 6),
('Which uni has the best mentorship programs?', 'best-mentorship', 'social', '2026-01', TRUE, 7),
('Best campus for tech enthusiasts and developers?', 'best-for-tech', 'social', '2026-01', TRUE, 8),
('Most politically active and engaged campus?', 'most-politically-active', 'social', '2026-01', TRUE, 9),
('Best campus for volunteer and community service?', 'best-volunteering', 'social', '2026-01', TRUE, 10),
('Which campus feels most like a tight-knit family?', 'most-family-vibes', 'social', '2026-01', TRUE, 11),
('Best place to find your tribe and best friends?', 'find-your-tribe', 'social', '2026-01', TRUE, 12),
('Most empowering campus for women?', 'empowering-women', 'social', '2026-01', TRUE, 13),
('Best campus for international and exchange students?', 'best-international', 'social', '2026-01', TRUE, 14),
('Which uni has the most fun campus rivalries?', 'best-rivalries', 'social', '2026-01', TRUE, 15),

-- ----------------------------------------------------------------------------
-- CATEGORY: FACILITIES (Infrastructure & Services) - 15 polls
-- The practical stuff students care about daily
-- ----------------------------------------------------------------------------
('Which campus has the most modern facilities overall?', 'most-modern-facilities', 'facilities', '2026-01', TRUE, 1),
('Cleanest and best-maintained campus?', 'cleanest-campus', 'facilities', '2026-01', TRUE, 2),
('Best campus food and dining options?', 'best-food', 'facilities', '2026-01', TRUE, 3),
('Cheapest but tastiest food on campus?', 'best-value-food', 'facilities', '2026-01', TRUE, 4),
('Best coffee and study café spot?', 'best-coffee-spot', 'facilities', '2026-01', TRUE, 5),
('Best hostels and student accommodation?', 'best-hostels', 'facilities', '2026-01', TRUE, 6),
('Best campus security and safety?', 'best-security', 'facilities', '2026-01', TRUE, 7),
('Most eco-friendly and green campus?', 'most-eco-friendly', 'facilities', '2026-01', TRUE, 8),
('Best computer labs and tech resources?', 'best-computer-labs', 'facilities', '2026-01', TRUE, 9),
('Best lecture halls and classrooms?', 'best-lecture-halls', 'facilities', '2026-01', TRUE, 10),
('Best campus medical and health services?', 'best-medical-services', 'facilities', '2026-01', TRUE, 11),
('Most accessible campus (transport & parking)?', 'most-accessible-transport', 'facilities', '2026-01', TRUE, 12),
('Best campus for commuter students?', 'best-for-commuters', 'facilities', '2026-01', TRUE, 13),
('Best campus architecture and design?', 'best-architecture', 'facilities', '2026-01', TRUE, 14),
('Best recreational and chill-out spaces?', 'best-recreation', 'facilities', '2026-01', TRUE, 15)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 3. VERIFICATION QUERIES (Run these to confirm)
-- ============================================================================
-- SELECT COUNT(*) as total_universities FROM universities;
-- Should return: 20

-- SELECT COUNT(*) as total_polls FROM polls;
-- Should return: 95 core polls

-- SELECT category, COUNT(*) as count FROM polls GROUP BY category ORDER BY count DESC;
-- Should show:
-- vibes: 20
-- academics: 18
-- sports: 15
-- social: 15
-- facilities: 15
-- general: 12

-- ============================================================================
-- PERMANENT SEED COMPLETE! ✅
-- 
-- What you seeded:
-- ✅ 20 Kenyan universities (public + private)
-- ✅ 95 high-engagement polls across 6 categories
-- ✅ Structured around what Kenyan students ACTUALLY compete over
-- ✅ Academics focused on SCHOOLS not individual courses
-- ✅ Ready for viral social media sharing
--
-- Next: Run seed-2-mockup.sql for development visualization data
-- ============================================================================