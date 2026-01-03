# GlobeTrotter

**GlobeTrotter – Empowering Personalized Travel Planning**

## 🌟 Overview
GlobeTrotter is a modern, full-stack travel planning platform that helps users design, organize, and visualize personalized multi-city trips with ease. Built with cutting-edge technologies and following industry best practices.

## 🏗️ Architecture & Technical Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for responsive, utility-first styling
- **shadcn/ui** for consistent, accessible UI components
- **React Router** for client-side routing
- **Framer Motion** for smooth animations
- **React Query** for efficient data fetching and caching
- **Zod** for robust client-side validation

### Backend
- **Node.js** with Express.js framework
- **SQLite** database for lightweight, embedded storage
- **JWT** authentication with bcrypt password hashing
- **WebSocket** for real-time updates
- **Express Validator** for server-side input validation
- **CORS** enabled for cross-origin requests

### Database Design
```sql
users {
  id: INTEGER PRIMARY KEY
  email: TEXT UNIQUE NOT NULL
  password: TEXT NOT NULL (bcrypt hashed)
  name: TEXT NOT NULL
  created_at: DATETIME
}

trips {
  id: INTEGER PRIMARY KEY
  user_id: INTEGER (FK)
  title: TEXT NOT NULL
  description: TEXT
  start_date: DATE
  end_date: DATE
  budget: DECIMAL(10,2)
  status: TEXT DEFAULT 'planning'
  created_at: DATETIME
}

trip_destinations {
  id: INTEGER PRIMARY KEY
  trip_id: INTEGER (FK)
  city_name: TEXT NOT NULL
  country_name: TEXT NOT NULL
  arrival_date: DATE
  departure_date: DATE
  budget: DECIMAL(10,2)
}
```

## 🔒 Security Features
- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Both client and server-side validation
- **SQL Injection Prevention**: Parameterized queries
- **CORS Configuration**: Controlled cross-origin access
- **Email Validation**: RFC-compliant email validation
*Built with ❤️ for seamless travel planning experiences*
