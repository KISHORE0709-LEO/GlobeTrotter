-- =====================================================
-- GlobeTrotter Database Views
-- Complex Queries & Reporting
-- =====================================================

-- =====================================================
-- USER ANALYTICS VIEWS
-- =====================================================

-- User statistics with trip counts and spending
CREATE VIEW user_statistics AS
SELECT 
    u.id,
    u.username,
    u.email,
    u.first_name,
    u.last_name,
    u.created_at as member_since,
    COUNT(DISTINCT t.id) as total_trips,
    COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) as completed_trips,
    COUNT(DISTINCT CASE WHEN t.status = 'planned' THEN t.id END) as planned_trips,
    COUNT(DISTINCT CASE WHEN t.status = 'ongoing' THEN t.id END) as ongoing_trips,
    COALESCE(SUM(t.actual_spent), 0) as total_spent,
    COALESCE(AVG(t.actual_spent), 0) as avg_trip_cost,
    COUNT(DISTINCT f.follower_id) as followers_count,
    COUNT(DISTINCT fo.following_id) as following_count,
    COUNT(DISTINCT ar.id) as reviews_written
FROM users u
LEFT JOIN trips t ON u.id = t.user_id
LEFT JOIN user_followers f ON u.id = f.following_id
LEFT JOIN user_followers fo ON u.id = fo.follower_id
LEFT JOIN attraction_reviews ar ON u.id = ar.user_id
WHERE u.is_active = true
GROUP BY u.id, u.username, u.email, u.first_name, u.last_name, u.created_at;

-- =====================================================
-- TRIP ANALYTICS VIEWS
-- =====================================================

-- Comprehensive trip details with destinations and costs
CREATE VIEW trip_details AS
SELECT 
    t.id,
    t.title,
    t.description,
    t.start_date,
    t.end_date,
    (t.end_date - t.start_date + 1) as duration_days,
    t.total_budget,
    t.actual_spent,
    t.currency,
    t.status,
    t.visibility,
    t.created_at,
    u.username as owner_username,
    u.first_name || ' ' || u.last_name as owner_name,
    COUNT(DISTINCT td.id) as destinations_count,
    COUNT(DISTINCT ii.id) as itinerary_items_count,
    COUNT(DISTINCT e.id) as expenses_count,
    COUNT(DISTINCT tl.id) as likes_count,
    COUNT(DISTINCT tc.id) as comments_count,
    COUNT(DISTINCT tcol.id) as collaborators_count,
    STRING_AGG(DISTINCT c.name, ', ' ORDER BY c.name) as destination_cities
FROM trips t
JOIN users u ON t.user_id = u.id
LEFT JOIN trip_destinations td ON t.id = td.trip_id
LEFT JOIN cities c ON td.city_id = c.id
LEFT JOIN itinerary_items ii ON td.id = ii.trip_destination_id
LEFT JOIN expenses e ON t.id = e.trip_id
LEFT JOIN trip_likes tl ON t.id = tl.trip_id
LEFT JOIN trip_comments tc ON t.id = tc.trip_id
LEFT JOIN trip_collaborators tcol ON t.id = tcol.trip_id
GROUP BY t.id, t.title, t.description, t.start_date, t.end_date, t.total_budget, 
         t.actual_spent, t.currency, t.status, t.visibility, t.created_at,
         u.username, u.first_name, u.last_name;

-- Popular destinations view
CREATE VIEW popular_destinations AS
SELECT 
    c.id,
    c.name as city_name,
    co.name as country_name,
    co.iso_code,
    c.latitude,
    c.longitude,
    c.average_cost_per_day,
    COUNT(DISTINCT td.trip_id) as trips_count,
    COUNT(DISTINCT a.id) as attractions_count,
    COALESCE(AVG(ar.rating), 0) as avg_attraction_rating,
    COUNT(DISTINCT ar.id) as total_reviews,
    RANK() OVER (ORDER BY COUNT(DISTINCT td.trip_id) DESC) as popularity_rank
FROM cities c
JOIN countries co ON c.country_id = co.id
LEFT JOIN trip_destinations td ON c.id = td.city_id
LEFT JOIN attractions a ON c.id = a.city_id AND a.is_active = true
LEFT JOIN attraction_reviews ar ON a.id = ar.attraction_id
GROUP BY c.id, c.name, co.name, co.iso_code, c.latitude, c.longitude, c.average_cost_per_day
HAVING COUNT(DISTINCT td.trip_id) > 0
ORDER BY trips_count DESC;

-- =====================================================
-- FINANCIAL ANALYTICS VIEWS
-- =====================================================

-- Expense breakdown by category and time
CREATE VIEW expense_analytics AS
SELECT 
    DATE_TRUNC('month', e.expense_date) as expense_month,
    e.category,
    COUNT(*) as transaction_count,
    SUM(e.amount) as total_amount,
    AVG(e.amount) as avg_amount,
    MIN(e.amount) as min_amount,
    MAX(e.amount) as max_amount,
    COUNT(DISTINCT e.trip_id) as trips_count,
    COUNT(DISTINCT t.user_id) as users_count
FROM expenses e
JOIN trips t ON e.trip_id = t.id
GROUP BY DATE_TRUNC('month', e.expense_date), e.category
ORDER BY expense_month DESC, total_amount DESC;

-- Budget vs actual spending analysis
CREATE VIEW budget_analysis AS
SELECT 
    t.id as trip_id,
    t.title,
    t.total_budget,
    t.actual_spent,
    CASE 
        WHEN t.total_budget > 0 THEN 
            ROUND(((t.actual_spent - t.total_budget) / t.total_budget * 100)::numeric, 2)
        ELSE NULL 
    END as budget_variance_percent,
    CASE 
        WHEN t.actual_spent > t.total_budget THEN 'over_budget'
        WHEN t.actual_spent < t.total_budget * 0.9 THEN 'under_budget'
        ELSE 'on_budget'
    END as budget_status,
    t.currency,
    t.status as trip_status,
    (t.end_date - t.start_date + 1) as duration_days,
    CASE 
        WHEN (t.end_date - t.start_date + 1) > 0 THEN 
            ROUND((t.actual_spent / (t.end_date - t.start_date + 1))::numeric, 2)
        ELSE 0 
    END as daily_spend_rate
FROM trips t
WHERE t.total_budget > 0;

-- =====================================================
-- SOCIAL ANALYTICS VIEWS
-- =====================================================

-- User engagement metrics
CREATE VIEW user_engagement AS
SELECT 
    u.id,
    u.username,
    COUNT(DISTINCT tl.id) as likes_given,
    COUNT(DISTINCT tc.id) as comments_made,
    COUNT(DISTINCT ar.id) as reviews_written,
    COUNT(DISTINCT t_liked.id) as trips_liked,
    COUNT(DISTINCT t_commented.id) as trips_commented,
    COUNT(DISTINCT f.following_id) as users_following,
    COUNT(DISTINCT fo.follower_id) as followers_count,
    COALESCE(AVG(ar.rating), 0) as avg_review_rating
FROM users u
LEFT JOIN trip_likes tl ON u.id = tl.user_id
LEFT JOIN trip_comments tc ON u.id = tc.user_id
LEFT JOIN attraction_reviews ar ON u.id = ar.user_id
LEFT JOIN trips t_liked ON tl.trip_id = t_liked.id
LEFT JOIN trips t_commented ON tc.trip_id = t_commented.id
LEFT JOIN user_followers f ON u.id = f.follower_id
LEFT JOIN user_followers fo ON u.id = fo.following_id
WHERE u.is_active = true
GROUP BY u.id, u.username;

-- =====================================================
-- RECOMMENDATION VIEWS
-- =====================================================

-- Similar users based on travel preferences
CREATE VIEW user_similarity AS
SELECT 
    u1.id as user1_id,
    u1.username as user1_username,
    u2.id as user2_id,
    u2.username as user2_username,
    COUNT(DISTINCT c1.id) as common_destinations,
    COUNT(DISTINCT up1.category) as common_preferences,
    AVG(ABS(ar1.rating - ar2.rating)) as rating_similarity
FROM users u1
JOIN users u2 ON u1.id < u2.id
LEFT JOIN trips t1 ON u1.id = t1.user_id
LEFT JOIN trips t2 ON u2.id = t2.user_id
LEFT JOIN trip_destinations td1 ON t1.id = td1.trip_id
LEFT JOIN trip_destinations td2 ON t2.id = td2.trip_id
LEFT JOIN cities c1 ON td1.city_id = c1.id
LEFT JOIN cities c2 ON td2.city_id = c2.id AND c1.id = c2.id
LEFT JOIN user_preferences up1 ON u1.id = up1.user_id
LEFT JOIN user_preferences up2 ON u2.id = up2.user_id AND up1.category = up2.category
LEFT JOIN attraction_reviews ar1 ON u1.id = ar1.user_id
LEFT JOIN attraction_reviews ar2 ON u2.id = ar2.user_id AND ar1.attraction_id = ar2.attraction_id
WHERE u1.is_active = true AND u2.is_active = true
GROUP BY u1.id, u1.username, u2.id, u2.username
HAVING COUNT(DISTINCT c1.id) > 0 OR COUNT(DISTINCT up1.category) > 0;

-- Trending destinations
CREATE VIEW trending_destinations AS
SELECT 
    c.id,
    c.name as city_name,
    co.name as country_name,
    COUNT(DISTINCT t.id) as recent_trips,
    COUNT(DISTINCT t.id) FILTER (WHERE t.created_at >= CURRENT_DATE - INTERVAL '30 days') as trips_last_30_days,
    COUNT(DISTINCT t.id) FILTER (WHERE t.created_at >= CURRENT_DATE - INTERVAL '7 days') as trips_last_7_days,
    AVG(COALESCE(ar.rating, 0)) as avg_rating,
    COUNT(DISTINCT ar.id) as total_reviews,
    c.average_cost_per_day,
    RANK() OVER (ORDER BY COUNT(DISTINCT t.id) FILTER (WHERE t.created_at >= CURRENT_DATE - INTERVAL '30 days') DESC) as trend_rank
FROM cities c
JOIN countries co ON c.country_id = co.id
LEFT JOIN trip_destinations td ON c.id = td.city_id
LEFT JOIN trips t ON td.trip_id = t.id AND t.created_at >= CURRENT_DATE - INTERVAL '90 days'
LEFT JOIN attractions a ON c.id = a.city_id
LEFT JOIN attraction_reviews ar ON a.id = ar.attraction_id
GROUP BY c.id, c.name, co.name, c.average_cost_per_day
ORDER BY trips_last_30_days DESC, avg_rating DESC;