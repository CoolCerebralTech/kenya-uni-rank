-- ============================================================================
-- UniPulse MVP - SECURED DATABASE SCHEMA
-- Real-time, Scalable, Anti-Spam Protected
-- ============================================================================

-- 1. CLEANUP (Optional: Only if you are restarting)
-- DROP TABLE IF EXISTS votes CASCADE;
-- DROP TABLE IF EXISTS polls CASCADE;
-- DROP TABLE IF EXISTS universities CASCADE;
-- DROP VIEW IF EXISTS poll_results;

-- ============================================================================
-- 2. UNIVERSITIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS universities (
    id TEXT PRIMARY KEY, -- 'uon', 'ku', 'jkuat'
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    type TEXT CHECK (type IN ('Public', 'Private')),
    location TEXT,
    color TEXT DEFAULT '#000000',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. POLLS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS polls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL, -- 'best-sports', 'best-vibes'
    category TEXT NOT NULL, -- 'vibes', 'academics', 'sports', 'food', 'facilities', 'social', 'general'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. VOTES TABLE (High-traffic table)
-- ============================================================================
CREATE TABLE IF NOT EXISTS votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
    university_id TEXT REFERENCES universities(id) ON DELETE CASCADE,
    fingerprint_hash TEXT NOT NULL, -- Browser fingerprint
    ip_hash TEXT, -- Optional: extra layer of anti-spam
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. PERFORMANCE INDEXING (CRITICAL FOR SCALE) 🚀
-- ============================================================================
-- Index 1: Makes counting votes for a specific poll instant
CREATE INDEX IF NOT EXISTS idx_votes_poll_uni ON votes(poll_id, university_id);

-- Index 2: Makes checking "Did I already vote?" instant (O(1) lookup)
CREATE INDEX IF NOT EXISTS idx_votes_check_dupes ON votes(poll_id, fingerprint_hash);

-- Index 3: For real-time subscriptions and filtering by poll
CREATE INDEX IF NOT EXISTS idx_votes_poll_id ON votes(poll_id);

-- Index 4: For time-based analytics (trending polls)
CREATE INDEX IF NOT EXISTS idx_votes_created_at ON votes(created_at);

-- ============================================================================
-- 6. CONSTRAINT: PREVENT DOUBLE VOTING
-- ============================================================================
-- The database will reject a second vote from the same fingerprint for the same poll.
ALTER TABLE votes 
DROP CONSTRAINT IF EXISTS unique_vote_per_user;

ALTER TABLE votes 
ADD CONSTRAINT unique_vote_per_user UNIQUE (poll_id, fingerprint_hash);

-- ============================================================================
-- 7. ROW LEVEL SECURITY (RLS) - LOCKED DOWN 🔒
-- ============================================================================
-- Enable RLS on all tables
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for clean reruns)
DROP POLICY IF EXISTS "Public universities are viewable" ON universities;
DROP POLICY IF EXISTS "Public polls are viewable" ON polls;
DROP POLICY IF EXISTS "Public can vote" ON votes;
DROP POLICY IF EXISTS "Public can see votes" ON votes;

-- ----------------------------------------------------------------------------
-- UNIVERSITIES & POLLS: Public Read-Only
-- ----------------------------------------------------------------------------
CREATE POLICY "Public universities are viewable" 
ON universities FOR SELECT 
USING (true);

CREATE POLICY "Public polls are viewable" 
ON polls FOR SELECT 
USING (true);

-- ----------------------------------------------------------------------------
-- VOTES: Write-Only for Users (SECURE) ✅
-- ----------------------------------------------------------------------------
-- Users can INSERT votes (voting action)
CREATE POLICY "Public can vote" 
ON votes FOR INSERT 
WITH CHECK (true);

-- ❌ REMOVED: Users can NO LONGER read raw votes directly
-- This prevents vote manipulation and gaming the system
-- Users can only see aggregated results via the poll_results view

-- ----------------------------------------------------------------------------
-- Optional: Allow authenticated admins to see raw votes (for analytics)
-- Uncomment if you want admin access later
-- ----------------------------------------------------------------------------
-- CREATE POLICY "Admins can see raw votes" 
-- ON votes FOR SELECT 
-- USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- ============================================================================
-- 8. DATABASE VIEW FOR REAL-TIME AGGREGATED RESULTS 📊
-- ============================================================================
-- This is what users see instead of raw votes
-- Provides real-time poll results without exposing individual votes

