-- =====================================================
-- GlobeTrotter Database Triggers
-- Audit Logging & Data Integrity
-- =====================================================

-- =====================================================
-- AUDIT LOGGING TRIGGERS
-- =====================================================

-- Generic audit function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (table_name, record_id, action, old_values, user_id)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD), current_setting('app.current_user_id', true)::UUID);
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values, user_id)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD), row_to_json(NEW), current_setting('app.current_user_id', true)::UUID);
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (table_name, record_id, action, new_values, user_id)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW), current_setting('app.current_user_id', true)::UUID);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to critical tables
CREATE TRIGGER audit_users AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_trips AFTER INSERT OR UPDATE OR DELETE ON trips
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_expenses AFTER INSERT OR UPDATE OR DELETE ON expenses
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- =====================================================
-- UPDATED_AT TRIGGERS
-- =====================================================

-- Generic updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attractions_updated_at BEFORE UPDATE ON attractions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_itinerary_items_updated_at BEFORE UPDATE ON itinerary_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trip_comments_updated_at BEFORE UPDATE ON trip_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- BUSINESS LOGIC TRIGGERS
-- =====================================================

-- Update trip actual_spent when expenses change
CREATE OR REPLACE FUNCTION update_trip_actual_spent()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE trips 
        SET actual_spent = (
            SELECT COALESCE(SUM(amount), 0) 
            FROM expenses 
            WHERE trip_id = OLD.trip_id
        )
        WHERE id = OLD.trip_id;
        RETURN OLD;
    ELSE
        UPDATE trips 
        SET actual_spent = (
            SELECT COALESCE(SUM(amount), 0) 
            FROM expenses 
            WHERE trip_id = NEW.trip_id
        )
        WHERE id = NEW.trip_id;
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_trip_spent_on_expense_change
    AFTER INSERT OR UPDATE OR DELETE ON expenses
    FOR EACH ROW EXECUTE FUNCTION update_trip_actual_spent();

-- Update attraction rating when reviews change
CREATE OR REPLACE FUNCTION update_attraction_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE attractions 
        SET rating = (
            SELECT COALESCE(AVG(rating), 0) 
            FROM attraction_reviews 
            WHERE attraction_id = OLD.attraction_id
        )
        WHERE id = OLD.attraction_id;
        RETURN OLD;
    ELSE
        UPDATE attractions 
        SET rating = (
            SELECT COALESCE(AVG(rating), 0) 
            FROM attraction_reviews 
            WHERE attraction_id = NEW.attraction_id
        )
        WHERE id = NEW.attraction_id;
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_attraction_rating_on_review_change
    AFTER INSERT OR UPDATE OR DELETE ON attraction_reviews
    FOR EACH ROW EXECUTE FUNCTION update_attraction_rating();

-- Validate trip dates don't overlap with destinations
CREATE OR REPLACE FUNCTION validate_trip_destination_dates()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if destination dates are within trip dates
    IF NOT EXISTS (
        SELECT 1 FROM trips 
        WHERE id = NEW.trip_id 
        AND NEW.arrival_date >= start_date 
        AND NEW.departure_date <= end_date
    ) THEN
        RAISE EXCEPTION 'Destination dates must be within trip dates';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_destination_dates
    BEFORE INSERT OR UPDATE ON trip_destinations
    FOR EACH ROW EXECUTE FUNCTION validate_trip_destination_dates();

-- =====================================================
-- NOTIFICATION TRIGGERS
-- =====================================================

-- Notify on new trip collaboration
CREATE OR REPLACE FUNCTION notify_trip_collaboration()
RETURNS TRIGGER AS $$
BEGIN
    -- This would integrate with your notification system
    PERFORM pg_notify('trip_collaboration', json_build_object(
        'trip_id', NEW.trip_id,
        'user_id', NEW.user_id,
        'role', NEW.role
    )::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_on_trip_collaboration
    AFTER INSERT ON trip_collaborators
    FOR EACH ROW EXECUTE FUNCTION notify_trip_collaboration();