#!/bin/bash

# =====================================================
# GlobeTrotter Database Setup Script
# Complete PostgreSQL Database Deployment
# =====================================================

set -e  # Exit on any error

# Configuration
DB_NAME="globetrotter_db"
DB_USER="globetrotter_user"
DB_PASSWORD="globetrotter_pass_2024"
DB_HOST="localhost"
DB_PORT="5432"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if PostgreSQL is running
check_postgres() {
    print_status "Checking PostgreSQL connection..."
    if pg_isready -h $DB_HOST -p $DB_PORT > /dev/null 2>&1; then
        print_success "PostgreSQL is running"
    else
        print_error "PostgreSQL is not running or not accessible"
        print_error "Please start PostgreSQL service and try again"
        exit 1
    fi
}

# Function to create database and user
setup_database() {
    print_status "Setting up database and user..."
    
    # Create user if not exists
    psql -h $DB_HOST -p $DB_PORT -U postgres -c "
        DO \$\$
        BEGIN
            IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
                CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
            END IF;
        END
        \$\$;
    " 2>/dev/null || print_warning "User might already exist"
    
    # Create database if not exists
    psql -h $DB_HOST -p $DB_PORT -U postgres -c "
        SELECT 'CREATE DATABASE $DB_NAME OWNER $DB_USER'
        WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec
    " 2>/dev/null || print_warning "Database might already exist"
    
    # Grant privileges
    psql -h $DB_HOST -p $DB_PORT -U postgres -c "
        GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
        ALTER USER $DB_USER CREATEDB;
    "
    
    print_success "Database and user setup completed"
}

# Function to install extensions
install_extensions() {
    print_status "Installing PostgreSQL extensions..."
    
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
        CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";
        CREATE EXTENSION IF NOT EXISTS \"pg_stat_statements\";
    "
    
    # Try to install PostGIS (optional)
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
        CREATE EXTENSION IF NOT EXISTS \"postgis\";
    " 2>/dev/null || print_warning "PostGIS extension not available (optional for geospatial features)"
    
    print_success "Extensions installed"
}

# Function to run SQL files
run_sql_file() {
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        print_status "$description"
        psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$file"
        print_success "$description completed"
    else
        print_error "File not found: $file"
        exit 1
    fi
}

# Function to verify installation
verify_installation() {
    print_status "Verifying database installation..."
    
    # Check table count
    TABLE_COUNT=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "
        SELECT COUNT(*) FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    " | tr -d ' ')
    
    print_status "Created $TABLE_COUNT tables"
    
    # Check sample data
    USER_COUNT=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "
        SELECT COUNT(*) FROM users;
    " | tr -d ' ')
    
    TRIP_COUNT=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "
        SELECT COUNT(*) FROM trips;
    " | tr -d ' ')
    
    print_status "Sample data: $USER_COUNT users, $TRIP_COUNT trips"
    
    # Test a complex query
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
        SELECT 'Database verification successful' as status;
        SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = 'public';
        SELECT COUNT(*) as total_indexes FROM pg_indexes WHERE schemaname = 'public';
    "
    
    print_success "Database verification completed successfully!"
}

# Function to display connection info
display_connection_info() {
    print_success "=== GlobeTrotter Database Setup Complete ==="
    echo ""
    echo "Database Connection Details:"
    echo "  Host: $DB_HOST"
    echo "  Port: $DB_PORT"
    echo "  Database: $DB_NAME"
    echo "  Username: $DB_USER"
    echo "  Password: $DB_PASSWORD"
    echo ""
    echo "Connection String:"
    echo "  postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
    echo ""
    echo "pgAdmin Connection:"
    echo "  1. Open pgAdmin"
    echo "  2. Right-click 'Servers' -> Create -> Server"
    echo "  3. Name: GlobeTrotter"
    echo "  4. Host: $DB_HOST, Port: $DB_PORT"
    echo "  5. Database: $DB_NAME, Username: $DB_USER"
    echo ""
    print_success "Ready for development and evaluation!"
}

# Main execution
main() {
    echo "========================================"
    echo "  GlobeTrotter Database Setup Script"
    echo "========================================"
    echo ""
    
    # Check if we're in the right directory
    if [ ! -f "database/schema.sql" ]; then
        print_error "Please run this script from the project root directory"
        print_error "Expected to find: database/schema.sql"
        exit 1
    fi
    
    # Run setup steps
    check_postgres
    setup_database
    install_extensions
    
    # Run SQL files in correct order
    run_sql_file "database/schema.sql" "Creating database schema..."
    run_sql_file "database/indexes.sql" "Creating performance indexes..."
    run_sql_file "database/triggers.sql" "Setting up triggers and business logic..."
    run_sql_file "database/views.sql" "Creating analytical views..."
    run_sql_file "database/sample_data.sql" "Loading sample data..."
    
    # Verify and display info
    verify_installation
    display_connection_info
}

# Handle script arguments
case "${1:-setup}" in
    "setup")
        main
        ;;
    "verify")
        verify_installation
        ;;
    "clean")
        print_warning "Dropping database $DB_NAME..."
        psql -h $DB_HOST -p $DB_PORT -U postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
        psql -h $DB_HOST -p $DB_PORT -U postgres -c "DROP USER IF EXISTS $DB_USER;"
        print_success "Database cleaned"
        ;;
    "help")
        echo "Usage: $0 [setup|verify|clean|help]"
        echo "  setup  - Complete database setup (default)"
        echo "  verify - Verify existing installation"
        echo "  clean  - Remove database and user"
        echo "  help   - Show this help"
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac