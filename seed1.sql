-- ============================================================================
-- UniPulse MVP - PRODUCTION SEED DATA
-- 20 Universities + 150+ Addictive Polls
-- ============================================================================

-- ============================================================================
-- 1. UNIVERSITIES (All 20 from your list)
-- ============================================================================
INSERT INTO universities (id, slug, name, short_name, type, location, color) VALUES
-- PUBLIC UNIVERSITIES
('uon', 'uon', 'University of Nairobi', 'UoN', 'Public', 'Nairobi CBD', '#1E3A8A'),
('ku', 'ku', 'Kenyatta University', 'KU', 'Public', 'Kahawa Sukari', '#0F766E'),
('jkuat', 'jkuat', 'Jomo Kenyatta University of Agriculture & Technology', 'JKUAT', 'Public', 'Juja', '#15803D'),
('moi', 'moi', 'Moi University', 'Moi', 'Public', 'Eldoret', '#B45309'),
('egerton', 'egerton', 'Egerton University', 'Egerton', 'Public', 'Njoro', '#047857'),
('maseno', 'maseno', 'Maseno University', 'Maseno', 'Public', 'Kisumu', '#1D4ED8'),
('tuk', 'tuk', 'Technical University of Kenya', 'TUK', 'Public', 'Nairobi CBD', '#DC2626'),
('mmust', 'mmust', 'Masinde Muliro University', 'MMUST', 'Public', 'Kakamega', '#2563EB'),
('dekut', 'dekut', 'Dedan Kimathi University of Technology', 'DeKUT', 'Public', 'Nyeri', '#4B5563'),
('mmu', 'mmu', 'Multimedia University of Kenya', 'MMU', 'Public', 'Rongai', '#7C3AED'),

-- PRIVATE UNIVERSITIES
('strath', 'strath', 'Strathmore University', 'Strathmore', 'Private', 'Madaraka', '#1e3a8a'),
('usiu', 'usiu', 'United States International University – Africa', 'USIU', 'Private', 'Roysambu', '#F59E0B'),
('daystar', 'daystar', 'Daystar University', 'Daystar', 'Private', 'Athi River / Valley Rd', '#0EA5E9'),
('mku', 'mku', 'Mount Kenya University', 'MKU', 'Private', 'Thika', '#2563EB'),
('cuea', 'cuea', 'Catholic University of Eastern Africa', 'CUEA', 'Private', 'Karen', '#DC2626'),
('kca', 'kca', 'KCA University', 'KCA', 'Private', 'Ruaraka', '#7C3AED'),
('zetech', 'zetech', 'Zetech University', 'Zetech', 'Private', 'Ruiru', '#2563EB'),
('anu', 'anu', 'Africa Nazarene University', 'ANU', 'Private', 'Ongata Rongai', '#B91C1C'),
('riara', 'riara', 'Riara University', 'Riara', 'Private', 'Mbagathi Way', '#D97706'),
('kabarak', 'kabarak', 'Kabarak University', 'Kabarak', 'Private', 'Nakuru', '#4B5563')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. POLLS - 150+ ADDICTIVE QUESTIONS ACROSS CATEGORIES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- CATEGORY: VIBES & CAMPUS LIFE (35 polls)
-- ----------------------------------------------------------------------------
INSERT INTO polls (question, slug, category) VALUES
('Which university has the best campus vibes overall?', 'best-campus-vibes', 'vibes'),
('Which campus feels most like home?', 'feels-like-home', 'vibes'),
('Where would you spend a lazy Sunday afternoon?', 'lazy-sunday-campus', 'vibes'),
('Which uni has the most Instagram-worthy spots?', 'most-instagrammable', 'vibes'),
('Best place to meet new friends?', 'best-for-friends', 'vibes'),
('Which campus has the chillest atmosphere?', 'chillest-campus', 'vibes'),
('Where do the most creative students hang out?', 'most-creative-students', 'vibes'),
('Which uni throws the best parties?', 'best-parties', 'vibes'),
('Most fun orientation week?', 'best-orientation', 'vibes'),
('Which campus has the best student events?', 'best-events', 'vibes'),
('Where would you want to celebrate your birthday?', 'birthday-celebration', 'vibes'),
('Which uni has the best campus radio station?', 'best-campus-radio', 'vibes'),
('Most likely to have a viral TikTok trend?', 'viral-tiktok-campus', 'vibes'),
('Best campus for introverts?', 'best-for-introverts', 'vibes'),
('Best campus for extroverts?', 'best-for-extroverts', 'vibes'),
('Which uni has the most school spirit?', 'most-school-spirit', 'vibes'),
('Where would you film a student short film?', 'best-film-location', 'vibes'),
('Most beautiful campus at sunset?', 'best-sunset-campus', 'vibes'),
('Which campus has the best green spaces?', 'best-green-spaces', 'vibes'),
('Best place to have a picnic on campus?', 'best-picnic-spot', 'vibes'),
('Which uni has the coolest student clubs?', 'coolest-clubs', 'vibes'),
('Where do the most interesting conversations happen?', 'best-conversations', 'vibes'),
('Most diverse and inclusive campus?', 'most-inclusive', 'vibes'),
('Which campus has the best music scene?', 'best-music-scene', 'vibes'),
('Best campus for night owls?', 'best-for-night-owls', 'vibes'),
('Which uni has the most legendary campus stories?', 'legendary-stories', 'vibes'),
('Best campus for artists and performers?', 'best-for-artists', 'vibes'),
('Where would you want to do a flash mob?', 'best-flash-mob-spot', 'vibes'),
('Which campus has the best Valentine''s Day vibes?', 'best-valentines', 'vibes'),
('Most romantic campus for dates?', 'most-romantic', 'vibes'),
('Best campus fashion scene?', 'best-fashion', 'vibes'),
('Which uni has the coolest traditions?', 'coolest-traditions', 'vibes'),
('Where do the trendsetters go?', 'trendsetters-uni', 'vibes'),
('Best campus for making memories?', 'best-memories', 'vibes'),
('Which uni feels most like a movie set?', 'movie-set-vibes', 'vibes'),

