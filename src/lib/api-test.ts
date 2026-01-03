import { apiEndpoints } from './api';

export const testApiConnection = async () => {
  try {
    const response = await fetch(apiEndpoints.health);
    const data = await response.json();
    
    if (response.ok && data.status === 'OK') {
      console.log('✅ API connection successful:', data.message);
      return true;
    } else {
      console.error('❌ API health check failed:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ API connection failed:', error);
    return false;
  }
};