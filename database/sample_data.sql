-- =====================================================
-- GlobeTrotter Sample Data
-- Demonstration & Testing Data
-- =====================================================

-- =====================================================
-- COUNTRIES & CITIES
-- =====================================================

INSERT INTO countries (name, iso_code, currency, timezone) VALUES
('United States', 'USA', 'USD', 'America/New_York'),
('France', 'FRA', 'EUR', 'Europe/Paris'),
('Japan', 'JPN', 'JPY', 'Asia/Tokyo'),
('India', 'IND', 'INR', 'Asia/Kolkata'),
('United Kingdom', 'GBR', 'GBP', 'Europe/London'),
('Australia', 'AUS', 'AUD', 'Australia/Sydney'),
('Germany', 'DEU', 'EUR', 'Europe/Berlin'),
('Thailand', 'THA', 'THB', 'Asia/Bangkok');

-- Get country IDs for cities
WITH country_ids AS (
    SELECT name, id FROM countries
)
INSERT INTO cities (name, country_id, latitude, longitude, population, timezone, average_cost_per_day)
SELECT * FROM (VALUES
    ('New York', (SELECT id FROM country_ids WHERE name = 'United States'), 40.7128, -74.0060, 8336817, 'America/New_York', 200.00),
    ('Paris', (SELECT id FROM country_ids WHERE name = 'France'), 48.8566, 2.3522, 2161000, 'Europe/Paris', 150.00),
    ('Tokyo', (SELECT id FROM country_ids WHERE name = 'Japan'), 35.6762, 139.6503, 13929286, 'Asia/Tokyo', 180.00),
    ('Mumbai', (SELECT id FROM country_ids WHERE name = 'India'), 19.0760, 72.8777, 12442373, 'Asia/Kolkata', 50.00),
    ('London', (SELECT id FROM country_ids WHERE name = 'United Kingdom'), 51.5074, -0.1278, 8982000, 'Europe/London', 170.00),
    ('Sydney', (SELECT id FROM country_ids WHERE name = 'Australia'), -33.8688, 151.2093, 5312163, 'Australia/Sydney', 160.00),
    ('Berlin', (SELECT id FROM country_ids WHERE name = 'Germany'), 52.5200, 13.4050, 3669491, 'Europe/Berlin', 120.00),
    ('Bangkok', (SELECT id FROM country_ids WHERE name = 'Thailand'), 13.7563, 100.5018, 10539415, 'Asia/Bangkok', 80.00)
) AS v(name, country_id, latitude, longitude, population, timezone, average_cost_per_day);

-- =====================================================
-- ATTRACTIONS
-- =====================================================

