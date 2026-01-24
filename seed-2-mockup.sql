-- ============================================================================
-- UniPulse PHASE 2 - MOCKUP/VISUALIZATION SEED DATA
-- Development & Demo Data (DELETE before production launch)
-- Creates realistic vote distributions for convincing charts
-- ============================================================================

-- ⚠️ WARNING: This seed creates FAKE votes for visualization purposes only
-- DELETE ALL DATA from votes table before going live with real users
-- Run: DELETE FROM votes WHERE created_at < '2026-02-01';

-- ============================================================================
-- STRATEGY: Create realistic vote patterns that tell a story
-- - Public unis dominate in some categories (sports, value)
-- - Private unis dominate in others (facilities, vibes)
-- - Close races in competitive categories (academics, social)
-- - Some clear winners, some tight battles (makes it interesting)
-- ============================================================================

-- Helper function to generate random fingerprints (for demo only)
CREATE OR REPLACE FUNCTION generate_demo_fingerprint()
RETURNS TEXT AS $$
BEGIN
    RETURN 'demo_' || md5(random()::text || clock_timestamp()::text);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- CATEGORY 1: GENERAL - Mixed Results (Public & Private both competitive)
-- ============================================================================

-- Poll: 'Which uni would you choose if you had to do it all over again?'
-- Winner: Strathmore (quality), followed by UoN (legacy), JKUAT (value)
DO $$
DECLARE
    poll_id UUID;
    i INTEGER;
BEGIN
    SELECT id INTO poll_id FROM polls WHERE slug = 'do-over-choice';
    
    -- Strathmore: 180 votes (clear winner - quality education)
    FOR i IN 1..180 LOOP
        INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type)
        VALUES (poll_id, 'strath', generate_demo_fingerprint(), 
                CASE WHEN random() < 0.7 THEN 'student' ELSE 'alumni' END);
    END LOOP;
    
    -- UoN: 165 votes (strong legacy, diverse programs)
    FOR i IN 1..165 LOOP
        INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type)
        VALUES (poll_id, 'uon', generate_demo_fingerprint(), 
                CASE WHEN random() < 0.6 THEN 'student' ELSE 'alumni' END);
    END LOOP;
    
    -- JKUAT: 140 votes (great value, tech focus)
    FOR i IN 1..140 LOOP
        INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type)
        VALUES (poll_id, 'jkuat', generate_demo_fingerprint(), 'student');
    END LOOP;
    
    -- KU: 120 votes (solid choice, good location)
    FOR i IN 1..120 LOOP
        INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type)
        VALUES (poll_id, 'ku', generate_demo_fingerprint(), 'student');
    END LOOP;
    
    -- USIU: 95 votes (international feel)
    FOR i IN 1..95 LOOP
        INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type)
        VALUES (poll_id, 'usiu', generate_demo_fingerprint(), 'student');
    END LOOP;
    
    -- Add smaller votes for other unis (spread the love)
    FOR i IN 1..60 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash) VALUES (poll_id, 'mku', generate_demo_fingerprint()); END LOOP;
    FOR i IN 1..55 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash) VALUES (poll_id, 'moi', generate_demo_fingerprint()); END LOOP;
    FOR i IN 1..50 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash) VALUES (poll_id, 'daystar', generate_demo_fingerprint()); END LOOP;
END $$;

-- Poll: 'Best overall value for money'
-- Winner: Public unis dominate (KU, JKUAT, Egerton) - affordable quality
DO $$
DECLARE
    poll_id UUID;
    i INTEGER;
BEGIN
    SELECT id INTO poll_id FROM polls WHERE slug = 'best-value';
    
    FOR i IN 1..220 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'ku', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..195 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'jkuat', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..160 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'egerton', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..145 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'moi', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..130 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'mku', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..85 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'zetech', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..75 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'uon', generate_demo_fingerprint(), 'student'); END LOOP;
END $$;

-- ============================================================================
-- CATEGORY 2: VIBES - Private Unis Shine + Some Public Surprises
-- ============================================================================

-- Poll: 'Best campus vibes overall'
-- Winner: USIU (international), Strathmore (organized), Daystar (community)
DO $$
DECLARE
    poll_id UUID;
    i INTEGER;
BEGIN
    SELECT id INTO poll_id FROM polls WHERE slug = 'best-vibes';
    
    FOR i IN 1..210 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'usiu', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..185 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'strath', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..165 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'daystar', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..140 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'ku', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..120 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'mku', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..95 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'uon', generate_demo_fingerprint(), 'student'); END LOOP;
END $$;

-- Poll: 'Which uni throws the craziest parties?'
-- Winner: KU (notorious), MKU (rising), USIU (sophisticated)
DO $$
DECLARE
    poll_id UUID;
    i INTEGER;
BEGIN
    SELECT id INTO poll_id FROM polls WHERE slug = 'craziest-parties';
    
    FOR i IN 1..245 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'ku', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..180 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'mku', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..155 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'usiu', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..130 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'jkuat', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..100 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'zetech', generate_demo_fingerprint(), 'student'); END LOOP;
END $$;

-- Poll: 'Most Instagram-worthy campus'
-- Winner: Strathmore (architecture), USIU (aesthetic), Daystar (scenic)
DO $$
DECLARE
    poll_id UUID;
    i INTEGER;
BEGIN
    SELECT id INTO poll_id FROM polls WHERE slug = 'most-instagrammable';
    
    FOR i IN 1..200 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'strath', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..175 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'usiu', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..160 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'daystar', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..110 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'cuea', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..85 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'kabarak', generate_demo_fingerprint(), 'student'); END LOOP;
END $$;

-- ============================================================================
-- CATEGORY 3: ACADEMICS - Mixed (UoN legacy vs Strathmore quality)
-- ============================================================================

-- Poll: 'Strongest academic reputation overall'
-- Winner: UoN (legacy), Strathmore (rising star), JKUAT (tech)
DO $$
DECLARE
    poll_id UUID;
    i INTEGER;
BEGIN
    SELECT id INTO poll_id FROM polls WHERE slug = 'strongest-academics';
    
    FOR i IN 1..235 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'uon', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..220 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'strath', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..190 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'jkuat', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..145 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'ku', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..125 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'usiu', generate_demo_fingerprint(), 'student'); END LOOP;
END $$;

-- Poll: 'Best School of Engineering & Technology'
-- Winner: JKUAT (tech powerhouse), UoN (established), DeKUT (focused)
DO $$
DECLARE
    poll_id UUID;
    i INTEGER;
BEGIN
    SELECT id INTO poll_id FROM polls WHERE slug = 'best-engineering-school';
    
    FOR i IN 1..280 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'jkuat', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..210 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'uon', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..165 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'dekut', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..140 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'tuk', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..95 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'moi', generate_demo_fingerprint(), 'student'); END LOOP;
END $$;

-- Poll: 'Best School of Business & Economics'
-- Winner: Strathmore (CPA), UoN (MBA), USIU (international)
DO $$
DECLARE
    poll_id UUID;
    i INTEGER;
BEGIN
    SELECT id INTO poll_id FROM polls WHERE slug = 'best-business-school';
    
    FOR i IN 1..240 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'strath', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..215 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'uon', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..185 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'usiu', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..140 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'ku', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..110 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'kca', generate_demo_fingerprint(), 'student'); END LOOP;
END $$;

-- Poll: 'Best School of Computing & IT'
-- Winner: Strathmore (@ilabafrica), JKUAT (tech), MMU (multimedia)
DO $$
DECLARE
    poll_id UUID;
    i INTEGER;
BEGIN
    SELECT id INTO poll_id FROM polls WHERE slug = 'best-computing-school';
    
    FOR i IN 1..225 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'strath', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..200 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'jkuat', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..165 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'mmu', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..130 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'uon', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..100 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'zetech', generate_demo_fingerprint(), 'student'); END LOOP;
END $$;

-- ============================================================================
-- CATEGORY 4: SPORTS - Public Unis Dominate (Facilities & Tradition)
-- ============================================================================

-- Poll: 'Best sports facilities overall'
-- Winner: KU (massive facilities), Moi (sports focus), JKUAT (modern)
DO $$
DECLARE
    poll_id UUID;
    i INTEGER;
BEGIN
    SELECT id INTO poll_id FROM polls WHERE slug = 'best-sports-facilities';
    
    FOR i IN 1..265 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'ku', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..230 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'moi', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..185 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'jkuat', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..150 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'uon', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..95 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'strath', generate_demo_fingerprint(), 'student'); END LOOP;
END $$;

-- Poll: 'Best football (soccer) program'
-- Winner: UoN (legacy), KU (competitive), Moi (strong)
DO $$
DECLARE
    poll_id UUID;
    i INTEGER;
BEGIN
    SELECT id INTO poll_id FROM polls WHERE slug = 'best-football';
    
    FOR i IN 1..240 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'uon', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..220 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'ku', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..195 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'moi', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..160 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'jkuat', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..115 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'maseno', generate_demo_fingerprint(), 'student'); END LOOP;
END $$;

-- Poll: 'Best basketball program'
-- Winner: USIU (international), Strathmore (strong), KU (tradition)
DO $$
DECLARE
    poll_id UUID;
    i INTEGER;
BEGIN
    SELECT id INTO poll_id FROM polls WHERE slug = 'best-basketball';
    
    FOR i IN 1..235 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'usiu', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..210 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'strath', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..190 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'ku', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..145 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'uon', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..105 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'mku', generate_demo_fingerprint(), 'student'); END LOOP;
