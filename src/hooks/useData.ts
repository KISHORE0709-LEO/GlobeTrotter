import { useState, useEffect } from 'react';
import { dataService, City, Attraction, Destination } from '@/services/dataService';

export function useData() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await dataService.loadData();
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load data');
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    isLoading,
    error,
    getCities: (filters?: { country?: string; maxCost?: number; minPopulation?: number }) => 
      dataService.getCities(filters),
    getAttractions: (filters?: { city?: string; category?: string; maxCost?: number; minRating?: number }) => 
      dataService.getAttractions(filters),
    getDestinations: (filters?: { country?: string; maxCost?: number }) => 
      dataService.getDestinations(filters),
    searchCities: (query: string) => dataService.searchCities(query),
    getAttractionsByCity: (cityName: string) => dataService.getAttractionsByCity(cityName),
    getCountries: () => dataService.getCountries(),
    getAttractionCategories: () => dataService.getAttractionCategories(),
  };
}