WITH city_ids AS (
    SELECT name, id FROM cities
)
INSERT INTO attractions (name, city_id, category, description, latitude, longitude, average_visit_duration, average_cost, rating, image_url, website_url)
SELECT * FROM (VALUES
    ('Statue of Liberty', (SELECT id FROM city_ids WHERE name = 'New York'), 'landmark', 'Iconic symbol of freedom and democracy', 40.6892, -74.0445, 180, 25.00, 4.5, 'https://example.com/statue-liberty.jpg', 'https://www.nps.gov/stli/'),
    ('Central Park', (SELECT id FROM city_ids WHERE name = 'New York'), 'park', 'Large public park in Manhattan', 40.7829, -73.9654, 120, 0.00, 4.7, 'https://example.com/central-park.jpg', 'https://www.centralparknyc.org/'),
    ('Eiffel Tower', (SELECT id FROM city_ids WHERE name = 'Paris'), 'landmark', 'Iron lattice tower and symbol of Paris', 48.8584, 2.2945, 90, 29.00, 4.6, 'https://example.com/eiffel-tower.jpg', 'https://www.toureiffel.paris/'),
    ('Louvre Museum', (SELECT id FROM city_ids WHERE name = 'Paris'), 'museum', 'World''s largest art museum', 48.8606, 2.3376, 240, 17.00, 4.8, 'https://example.com/louvre.jpg', 'https://www.louvre.fr/'),
    ('Tokyo Tower', (SELECT id FROM city_ids WHERE name = 'Tokyo'), 'landmark', 'Communications tower inspired by Eiffel Tower', 35.6586, 139.7454, 60, 12.00, 4.3, 'https://example.com/tokyo-tower.jpg', 'https://www.tokyotower.co.jp/'),
    ('Senso-ji Temple', (SELECT id FROM city_ids WHERE name = 'Tokyo'), 'temple', 'Ancient Buddhist temple in Asakusa', 35.7148, 139.7967, 90, 0.00, 4.5, 'https://example.com/sensoji.jpg', 'https://www.senso-ji.jp/'),
    ('Gateway of India', (SELECT id FROM city_ids WHERE name = 'Mumbai'), 'landmark', 'Arch monument built during British Raj', 18.9220, 72.8347, 45, 0.00, 4.2, 'https://example.com/gateway-india.jpg', null),
    ('Big Ben', (SELECT id FROM city_ids WHERE name = 'London'), 'landmark', 'Famous clock tower at Palace of Westminster', 51.4994, -0.1245, 30, 0.00, 4.4, 'https://example.com/big-ben.jpg', null),
    ('Sydney Opera House', (SELECT id FROM city_ids WHERE name = 'Sydney'), 'landmark', 'Multi-venue performing arts centre', -33.8568, 151.2153, 120, 45.00, 4.7, 'https://example.com/opera-house.jpg', 'https://www.sydneyoperahouse.com/'),
    ('Brandenburg Gate', (SELECT id FROM city_ids WHERE name = 'Berlin'), 'landmark', 'Neoclassical monument and symbol of Berlin', 52.5163, 13.3777, 30, 0.00, 4.3, 'https://example.com/brandenburg.jpg', null),
    ('Grand Palace', (SELECT id FROM city_ids WHERE name = 'Bangkok'), 'palace', 'Complex of buildings at the heart of Bangkok', 13.7500, 100.4915, 180, 15.00, 4.6, 'https://example.com/grand-palace.jpg', null)
) AS v(name, city_id, category, description, latitude, longitude, average_visit_duration, average_cost, rating, image_url, website_url);

-- =====================================================
-- SAMPLE USERS
-- =====================================================