-- ----------------------------------------------------------------------------
-- CATEGORY: SPORTS & FITNESS (25 polls)
-- ----------------------------------------------------------------------------
('Which university has the best sports facilities?', 'best-sports-facilities', 'sports'),
('Best gym on campus?', 'best-gym', 'sports'),
('Which uni dominates in football?', 'best-football', 'sports'),
('Best basketball team?', 'best-basketball', 'sports'),
('Which campus has the best running tracks?', 'best-running-track', 'sports'),
('Most athletic student body?', 'most-athletic', 'sports'),
('Best volleyball program?', 'best-volleyball', 'sports'),
('Which uni has the best swimming pool?', 'best-pool', 'sports'),
('Best rugby team?', 'best-rugby', 'sports'),
('Which campus has the best yoga/fitness classes?', 'best-fitness-classes', 'sports'),
('Most competitive sports culture?', 'most-competitive-sports', 'sports'),
('Best cheerleading squad?', 'best-cheerleaders', 'sports'),
('Which uni wins most inter-university tournaments?', 'most-tournament-wins', 'sports'),
('Best tennis courts?', 'best-tennis', 'sports'),
('Which campus has the best outdoor adventure club?', 'best-adventure-club', 'sports'),
('Best place to play casual sports?', 'casual-sports', 'sports'),
('Which uni has the most supportive sports fans?', 'best-sports-fans', 'sports'),
('Best athletics track and field program?', 'best-athletics', 'sports'),
('Which campus has the best sports scholarships?', 'best-sports-scholarships', 'sports'),
('Most fun intramural sports?', 'best-intramural', 'sports'),
('Best campus for morning runs?', 'best-morning-runs', 'sports'),
('Which uni has the best table tennis setup?', 'best-table-tennis', 'sports'),
('Best badminton facilities?', 'best-badminton', 'sports'),
('Which campus is best for fitness enthusiasts?', 'best-for-fitness', 'sports'),
('Most improved sports program in recent years?', 'most-improved-sports', 'sports'),

