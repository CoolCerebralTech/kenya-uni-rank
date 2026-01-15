-- ============================================================================
-- UniPulse MVP – CURATED POLLS (FUN • RIVALRY • SHAREABLE)
-- Total: 120 polls
-- ============================================================================

DELETE FROM polls;

-- ============================================================================
-- CATEGORY: GENERAL (20) – THE HEADLINES
-- ============================================================================
INSERT INTO polls (question, slug, category) VALUES
('Which university offers the best overall student experience?', 'best-overall-experience', 'general'),
('Which university would you proudly recommend to a friend?', 'recommend-to-friend', 'general'),
('Which university would you choose again if you had to restart?', 'choose-again', 'general'),
('Which university gives the best value for money?', 'best-value-for-money', 'general'),
('Which university experience feels the most balanced overall?', 'most-balanced-experience', 'general'),
('Which university makes students the most proud?', 'most-student-pride', 'general'),
('Which university feels like the smartest life decision?', 'smartest-decision', 'general'),
('Which university prepares you best for life after graduation?', 'best-life-prep', 'general'),
('Which university has the strongest overall reputation?', 'strongest-reputation', 'general'),
('Which university feels most future-focused?', 'most-future-focused', 'general'),
('Which university would parents approve of most?', 'parent-approved', 'general'),
('Which university exceeded expectations the most?', 'exceeded-expectations', 'general'),
('Which university feels most worth the effort?', 'worth-the-effort', 'general'),
('Which university experience feels the most rewarding?', 'most-rewarding', 'general'),
('Which university stands out the most overall?', 'stands-out-overall', 'general'),
('Which university feels most well-rounded?', 'most-well-rounded', 'general'),
('Which university would you defend in debates?', 'most-defended', 'general'),
('Which university delivers what it promises?', 'delivers-promises', 'general'),
('Which university feels like a solid long-term investment?', 'long-term-investment', 'general'),
('Which university gives the best return on commitment?', 'return-on-commitment', 'general');

-- ============================================================================
-- CATEGORY: VIBES (30) – VIRAL & SHAREABLE
-- ============================================================================
INSERT INTO polls (question, slug, category) VALUES
('Which university has the best campus vibes?', 'best-campus-vibes', 'vibes'),
('Which campus feels most alive?', 'most-alive-campus', 'vibes'),
('Which university feels most welcoming?', 'most-welcoming', 'vibes'),
('Which campus feels easiest to make friends?', 'easy-to-make-friends', 'vibes'),
('Which university has the best student energy?', 'best-student-energy', 'vibes'),
('Which campus feels most fun day-to-day?', 'most-fun-daily', 'vibes'),
('Which university has the strongest school spirit?', 'strongest-school-spirit', 'vibes'),
('Which campus feels the most social?', 'most-social-campus', 'vibes'),
('Which university has the coolest student culture?', 'coolest-student-culture', 'vibes'),
('Which campus feels the least boring?', 'least-boring', 'vibes'),
('Which university has the best student-run events?', 'best-student-events', 'vibes'),
('Which campus feels most expressive?', 'most-expressive', 'vibes'),
('Which university has the best campus atmosphere?', 'best-campus-atmosphere', 'vibes'),
('Which campus feels most memorable?', 'most-memorable-campus', 'vibes'),
('Which university has the best campus hangout spots?', 'best-hangout-spots', 'vibes'),
('Which campus feels most vibrant?', 'most-vibrant', 'vibes'),
('Which university has the most creative student scene?', 'most-creative-scene', 'vibes'),
('Which campus feels easiest to belong in?', 'easy-to-belong', 'vibes'),
('Which university has the best student-led culture?', 'student-led-culture', 'vibes'),
('Which campus feels the most youthful?', 'most-youthful', 'vibes'),
('Which university feels most connected?', 'most-connected', 'vibes'),
('Which campus feels the most expressive?', 'most-expressive-campus', 'vibes'),
('Which university has the best weekend vibes?', 'best-weekend-vibes', 'vibes'),
('Which campus has the best student interactions?', 'best-interactions', 'vibes'),
('Which university feels the most authentic?', 'most-authentic', 'vibes'),
('Which campus has the best overall mood?', 'best-campus-mood', 'vibes'),
('Which university has the strongest community feel?', 'strongest-community-feel', 'vibes'),
('Which campus feels the most dynamic?', 'most-dynamic', 'vibes'),
('Which university has the best campus buzz?', 'best-campus-buzz', 'vibes'),
('Which campus feels most engaging?', 'most-engaging-campus', 'vibes');

-- ============================================================================
-- CATEGORY: ACADEMICS (25) – CREDIBILITY & SIGNAL
-- ============================================================================
INSERT INTO polls (question, slug, category) VALUES
('Which university has the best academic environment?', 'best-academic-environment', 'academics'),
('Which university feels most intellectually stimulating?', 'most-stimulating', 'academics'),
('Which campus has the strongest learning culture?', 'strongest-learning-culture', 'academics'),
('Which university takes academics most seriously?', 'academics-serious', 'academics'),
('Which campus has the best study culture?', 'best-study-culture', 'academics'),
('Which university has the best libraries and study spaces?', 'best-libraries', 'academics'),
('Which campus supports focused learning best?', 'focused-learning', 'academics'),
('Which university encourages critical thinking most?', 'critical-thinking', 'academics'),
('Which campus feels most disciplined academically?', 'most-disciplined', 'academics'),
('Which university has the best academic support systems?', 'academic-support', 'academics'),
('Which campus promotes deep learning best?', 'deep-learning', 'academics'),
('Which university has the strongest academic reputation?', 'academic-reputation', 'academics'),
('Which campus feels most structured academically?', 'most-structured', 'academics'),
('Which university encourages curiosity most?', 'encourages-curiosity', 'academics'),
('Which campus values academic excellence most?', 'values-excellence', 'academics'),
('Which university prepares students best academically?', 'academic-preparation', 'academics'),
('Which campus feels most intellectually competitive?', 'intellectual-competition', 'academics'),
('Which university supports student growth academically?', 'academic-growth', 'academics'),
('Which campus feels most organized academically?', 'organized-academics', 'academics'),
('Which university has the strongest academic identity?', 'academic-identity', 'academics'),
('Which campus balances academics and life best?', 'balanced-academics', 'academics'),
('Which university produces confident graduates?', 'confident-graduates', 'academics'),
('Which campus feels most academically motivating?', 'academically-motivating', 'academics'),
('Which university supports learning beyond class?', 'beyond-class-learning', 'academics'),
('Which campus feels most exam-ready?', 'exam-ready', 'academics');

-- ============================================================================
-- CATEGORY: SPORTS (20) – PRIDE & VISUAL
-- ============================================================================
INSERT INTO polls (question, slug, category) VALUES
('Which university has the best sports facilities?', 'best-sports-facilities', 'sports'),
('Which university has the strongest sports culture?', 'strongest-sports-culture', 'sports'),
('Which campus feels most athletic?', 'most-athletic-campus', 'sports'),
('Which university supports student athletes best?', 'supports-athletes', 'sports'),
('Which campus has the best sports energy?', 'sports-energy', 'sports'),
('Which university dominates inter-university sports?', 'sports-dominance', 'sports'),
('Which campus has the most active sports community?', 'active-sports-community', 'sports'),
('Which university has the best sports infrastructure?', 'sports-infrastructure', 'sports'),
('Which campus encourages fitness most?', 'fitness-encouragement', 'sports'),
('Which university feels most competitive in sports?', 'sports-competitive', 'sports'),
('Which campus has the best team spirit?', 'best-team-spirit', 'sports'),
('Which university has the best sports support?', 'sports-support', 'sports'),
('Which campus feels most energetic during games?', 'game-day-energy', 'sports'),
('Which university values sports excellence most?', 'sports-excellence', 'sports'),
('Which campus has the strongest sports identity?', 'sports-identity', 'sports'),
('Which university has the most balanced sports programs?', 'balanced-sports', 'sports'),
('Which campus produces standout athletes?', 'standout-athletes', 'sports'),
('Which university encourages active lifestyles?', 'active-lifestyles', 'sports'),
('Which campus has the best sports atmosphere?', 'sports-atmosphere', 'sports'),
('Which university feels most proud of its teams?', 'proud-of-teams', 'sports');

-- ============================================================================
-- CATEGORY: SOCIAL (15) – COMMUNITY & CONNECTION
-- ============================================================================
INSERT INTO polls (question, slug, category) VALUES
('Which university has the strongest student community?', 'strongest-community', 'social'),
('Which campus feels most supportive?', 'most-supportive', 'social'),
('Which university is easiest to network in?', 'easy-networking', 'social'),
('Which campus feels most collaborative?', 'most-collaborative', 'social'),
('Which university has the best peer support?', 'peer-support', 'social'),
('Which campus feels easiest to ask for help?', 'easy-help', 'social'),
('Which university builds strong friendships?', 'strong-friendships', 'social'),
('Which campus feels most inclusive?', 'most-inclusive', 'social'),
('Which university connects students best?', 'connects-students', 'social'),
('Which campus feels most community-driven?', 'community-driven', 'social'),
('Which university supports student initiatives best?', 'student-initiatives', 'social'),
('Which campus encourages teamwork most?', 'teamwork', 'social'),
('Which university has the best mentorship culture?', 'mentorship-culture', 'social'),
('Which campus feels most people-centered?', 'people-centered', 'social'),
('Which university builds lifelong connections?', 'lifelong-connections', 'social');
