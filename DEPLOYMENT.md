# Deployment Guide

## Backend Deployment (Vercel)

1. **Database Setup:**
   - Create a PostgreSQL database (e.g., on Neon, Supabase, or Railway)
   - Note down the connection details

2. **Environment Variables:**
   Set these in Vercel dashboard:
   ```
   DB_HOST=your-production-db-host
   DB_PORT=5432
   DB_NAME=globetrotter_db
   DB_USER=your-production-db-user
   DB_PASSWORD=your-production-db-password
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   NODE_ENV=production
   ```

3. **Deploy Backend:**
   ```bash
   cd backend
   vercel --prod
   ```

## Frontend Deployment (Vercel)

1. **Update Environment Variables:**
   - Update `.env.production` with your backend URL
   - Set `VITE_API_URL=https://your-backend-domain.vercel.app`

2. **Deploy Frontend:**
   ```bash
   npm run build
   vercel --prod
   ```

## Local Development

1. **Start Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   npm install
   npm run dev
   ```

## Database Schema

Make sure to run the database schema creation scripts on your production database before deploying.