-- ----------------------------------------------------------------------------
-- CATEGORY: ACADEMICS & LEARNING (30 polls)
-- ----------------------------------------------------------------------------
('Which university has the best academic reputation?', 'best-academic-reputation', 'academics'),
('Best library on campus?', 'best-library', 'academics'),
('Where do the smartest students go?', 'smartest-students', 'academics'),
('Best engineering program?', 'best-engineering', 'academics'),
('Best business school?', 'best-business-school', 'academics'),
('Best computer science/IT program?', 'best-cs-program', 'academics'),
('Which uni has the most helpful lecturers?', 'most-helpful-lecturers', 'academics'),
('Best medicine program?', 'best-medicine', 'academics'),
('Most innovative teaching methods?', 'most-innovative-teaching', 'academics'),
('Best law school?', 'best-law-school', 'academics'),
('Which campus has the best WiFi?', 'best-wifi', 'academics'),
('Best place for group study sessions?', 'best-group-study', 'academics'),
('Which uni has the best research opportunities?', 'best-research', 'academics'),
('Best architecture program?', 'best-architecture', 'academics'),
('Most challenging academic environment?', 'most-challenging-academics', 'academics'),
('Best journalism/communications program?', 'best-journalism', 'academics'),
('Which uni has the best online learning resources?', 'best-online-resources', 'academics'),
('Best agriculture/environmental sciences program?', 'best-agriculture', 'academics'),
('Most industry-relevant curriculum?', 'most-industry-relevant', 'academics'),
('Best internship placement rate?', 'best-internships', 'academics'),
('Which uni prepares you best for real jobs?', 'best-job-prep', 'academics'),
('Best education/teaching program?', 'best-education', 'academics'),
('Most accessible professors outside class?', 'most-accessible-profs', 'academics'),
('Best psychology program?', 'best-psychology', 'academics'),
('Which campus has the quietest study spots?', 'quietest-study-spots', 'academics'),
('Best performing arts program?', 'best-performing-arts', 'academics'),
('Most rigorous exam standards?', 'most-rigorous-exams', 'academics'),
('Best science labs and equipment?', 'best-labs', 'academics'),
('Which uni has the best guest lecturers?', 'best-guest-lecturers', 'academics'),
('Most supportive academic advisors?', 'best-advisors', 'academics'),

-- ----------------------------------------------------------------------------
-- CATEGORY: FOOD & DINING (15 polls)
-- ----------------------------------------------------------------------------
('Which campus has the best food options?', 'best-food', 'food'),
('Cheapest but tastiest campus meals?', 'best-value-food', 'food'),
('Best coffee spot on campus?', 'best-coffee', 'food'),
('Which uni has the most food variety?', 'most-food-variety', 'food'),
('Best late-night eats near campus?', 'best-late-night-food', 'food'),
('Healthiest meal options?', 'healthiest-food', 'food'),
('Best place to grab lunch between classes?', 'best-quick-lunch', 'food'),
('Which campus has the best cafeteria vibes?', 'best-cafeteria-vibes', 'food'),
('Best campus for foodies?', 'best-for-foodies', 'food'),
('Which uni has the best samosas?', 'best-samosas', 'food'),
('Best chapati and beans spot?', 'best-chapati-beans', 'food'),
('Most affordable campus meals?', 'most-affordable-meals', 'food'),
('Best place for student hangouts over food?', 'best-food-hangout', 'food'),
('Which campus has the best juice bar?', 'best-juice-bar', 'food'),
('Best spot for a study snack?', 'best-study-snack', 'food'),

-- ----------------------------------------------------------------------------
-- CATEGORY: FACILITIES & INFRASTRUCTURE (20 polls)
-- ----------------------------------------------------------------------------
('Which university has the most modern facilities?', 'most-modern-facilities', 'facilities'),
('Best campus architecture?', 'best-architecture-design', 'facilities'),
('Cleanest campus?', 'cleanest-campus', 'facilities'),
('Best maintained grounds?', 'best-maintained', 'facilities'),
('Which campus has the best auditoriums?', 'best-auditoriums', 'facilities'),
('Most accessible campus for students with disabilities?', 'most-accessible', 'facilities'),
('Best computer labs?', 'best-computer-labs', 'facilities'),
('Which uni has the best hostel/accommodation?', 'best-hostels', 'facilities'),
('Best campus security?', 'best-security', 'facilities'),
('Most eco-friendly campus?', 'most-eco-friendly', 'facilities'),
('Best recreational facilities?', 'best-recreation', 'facilities'),
('Which campus has the best parking?', 'best-parking', 'facilities'),
('Best lecture halls and classrooms?', 'best-lecture-halls', 'facilities'),
('Which uni has the best medical center?', 'best-medical-center', 'facilities'),
('Best campus bookstore?', 'best-bookstore', 'facilities'),
('Most convenient campus location?', 'most-convenient-location', 'facilities'),
('Best campus for commuters?', 'best-for-commuters', 'facilities'),
('Which campus has the best water fountains/hydration spots?', 'best-hydration', 'facilities'),
('Best printing/photocopying services?', 'best-printing', 'facilities'),
('Most Instagrammable campus buildings?', 'most-photogenic-buildings', 'facilities'),

