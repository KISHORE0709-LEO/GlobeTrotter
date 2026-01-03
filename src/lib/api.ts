export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const apiEndpoints = {
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
  },
  users: {
    profile: `${API_BASE_URL}/api/users/profile`,
  },
  destinations: {
    list: `${API_BASE_URL}/api/destinations`,
    search: `${API_BASE_URL}/api/destinations/search`,
    attractions: (cityId: string) => `${API_BASE_URL}/api/destinations/${cityId}/attractions`,
  },
  trips: {
    list: `${API_BASE_URL}/api/trips`,
  },
  categories: `${API_BASE_URL}/api/categories`,
  health: `${API_BASE_URL}/api/health`,
};