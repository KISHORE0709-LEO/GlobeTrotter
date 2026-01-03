-- =====================================================
-- GlobeTrotter Database Indexes
-- Performance Optimization
-- =====================================================

-- =====================================================
-- USER MANAGEMENT INDEXES
-- =====================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_users_created_at ON users(created_at);

-- =====================================================
-- LOCATION INDEXES
-- =====================================================

CREATE INDEX idx_countries_iso_code ON countries(iso_code);
CREATE INDEX idx_cities_country_id ON cities(country_id);
CREATE INDEX idx_cities_location ON cities(latitude, longitude);
CREATE INDEX idx_attractions_city_id ON attractions(city_id);
CREATE INDEX idx_attractions_category ON attractions(category);
CREATE INDEX idx_attractions_rating ON attractions(rating DESC);
CREATE INDEX idx_attractions_location ON attractions(latitude, longitude);
CREATE INDEX idx_attractions_active ON attractions(is_active) WHERE is_active = TRUE;

-- =====================================================
-- TRIP MANAGEMENT INDEXES
-- =====================================================

CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_visibility ON trips(visibility);
CREATE INDEX idx_trips_dates ON trips(start_date, end_date);
CREATE INDEX idx_trips_created_at ON trips(created_at DESC);

CREATE INDEX idx_trip_destinations_trip_id ON trip_destinations(trip_id);
CREATE INDEX idx_trip_destinations_city_id ON trip_destinations(city_id);
CREATE INDEX idx_trip_destinations_order ON trip_destinations(trip_id, order_index);
CREATE INDEX idx_trip_destinations_dates ON trip_destinations(arrival_date, departure_date);

-- =====================================================
-- ITINERARY INDEXES
-- =====================================================

CREATE INDEX idx_itinerary_items_trip_destination ON itinerary_items(trip_destination_id);
CREATE INDEX idx_itinerary_items_attraction ON itinerary_items(attraction_id);
CREATE INDEX idx_itinerary_items_type ON itinerary_items(activity_type);
CREATE INDEX idx_itinerary_items_time ON itinerary_items(start_time);
CREATE INDEX idx_itinerary_items_booked ON itinerary_items(is_booked);

-- =====================================================
-- BUDGET TRACKING INDEXES
-- =====================================================

CREATE INDEX idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_expenses_amount ON expenses(amount DESC);

-- =====================================================
-- SOCIAL FEATURES INDEXES
-- =====================================================

CREATE INDEX idx_user_followers_follower ON user_followers(follower_id);
CREATE INDEX idx_user_followers_following ON user_followers(following_id);
CREATE INDEX idx_user_followers_created ON user_followers(created_at DESC);

CREATE INDEX idx_trip_collaborators_trip ON trip_collaborators(trip_id);
CREATE INDEX idx_trip_collaborators_user ON trip_collaborators(user_id);
CREATE INDEX idx_trip_collaborators_role ON trip_collaborators(role);

CREATE INDEX idx_trip_likes_trip ON trip_likes(trip_id);
CREATE INDEX idx_trip_likes_user ON trip_likes(user_id);
CREATE INDEX idx_trip_likes_created ON trip_likes(created_at DESC);

CREATE INDEX idx_trip_comments_trip ON trip_comments(trip_id);
CREATE INDEX idx_trip_comments_user ON trip_comments(user_id);
CREATE INDEX idx_trip_comments_parent ON trip_comments(parent_comment_id);
CREATE INDEX idx_trip_comments_created ON trip_comments(created_at DESC);

-- =====================================================
-- REVIEWS & PREFERENCES INDEXES
-- =====================================================

CREATE INDEX idx_attraction_reviews_attraction ON attraction_reviews(attraction_id);
CREATE INDEX idx_attraction_reviews_user ON attraction_reviews(user_id);
CREATE INDEX idx_attraction_reviews_rating ON attraction_reviews(rating DESC);
CREATE INDEX idx_attraction_reviews_date ON attraction_reviews(visit_date DESC);

CREATE INDEX idx_user_preferences_user ON user_preferences(user_id);
CREATE INDEX idx_user_preferences_category ON user_preferences(category);

-- =====================================================
-- SYSTEM INDEXES
-- =====================================================

CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

CREATE INDEX idx_system_settings_key ON system_settings(key);

-- =====================================================
-- COMPOSITE INDEXES FOR COMPLEX QUERIES
-- =====================================================

-- User's trips with status and dates
CREATE INDEX idx_trips_user_status_dates ON trips(user_id, status, start_date DESC);

-- Public trips for discovery
CREATE INDEX idx_trips_public_recent ON trips(visibility, created_at DESC) WHERE visibility = 'public';

-- Trip expenses by category and date
CREATE INDEX idx_expenses_trip_category_date ON expenses(trip_id, category, expense_date);

-- Attraction reviews with rating and date
CREATE INDEX idx_reviews_attraction_rating_date ON attraction_reviews(attraction_id, rating DESC, created_at DESC);

-- User activity timeline
CREATE INDEX idx_user_activity_timeline ON trip_comments(user_id, created_at DESC);

-- =====================================================
-- FULL-TEXT SEARCH INDEXES
-- =====================================================

-- Trip search
CREATE INDEX idx_trips_search ON trips USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Attraction search
CREATE INDEX idx_attractions_search ON attractions USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- City search
CREATE INDEX idx_cities_search ON cities USING gin(to_tsvector('english', name));