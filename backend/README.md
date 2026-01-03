# Backend Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Start Backend Server**
   ```bash
   npm run dev
   ```

3. **Test Connection**
   - Backend runs on: http://localhost:5000
   - Test endpoint: http://localhost:5000/api/health

## Database Connection

The backend automatically connects to your PostgreSQL database using these settings:
- Host: localhost
- Port: 5432
- Database: globetrotter_db
- Username: globetrotter_user
- Password: globetrotter_pass_2024

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Trips
- `GET /api/trips` - Get user trips (requires auth)
- `POST /api/trips` - Create new trip (requires auth)

### Destinations
- `GET /api/destinations/popular` - Get popular destinations

## Frontend Integration

The login page now connects to the backend API with:
- ✅ Real authentication
- ✅ Error handling
- ✅ Token storage
- ✅ User feedback

## Test Users

Use these sample users from the database:
- Email: john.doe@example.com, Password: password123
- Email: jane.smith@example.com, Password: password123
- Email: demo@globetrotter.com, Password: password123