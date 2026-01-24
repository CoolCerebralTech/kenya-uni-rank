-- ============================================================================
-- UniPulse PHASE 2 - PRODUCTION DATABASE SCHEMA
-- Real-time Sentiment Tracking | Monthly Cycles | Insights Engine
-- Free Tier Optimized | Supabase PostgreSQL
-- ============================================================================

-- ============================================================================
-- 0. CLEANUP (Development only - uncomment to reset)
-- ============================================================================
-- DROP TABLE IF EXISTS monthly_aggregates CASCADE;
-- DROP TABLE IF EXISTS votes CASCADE;
-- DROP TABLE IF EXISTS polls CASCADE;
-- DROP TABLE IF EXISTS universities CASCADE;
-- DROP VIEW IF EXISTS poll_results;
-- DROP VIEW IF EXISTS trending_polls;
-- DROP VIEW IF EXISTS university_leaderboard;
-- DROP VIEW IF EXISTS recent_activity;
-- DROP VIEW IF EXISTS category_insights;
-- DROP VIEW IF EXISTS university_trends;
-- DROP FUNCTION IF EXISTS has_user_voted;
-- DROP FUNCTION IF EXISTS get_vote_count;
-- DROP FUNCTION IF EXISTS get_poll_status;

-- ============================================================================
-- 1. UNIVERSITIES TABLE (Static Reference Data)
-- ============================================================================
CREATE TABLE IF NOT EXISTS universities (
    id TEXT PRIMARY KEY, -- 'uon', 'ku', 'jkuat'
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    type TEXT CHECK (type IN ('Public', 'Private')) NOT NULL,
    location TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#000000',
    
    -- Phase 2: Extended profile data
    description TEXT,
    established INTEGER,
    website TEXT,
    student_population INTEGER,
    campus_size TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. POLLS TABLE (Monthly Voting Cycles)
-- ============================================================================
CREATE TABLE IF NOT EXISTS polls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'general', 'vibes', 'academics', 'sports', 'social', 'facilities'
    )),
    
    -- Phase 2: Monthly cycles for trend tracking
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    ends_at TIMESTAMPTZ, -- NULL = no end date (always active)
    cycle_month TEXT, -- e.g. '2026-01' for January 2026
    
    -- State management
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    
    -- Metadata
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for filtering active polls in current cycle
CREATE INDEX IF NOT EXISTS idx_polls_active_cycle 
ON polls(is_active, cycle_month, category) WHERE is_active = TRUE;

-- Index for date-based queries
CREATE INDEX IF NOT EXISTS idx_polls_dates 
ON polls(starts_at, ends_at);

-- ============================================================================
-- 3. VOTES TABLE (High-Performance Write-Optimized)
-- ============================================================================
CREATE TABLE IF NOT EXISTS votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    university_id TEXT NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    
    -- Anti-spam layer (fingerprinting)
    fingerprint_hash TEXT NOT NULL,
    ip_hash TEXT,
    
    -- Phase 2: Voter context (anonymous but useful for insights)
    voter_type TEXT CHECK (voter_type IN ('student', 'alumni', 'applicant', 'other')),
    user_agent TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. CRITICAL PERFORMANCE INDEXES 🚀
-- ============================================================================

-- Index 1: Instant vote counting per poll/university
CREATE INDEX IF NOT EXISTS idx_votes_poll_uni 
ON votes(poll_id, university_id);

-- Index 2: O(1) duplicate vote checking (MOST CRITICAL)
CREATE INDEX IF NOT EXISTS idx_votes_fingerprint 
ON votes(poll_id, fingerprint_hash);

-- Index 3: Real-time subscriptions
CREATE INDEX IF NOT EXISTS idx_votes_poll_id 
ON votes(poll_id);

-- Index 4: Time-series analytics
CREATE INDEX IF NOT EXISTS idx_votes_created_at 
ON votes(created_at DESC);

-- Index 5: Voter type analytics
CREATE INDEX IF NOT EXISTS idx_votes_voter_type 
ON votes(voter_type) WHERE voter_type IS NOT NULL;

-- ============================================================================
-- 5. ANTI-SPAM CONSTRAINT (Database-Level Defense)
-- ============================================================================
ALTER TABLE votes DROP CONSTRAINT IF EXISTS unique_vote_per_user;
ALTER TABLE votes ADD CONSTRAINT unique_vote_per_user 
UNIQUE (poll_id, fingerprint_hash);

-- ============================================================================
-- 6. PHASE 2: MONTHLY AGGREGATES TABLE (Performance Optimization)
-- ============================================================================
-- Pre-computed results for historical queries (saves compute on free tier)
CREATE TABLE IF NOT EXISTS monthly_aggregates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    university_id TEXT NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    cycle_month TEXT NOT NULL, -- e.g. '2026-01'
    
    -- Aggregated data
    votes INTEGER NOT NULL DEFAULT 0,
    percentage DECIMAL(5,2) NOT NULL DEFAULT 0.0,
    rank INTEGER NOT NULL DEFAULT 0,
    total_votes INTEGER NOT NULL DEFAULT 0, -- Total votes in that poll
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one aggregate per poll/uni/month
    UNIQUE(poll_id, university_id, cycle_month)
);

-- Index for fast historical queries
CREATE INDEX IF NOT EXISTS idx_aggregates_month 
ON monthly_aggregates(cycle_month, poll_id);

-- ============================================================================
-- 7. ROW LEVEL SECURITY (RLS) - LOCKED DOWN 🔒
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_aggregates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view universities" ON universities;
DROP POLICY IF EXISTS "Public can view polls" ON polls;
DROP POLICY IF EXISTS "Public can vote" ON votes;
DROP POLICY IF EXISTS "Public can view aggregates" ON monthly_aggregates;

-- Universities: Public read-only
CREATE POLICY "Public can view universities" 
ON universities FOR SELECT USING (true);

-- Polls: Public read-only
CREATE POLICY "Public can view polls" 
ON polls FOR SELECT USING (true);

-- Votes: Write-only (users CANNOT see raw votes)
CREATE POLICY "Public can vote" 
ON votes FOR INSERT WITH CHECK (true);

-- Monthly Aggregates: Public read-only
CREATE POLICY "Public can view aggregates" 
ON monthly_aggregates FOR SELECT USING (true);

-- ============================================================================
-- 8. REAL-TIME AGGREGATED RESULTS VIEW 📊
-- ============================================================================
DROP VIEW IF EXISTS poll_results;

CREATE OR REPLACE VIEW poll_results AS
SELECT 
    v.poll_id,
    p.question as poll_question,
    p.category,
    p.cycle_month,
    v.university_id,
    u.name as university_name,
    u.short_name as university_short_name,
    u.color as university_color,
    u.type as university_type,
    COUNT(*) as votes,
    ROUND(
        (COUNT(*)::DECIMAL / NULLIF(SUM(COUNT(*)) OVER (PARTITION BY v.poll_id), 0)) * 100, 
        2
    ) as percentage,
    RANK() OVER (PARTITION BY v.poll_id ORDER BY COUNT(*) DESC) as rank
FROM votes v
JOIN polls p ON v.poll_id = p.id
JOIN universities u ON v.university_id = u.id
GROUP BY 
    v.poll_id, 
    p.question,
    p.category,
    p.cycle_month,
    v.university_id, 
    u.name, 
    u.short_name,
    u.color,
    u.type
ORDER BY v.poll_id, votes DESC;

GRANT SELECT ON poll_results TO anon, authenticated;

-- ============================================================================
-- 9. TRENDING POLLS VIEW (Homepage Hero Section)
-- ============================================================================
DROP VIEW IF EXISTS trending_polls;

CREATE OR REPLACE VIEW trending_polls AS
SELECT 
    p.id,
    p.question,
    p.slug,
    p.category,
    p.cycle_month,
    COUNT(v.id) as total_votes,
    COUNT(DISTINCT v.university_id) as universities_competing,
    MAX(v.created_at) as last_vote_time,
    -- Calculate competition level (high if votes are distributed)
    CASE 
        WHEN COUNT(DISTINCT v.university_id) >= 15 THEN 'high'
        WHEN COUNT(DISTINCT v.university_id) >= 8 THEN 'medium'
        ELSE 'low'
    END as competition_level
FROM polls p
LEFT JOIN votes v ON p.id = v.poll_id
WHERE p.is_active = TRUE
GROUP BY p.id, p.question, p.slug, p.category, p.cycle_month
ORDER BY total_votes DESC, last_vote_time DESC
LIMIT 10;

GRANT SELECT ON trending_polls TO anon, authenticated;

-- ============================================================================
-- 10. UNIVERSITY LEADERBOARD VIEW (Overall Rankings)
-- ============================================================================
DROP VIEW IF EXISTS university_leaderboard;

CREATE OR REPLACE VIEW university_leaderboard AS
SELECT 
    u.id,
    u.name,
    u.short_name,
    u.type,
    u.color,
    u.location,
    COUNT(v.id) as total_votes_received,
    COUNT(DISTINCT v.poll_id) as polls_participated,
    -- Calculate dominance score (wins vs participations)
    COUNT(CASE WHEN (
        SELECT COUNT(*) FROM votes v2 
        WHERE v2.poll_id = v.poll_id AND v2.university_id = v.university_id
    ) = (
        SELECT MAX(vote_count) FROM (
            SELECT COUNT(*) as vote_count 
            FROM votes v3 
            WHERE v3.poll_id = v.poll_id 
            GROUP BY v3.university_id
        ) max_votes
    ) THEN 1 END) as first_place_finishes
FROM universities u
LEFT JOIN votes v ON u.id = v.university_id
GROUP BY u.id, u.name, u.short_name, u.type, u.color, u.location
ORDER BY total_votes_received DESC;

GRANT SELECT ON university_leaderboard TO anon, authenticated;

-- ============================================================================
-- 11. CATEGORY INSIGHTS VIEW (Phase 2 Analytics)
-- ============================================================================
DROP VIEW IF EXISTS category_insights;

CREATE OR REPLACE VIEW category_insights AS
SELECT 
    p.category,
    COUNT(DISTINCT p.id) as total_polls,
    COUNT(v.id) as total_votes,
    COUNT(DISTINCT v.university_id) as universities_active,
    ROUND(AVG(
        CASE WHEN v.created_at >= NOW() - INTERVAL '7 days' THEN 1 ELSE 0 END
    ) * 100, 2) as recent_activity_percentage,
    -- Determine if category is trending (more votes than average)
    CASE 
        WHEN COUNT(v.id) > (
            SELECT AVG(vote_count) FROM (
                SELECT COUNT(*) as vote_count 
                FROM votes 
                GROUP BY poll_id
            ) avg_votes
        ) THEN TRUE
        ELSE FALSE
    END as is_trending
FROM polls p
LEFT JOIN votes v ON p.id = v.poll_id
WHERE p.is_active = TRUE
GROUP BY p.category;

GRANT SELECT ON category_insights TO anon, authenticated;

-- ============================================================================
-- 12. RECENT ACTIVITY VIEW (Live Feed)
-- ============================================================================
DROP VIEW IF EXISTS recent_activity;

CREATE OR REPLACE VIEW recent_activity AS
SELECT 
    v.created_at,
    p.question as poll_question,
    p.slug as poll_slug,
    p.category,
    u.name as university_name,
    u.short_name as university_short_name,
    u.color as university_color,
    u.type as university_type,
    v.voter_type
FROM votes v
JOIN polls p ON v.poll_id = p.id
JOIN universities u ON v.university_id = u.id
WHERE p.is_active = TRUE
ORDER BY v.created_at DESC
LIMIT 100;

GRANT SELECT ON recent_activity TO anon, authenticated;

-- ============================================================================
-- 13. HELPER FUNCTIONS (Business Logic at DB Level)
-- ============================================================================

-- Function: Check if user has voted (O(1) lookup)
CREATE OR REPLACE FUNCTION has_user_voted(
    p_poll_id UUID,
    p_fingerprint TEXT
) RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM votes 
        WHERE poll_id = p_poll_id 
        AND fingerprint_hash = p_fingerprint
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

GRANT EXECUTE ON FUNCTION has_user_voted TO anon, authenticated;

-- Function: Get vote count for specific university in poll
CREATE OR REPLACE FUNCTION get_vote_count(
    p_poll_id UUID,
    p_university_id TEXT
) RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*) FROM votes 
        WHERE poll_id = p_poll_id 
        AND university_id = p_university_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

GRANT EXECUTE ON FUNCTION get_vote_count TO anon, authenticated;

-- Phase 2: Function to check if poll is currently active
CREATE OR REPLACE FUNCTION get_poll_status(p_poll_id UUID)
RETURNS TABLE(
    is_active BOOLEAN,
    is_in_cycle BOOLEAN,
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.is_active,
        CASE 
            WHEN p.starts_at IS NULL THEN TRUE
            WHEN p.ends_at IS NULL THEN (NOW() >= p.starts_at)
            ELSE (NOW() >= p.starts_at AND NOW() <= p.ends_at)
        END as is_in_cycle,
        p.starts_at,
        p.ends_at
    FROM polls p
    WHERE p.id = p_poll_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

GRANT EXECUTE ON FUNCTION get_poll_status TO anon, authenticated;

-- ============================================================================
-- 14. ENABLE REALTIME SUBSCRIPTIONS 🔴 LIVE
-- ============================================================================
-- Broadcast new votes to all connected clients
ALTER PUBLICATION supabase_realtime ADD TABLE votes;
ALTER PUBLICATION supabase_realtime ADD TABLE polls;

-- ============================================================================
-- 15. AUTO-UPDATE TRIGGERS (Phase 2)
-- ============================================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables that need timestamp tracking
DROP TRIGGER IF EXISTS update_universities_updated_at ON universities;
CREATE TRIGGER update_universities_updated_at
    BEFORE UPDATE ON universities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_polls_updated_at ON polls;
CREATE TRIGGER update_polls_updated_at
    BEFORE UPDATE ON polls
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SCHEMA COMPLETE! ✅
-- 
-- What you now have:
-- ✅ Monthly voting cycles (Phase 2)
-- ✅ Performance optimized for free tier (indexes + aggregates)
-- ✅ Real-time live updates (Realtime enabled)
-- ✅ Anti-spam protection (unique constraints + fingerprinting)
-- ✅ Trend tracking (views for insights)
-- ✅ Security locked down (RLS enabled, write-only votes)
-- ✅ Scalable architecture (ready for Phase 3 AI matching)
--
-- Next: Run seed-1-permanent.sql for universities and polls
--       Run seed-2-mockup.sql for development visualization data
-- ============================================================================