DROP VIEW IF EXISTS poll_results;

CREATE OR REPLACE VIEW poll_results AS
SELECT 
    v.poll_id,
    v.university_id,
    u.name as university_name,
    u.short_name as university_short_name,
    u.color as university_color,
    u.type as university_type,
    u.location as university_location,
    COUNT(*) as vote_count
FROM votes v
JOIN universities u ON v.university_id = u.id
GROUP BY 
    v.poll_id, 
    v.university_id, 
    u.name, 
    u.short_name,
    u.color,
    u.type,
    u.location
ORDER BY vote_count DESC;

-- Grant access to the view (this is what users can read)
GRANT SELECT ON poll_results TO anon, authenticated;

-- ============================================================================
-- 9. ADDITIONAL VIEWS FOR ANALYTICS (Optional but useful)
-- ============================================================================

-- View: Top 10 Most Popular Polls (by vote count)
DROP VIEW IF EXISTS trending_polls;

CREATE OR REPLACE VIEW trending_polls AS
SELECT 
    p.id,
    p.question,
    p.slug,
    p.category,
    COUNT(v.id) as total_votes,
    COUNT(DISTINCT v.university_id) as universities_voted,
    MAX(v.created_at) as last_vote_time
FROM polls p
LEFT JOIN votes v ON p.id = v.poll_id
WHERE p.is_active = true
GROUP BY p.id, p.question, p.slug, p.category
ORDER BY total_votes DESC
LIMIT 10;

GRANT SELECT ON trending_polls TO anon, authenticated;

-- View: University Leaderboard (which uni is winning across all polls)
DROP VIEW IF EXISTS university_leaderboard;

CREATE OR REPLACE VIEW university_leaderboard AS
SELECT 
    u.id,
    u.name,
    u.short_name,
    u.type,
    u.color,
    COUNT(v.id) as total_votes_received,
    COUNT(DISTINCT v.poll_id) as polls_participated
FROM universities u
LEFT JOIN votes v ON u.id = v.university_id
GROUP BY u.id, u.name, u.short_name, u.type, u.color
ORDER BY total_votes_received DESC;

GRANT SELECT ON university_leaderboard TO anon, authenticated;

-- View: Recent Activity Feed (last 50 votes)
DROP VIEW IF EXISTS recent_activity;

CREATE OR REPLACE VIEW recent_activity AS
SELECT 
    v.created_at,
    p.question as poll_question,
    p.slug as poll_slug,
    p.category,
    u.name as university_name,
    u.short_name as university_short_name,
    u.color as university_color
FROM votes v
JOIN polls p ON v.poll_id = p.id
JOIN universities u ON v.university_id = u.id
ORDER BY v.created_at DESC
LIMIT 50;

GRANT SELECT ON recent_activity TO anon, authenticated;

-- ============================================================================
-- 10. ENABLE REALTIME SUBSCRIPTIONS 🔴 LIVE
-- ============================================================================
-- Allow Supabase Realtime to broadcast changes on votes table
-- This enables live updates without polling

-- Enable realtime for votes (broadcasts new votes)
ALTER PUBLICATION supabase_realtime ADD TABLE votes;

-- Enable realtime for polls (if you add/remove polls dynamically)
ALTER PUBLICATION supabase_realtime ADD TABLE polls;

-- ============================================================================
-- 11. HELPER FUNCTIONS (Optional but useful)
-- ============================================================================

-- Function: Check if user has already voted in a poll
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execution to anon users
GRANT EXECUTE ON FUNCTION has_user_voted TO anon, authenticated;

-- Function: Get vote count for a specific university in a poll
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_vote_count TO anon, authenticated;

-- ============================================================================
-- DONE! 🎉 Your database is now:
-- ✅ Secured (no raw vote access)
-- ✅ Optimized (indexed for speed)
-- ✅ Real-time enabled (live updates)
-- ✅ Anti-spam protected (fingerprint + unique constraint)
-- ============================================================================

-- Run these verification queries after setup:
-- SELECT * FROM poll_results LIMIT 10;
-- SELECT * FROM trending_polls;
-- SELECT * FROM university_leaderboard;
-- SELECT * FROM recent_activity LIMIT 10;