-- ----------------------------------------------------------------------------
-- CATEGORY: SOCIAL & COMMUNITY (20 polls)
-- ----------------------------------------------------------------------------
('Friendliest campus community?', 'friendliest-community', 'social'),
('Best place to network and make connections?', 'best-networking', 'social'),
('Which uni has the strongest alumni network?', 'strongest-alumni', 'social'),
('Best campus for entrepreneurs and startups?', 'best-for-entrepreneurs', 'social'),
('Most supportive student government?', 'best-student-government', 'social'),
('Which campus has the best mentorship programs?', 'best-mentorship', 'social'),
('Best uni for tech enthusiasts and coders?', 'best-for-tech', 'social'),
('Most politically active campus?', 'most-politically-active', 'social'),
('Best campus for volunteer opportunities?', 'best-volunteering', 'social'),
('Which uni has the most fun rivalries?', 'best-rivalries', 'social'),
('Best place for international students?', 'best-for-international', 'social'),
('Most welcoming to first-generation students?', 'best-first-gen', 'social'),
('Which campus has the best peer support?', 'best-peer-support', 'social'),
('Best uni for side hustles and gigs?', 'best-side-hustles', 'social'),
('Most collaborative (not competitive) environment?', 'most-collaborative', 'social'),
('Which campus has the best debate culture?', 'best-debate-culture', 'social'),
('Best place to find your passion?', 'find-your-passion', 'social'),
('Most empowering campus for women?', 'most-empowering-women', 'social'),
('Which uni feels most like a tight-knit family?', 'most-family-like', 'social'),
('Best campus for finding your tribe?', 'find-your-tribe', 'social'),

-- ----------------------------------------------------------------------------
-- CATEGORY: GENERAL / VALUE (15 polls)
-- ----------------------------------------------------------------------------
('Which university offers the best overall value for money?', 'best-value', 'general'),
('Best ROI (Return on Investment)?', 'best-roi', 'general'),
('Which uni would you recommend to a younger sibling?', 'recommend-to-sibling', 'general'),
('Best university to start your career from?', 'best-career-start', 'general'),
('Which uni has the best reputation among employers?', 'best-employer-reputation', 'general'),
('If you could do it all over again, which uni would you choose?', 'do-over-choice', 'general'),
('Best campus for personal growth?', 'best-personal-growth', 'general'),
('Which uni makes you most proud to be an alumni?', 'most-proud-alumni', 'general'),
('Best university experience overall?', 'best-overall-experience', 'general'),
('Most underrated university?', 'most-underrated', 'general'),
('Most overrated university?', 'most-overrated', 'general'),
('Which uni exceeded your expectations?', 'exceeded-expectations', 'general'),
('Best campus to spend 4 years of your life?', 'best-4-years', 'general'),
('Which uni has the happiest students?', 'happiest-students', 'general'),
('Best university for building lifelong friendships?', 'best-friendships', 'general')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 3. VERIFICATION QUERIES (Run these after seeding to confirm)
-- ============================================================================
-- Check university count (should be 20)
-- SELECT COUNT(*) as total_universities FROM universities;

-- Check poll count (should be 160)
-- SELECT COUNT(*) as total_polls FROM polls;

-- Check polls per category
-- SELECT category, COUNT(*) as poll_count FROM polls GROUP BY category ORDER BY poll_count DESC;

-- ============================================================================
-- DONE! 🎉
-- You now have 20 universities and 160 addictive polls ready to go!
-- ============================================================================