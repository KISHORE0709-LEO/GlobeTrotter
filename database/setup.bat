@echo off
REM =====================================================
REM GlobeTrotter Database Setup Script (Windows)
REM Complete PostgreSQL Database Deployment
REM =====================================================

setlocal enabledelayedexpansion

REM Configuration
set DB_NAME=globetrotter_db
set DB_USER=globetrotter_user
set DB_PASSWORD=globetrotter_pass_2024
set DB_HOST=localhost
set DB_PORT=5432

echo ========================================
echo   GlobeTrotter Database Setup Script
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "database\schema.sql" (
    echo [ERROR] Please run this script from the project root directory
    echo [ERROR] Expected to find: database\schema.sql
    pause
    exit /b 1
)

echo [INFO] Checking PostgreSQL connection...
pg_isready -h %DB_HOST% -p %DB_PORT% >nul 2>&1
if errorlevel 1 (
    echo [ERROR] PostgreSQL is not running or not accessible
    echo [ERROR] Please start PostgreSQL service and try again
    pause
    exit /b 1
)
echo [SUCCESS] PostgreSQL is running

echo [INFO] Setting up database and user...
psql -h %DB_HOST% -p %DB_PORT% -U postgres -c "DO $$ BEGIN IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '%DB_USER%') THEN CREATE USER %DB_USER% WITH PASSWORD '%DB_PASSWORD%'; END IF; END $$;" >nul 2>&1

psql -h %DB_HOST% -p %DB_PORT% -U postgres -c "SELECT 'CREATE DATABASE %DB_NAME% OWNER %DB_USER%' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '%DB_NAME%')\gexec" >nul 2>&1

psql -h %DB_HOST% -p %DB_PORT% -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE %DB_NAME% TO %DB_USER%; ALTER USER %DB_USER% CREATEDB;" >nul 2>&1

echo [SUCCESS] Database and user setup completed

echo [INFO] Installing PostgreSQL extensions...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"; CREATE EXTENSION IF NOT EXISTS \"pg_stat_statements\";" >nul 2>&1

psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "CREATE EXTENSION IF NOT EXISTS \"postgis\";" >nul 2>&1 || echo [WARNING] PostGIS extension not available (optional)

echo [SUCCESS] Extensions installed

echo [INFO] Creating database schema...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "database\schema.sql"
if errorlevel 1 (
    echo [ERROR] Failed to create schema
    pause
    exit /b 1
)
echo [SUCCESS] Schema created

echo [INFO] Creating performance indexes...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "database\indexes.sql"
if errorlevel 1 (
    echo [ERROR] Failed to create indexes
    pause
    exit /b 1
)
echo [SUCCESS] Indexes created

echo [INFO] Setting up triggers and business logic...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "database\triggers.sql"
if errorlevel 1 (
    echo [ERROR] Failed to create triggers
    pause
    exit /b 1
)
echo [SUCCESS] Triggers created

echo [INFO] Creating analytical views...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "database\views.sql"
if errorlevel 1 (
    echo [ERROR] Failed to create views
    pause
    exit /b 1
)
echo [SUCCESS] Views created

echo [INFO] Loading sample data...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "database\sample_data.sql"
if errorlevel 1 (
    echo [ERROR] Failed to load sample data
    pause
    exit /b 1
)
echo [SUCCESS] Sample data loaded

echo [INFO] Verifying database installation...
for /f %%i in ('psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';"') do set TABLE_COUNT=%%i

for /f %%i in ('psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -t -c "SELECT COUNT(*) FROM users;"') do set USER_COUNT=%%i

for /f %%i in ('psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -t -c "SELECT COUNT(*) FROM trips;"') do set TRIP_COUNT=%%i

echo [INFO] Created %TABLE_COUNT% tables
echo [INFO] Sample data: %USER_COUNT% users, %TRIP_COUNT% trips

psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT 'Database verification successful' as status; SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = 'public'; SELECT COUNT(*) as total_indexes FROM pg_indexes WHERE schemaname = 'public';"

echo.
echo [SUCCESS] === GlobeTrotter Database Setup Complete ===
echo.
echo Database Connection Details:
echo   Host: %DB_HOST%
echo   Port: %DB_PORT%
echo   Database: %DB_NAME%
echo   Username: %DB_USER%
echo   Password: %DB_PASSWORD%
echo.
echo Connection String:
echo   postgresql://%DB_USER%:%DB_PASSWORD%@%DB_HOST%:%DB_PORT%/%DB_NAME%
echo.
echo pgAdmin Connection:
echo   1. Open pgAdmin
echo   2. Right-click 'Servers' -^> Create -^> Server
echo   3. Name: GlobeTrotter
echo   4. Host: %DB_HOST%, Port: %DB_PORT%
echo   5. Database: %DB_NAME%, Username: %DB_USER%
echo.
echo [SUCCESS] Ready for development and evaluation!
echo.
pause