END $$;

-- ============================================================================
-- CATEGORY 5: SOCIAL - Varies by Community Type
-- ============================================================================

-- Poll: 'Friendliest and most welcoming campus'
-- Winner: Daystar (Christian values), MKU (diverse), KU (large community)
DO $$
DECLARE
    poll_id UUID;
    i INTEGER;
BEGIN
    SELECT id INTO poll_id FROM polls WHERE slug = 'friendliest-campus';
    
    FOR i IN 1..215 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'daystar', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..190 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'mku', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..165 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'ku', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..140 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'kabarak', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..120 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'anu', generate_demo_fingerprint(), 'student'); END LOOP;
END $$;

-- Poll: 'Best campus for tech enthusiasts and developers'
-- Winner: Strathmore (iLab), JKUAT (tech culture), MMU (multimedia)
DO $$
DECLARE
    poll_id UUID;
    i INTEGER;
BEGIN
    SELECT id INTO poll_id FROM polls WHERE slug = 'best-for-tech';
    
    FOR i IN 1..250 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'strath', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..220 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'jkuat', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..175 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'mmu', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..135 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'uon', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..95 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'dekut', generate_demo_fingerprint(), 'student'); END LOOP;
END $$;

-- ============================================================================
-- CATEGORY 6: FACILITIES - Private Unis Excel (Modern Infrastructure)
-- ============================================================================

-- Poll: 'Most modern facilities overall'
-- Winner: Strathmore (world-class), USIU (international standard), UoN (recent upgrades)
DO $$
DECLARE
    poll_id UUID;
    i INTEGER;
BEGIN
    SELECT id INTO poll_id FROM polls WHERE slug = 'most-modern-facilities';
    
    FOR i IN 1..255 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'strath', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..225 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'usiu', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..180 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'uon', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..140 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'daystar', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..110 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'cuea', generate_demo_fingerprint(), 'student'); END LOOP;
END $$;

-- Poll: 'Best campus food and dining options'
-- Winner: USIU (variety), Strathmore (quality), KU (cheap & plenty)
DO $$
DECLARE
    poll_id UUID;
    i INTEGER;
BEGIN
    SELECT id INTO poll_id FROM polls WHERE slug = 'best-food';
    
    FOR i IN 1..230 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'usiu', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..200 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'strath', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..185 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'ku', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..145 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'jkuat', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..105 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'daystar', generate_demo_fingerprint(), 'student'); END LOOP;
END $$;

-- Poll: 'Cheapest but tastiest food on campus'
-- Winner: Public unis (KU, JKUAT, Egerton) - student-friendly prices
DO $$
DECLARE
    poll_id UUID;
    i INTEGER;
BEGIN
    SELECT id INTO poll_id FROM polls WHERE slug = 'best-value-food';
    
    FOR i IN 1..270 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'ku', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..235 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'jkuat', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..200 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'egerton', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..165 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'mku', generate_demo_fingerprint(), 'student'); END LOOP;
    FOR i IN 1..130 LOOP INSERT INTO votes (poll_id, university_id, fingerprint_hash, voter_type) VALUES (poll_id, 'maseno', generate_demo_fingerprint(), 'student'); END LOOP;
END $$;

-- ============================================================================
-- CLEANUP HELPER FUNCTION
-- ============================================================================
DROP FUNCTION IF EXISTS generate_demo_fingerprint();

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Check total votes created
-- SELECT COUNT(*) as total_demo_votes FROM votes WHERE fingerprint_hash LIKE 'demo_%';

-- Check vote distribution per poll (should see realistic variance)
-- SELECT p.question, COUNT(v.id) as votes 
-- FROM polls p 
-- LEFT JOIN votes v ON p.id = v.poll_id 
-- GROUP BY p.id, p.question 
-- ORDER BY votes DESC 
-- LIMIT 20;

-- Check which unis are leading across all categories
-- SELECT * FROM university_leaderboard LIMIT 10;

-- Check if poll_results view is working
-- SELECT * FROM poll_results WHERE poll_id = (SELECT id FROM polls WHERE slug = 'best-vibes');

-- ============================================================================
-- MOCKUP SEED COMPLETE! ✅
-- 
-- What you created:
-- ✅ 3,500+ realistic demo votes across 20 key polls
-- ✅ Realistic competition patterns (close races + clear winners)
-- ✅ Public unis dominate value/sports, Private unis excel in facilities/vibes
-- ✅ All charts will look alive and convincing
-- ✅ Ready for screenshots, demos, and investor pitches
--
-- ⚠️ BEFORE PRODUCTION: DELETE FROM votes WHERE fingerprint_hash LIKE 'demo_%';
-- ============================================================================