INSERT INTO users (email, username, password_hash, first_name, last_name, phone, preferred_currency, timezone, is_verified, is_active) VALUES
('john.doe@example.com', 'johndoe', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJBzxqEyy', 'John', 'Doe', '+1234567890', 'USD', 'America/New_York', true, true),
('jane.smith@example.com', 'janesmith', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJBzxqEyy', 'Jane', 'Smith', '+1987654321', 'EUR', 'Europe/London', true, true),
('alex.chen@example.com', 'alexchen', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJBzxqEyy', 'Alex', 'Chen', '+81234567890', 'JPY', 'Asia/Tokyo', true, true),
('priya.patel@example.com', 'priyapatel', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJBzxqEyy', 'Priya', 'Patel', '+919876543210', 'INR', 'Asia/Kolkata', true, true),
('demo@globetrotter.com', 'demo_user', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJBzxqEyy', 'Demo', 'User', '+1555000000', 'USD', 'UTC', true, true);

-- =====================================================
-- SAMPLE TRIPS
-- =====================================================

WITH user_ids AS (
    SELECT username, id FROM users
)
INSERT INTO trips (user_id, title, description, start_date, end_date, total_budget, currency, status, visibility, cover_image_url)
SELECT * FROM (VALUES
    ((SELECT id FROM user_ids WHERE username = 'johndoe'), 'European Adventure 2024', 'Exploring the cultural capitals of Europe', '2024-06-15', '2024-06-30', 5000.00, 'USD', 'planned', 'public', 'https://example.com/europe-trip.jpg'),
    ((SELECT id FROM user_ids WHERE username = 'janesmith'), 'Japan Discovery Tour', 'Traditional and modern Japan experience', '2024-04-10', '2024-04-20', 3500.00, 'USD', 'completed', 'public', 'https://example.com/japan-trip.jpg'),
    ((SELECT id FROM user_ids WHERE username = 'alexchen'), 'Southeast Asia Backpacking', 'Budget-friendly adventure through SEA', '2024-07-01', '2024-07-21', 2000.00, 'USD', 'draft', 'private', 'https://example.com/sea-trip.jpg'),
    ((SELECT id FROM user_ids WHERE username = 'priyapatel'), 'Australian Road Trip', 'Exploring the Australian coast', '2024-09-05', '2024-09-20', 4000.00, 'AUD', 'planned', 'friends', 'https://example.com/australia-trip.jpg'),
    ((SELECT id FROM user_ids WHERE username = 'demo_user'), 'Demo Trip - World Tour', 'Sample trip for demonstration', '2024-12-01', '2024-12-15', 10000.00, 'USD', 'draft', 'public', 'https://example.com/world-trip.jpg')
) AS v(user_id, title, description, start_date, end_date, total_budget, currency, status, visibility, cover_image_url);

-- =====================================================
-- SAMPLE TRIP DESTINATIONS
-- =====================================================

WITH trip_ids AS (
    SELECT title, id FROM trips
), city_ids AS (
    SELECT name, id FROM cities
)
INSERT INTO trip_destinations (trip_id, city_id, arrival_date, departure_date, order_index, budget_allocated, notes)
SELECT * FROM (VALUES
    ((SELECT id FROM trip_ids WHERE title = 'European Adventure 2024'), (SELECT id FROM city_ids WHERE name = 'Paris'), '2024-06-15', '2024-06-20', 1, 1500.00, 'Visit major landmarks and museums'),
    ((SELECT id FROM trip_ids WHERE title = 'European Adventure 2024'), (SELECT id FROM city_ids WHERE name = 'Berlin'), '2024-06-21', '2024-06-25', 2, 1200.00, 'Explore historical sites'),
    ((SELECT id FROM trip_ids WHERE title = 'European Adventure 2024'), (SELECT id FROM city_ids WHERE name = 'London'), '2024-06-26', '2024-06-30', 3, 2000.00, 'Final stop - shopping and theater'),
    ((SELECT id FROM trip_ids WHERE title = 'Japan Discovery Tour'), (SELECT id FROM city_ids WHERE name = 'Tokyo'), '2024-04-10', '2024-04-20', 1, 3500.00, 'Complete Japan experience'),
    ((SELECT id FROM trip_ids WHERE title = 'Australian Road Trip'), (SELECT id FROM city_ids WHERE name = 'Sydney'), '2024-09-05', '2024-09-20', 1, 4000.00, 'Base for exploring Australia')
) AS v(trip_id, city_id, arrival_date, departure_date, order_index, budget_allocated, notes);

-- =====================================================
-- SAMPLE EXPENSES
-- =====================================================

WITH trip_ids AS (
    SELECT title, id FROM trips
)
INSERT INTO expenses (trip_id, category, amount, currency, description, expense_date)
SELECT * FROM (VALUES
    ((SELECT id FROM trip_ids WHERE title = 'Japan Discovery Tour'), 'accommodation', 150.00, 'USD', 'Hotel in Shibuya', '2024-04-10'),
    ((SELECT id FROM trip_ids WHERE title = 'Japan Discovery Tour'), 'food', 45.00, 'USD', 'Sushi dinner', '2024-04-10'),
    ((SELECT id FROM trip_ids WHERE title = 'Japan Discovery Tour'), 'transport', 25.00, 'USD', 'JR Pass day ticket', '2024-04-11'),
    ((SELECT id FROM trip_ids WHERE title = 'Japan Discovery Tour'), 'attractions', 12.00, 'USD', 'Tokyo Tower admission', '2024-04-11'),
    ((SELECT id FROM trip_ids WHERE title = 'Japan Discovery Tour'), 'shopping', 80.00, 'USD', 'Souvenirs from Harajuku', '2024-04-12')
) AS v(trip_id, category, amount, currency, description, expense_date);

-- =====================================================
-- SAMPLE REVIEWS
-- =====================================================

WITH user_ids AS (
    SELECT username, id FROM users
), attraction_ids AS (
    SELECT name, id FROM attractions
)
INSERT INTO attraction_reviews (attraction_id, user_id, rating, title, content, visit_date)
SELECT * FROM (VALUES
    ((SELECT id FROM attraction_ids WHERE name = 'Tokyo Tower'), (SELECT id FROM user_ids WHERE username = 'janesmith'), 4, 'Great views of the city', 'Amazing panoramic views of Tokyo. Best visited during sunset. A bit crowded but worth it!', '2024-04-11'),
    ((SELECT id FROM attraction_ids WHERE name = 'Eiffel Tower'), (SELECT id FROM user_ids WHERE username = 'johndoe'), 5, 'Iconic and breathtaking', 'Absolutely stunning, especially at night when it lights up. The elevator ride is smooth and the views are incredible.', '2024-06-16'),
    ((SELECT id FROM attraction_ids WHERE name = 'Sydney Opera House'), (SELECT id FROM user_ids WHERE username = 'priyapatel'), 5, 'Architectural masterpiece', 'Not just beautiful from outside, the interior tours are fascinating. Caught a great performance here too!', '2024-09-10'),
    ((SELECT id FROM attraction_ids WHERE name = 'Central Park'), (SELECT id FROM user_ids WHERE username = 'alexchen'), 4, 'Perfect for relaxation', 'Great place to escape the city hustle. Loved the boat rides and the zoo. Could spend a whole day here.', '2024-05-15')
) AS v(attraction_id, user_id, rating, title, content, visit_date);

-- =====================================================
-- SAMPLE USER PREFERENCES
-- =====================================================

WITH user_ids AS (
    SELECT username, id FROM users
)
INSERT INTO user_preferences (user_id, category, preference_value)
SELECT * FROM (VALUES
    ((SELECT id FROM user_ids WHERE username = 'johndoe'), 'budget_range', 'mid_range'),
    ((SELECT id FROM user_ids WHERE username = 'johndoe'), 'activity_types', 'culture,history,food'),
    ((SELECT id FROM user_ids WHERE username = 'janesmith'), 'budget_range', 'luxury'),
    ((SELECT id FROM user_ids WHERE username = 'janesmith'), 'activity_types', 'culture,shopping,nightlife'),
    ((SELECT id FROM user_ids WHERE username = 'alexchen'), 'budget_range', 'budget'),
    ((SELECT id FROM user_ids WHERE username = 'alexchen'), 'activity_types', 'adventure,nature,backpacking'),
    ((SELECT id FROM user_ids WHERE username = 'priyapatel'), 'budget_range', 'mid_range'),
    ((SELECT id FROM user_ids WHERE username = 'priyapatel'), 'activity_types', 'culture,nature,photography')
) AS v(user_id, category, preference_value);

-- =====================================================
-- SAMPLE SYSTEM SETTINGS
-- =====================================================

INSERT INTO system_settings (key, value, description) VALUES
('default_currency', 'USD', 'Default currency for new users'),
('max_trip_duration_days', '365', 'Maximum allowed trip duration in days'),
('max_destinations_per_trip', '20', 'Maximum destinations allowed per trip'),
('enable_social_features', 'true', 'Enable social features like following and sharing'),
('maintenance_mode', 'false', 'System maintenance mode flag'),
('api_rate_limit_per_hour', '1000', 'API rate limit per user per hour'),
('max_file_upload_size_mb', '10', 'Maximum file upload size in MB'),
('supported_currencies', 'USD,EUR,GBP,JPY,AUD,CAD,INR,THB', 'Comma-separated list of supported currencies');