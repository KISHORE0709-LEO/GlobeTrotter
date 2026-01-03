export interface City {
  name: string;
  country_name: string;
  latitude: number;
  longitude: number;
  population: number;
  average_cost_per_day: number;
  description: string;
  image_url?: string;
}

export interface Attraction {
  name: string;
  city_name: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
  average_visit_duration: number;
  average_cost: number;
  rating: number;
  image_url: string;
  website_url?: string;
}

export interface Destination {
  name: string;
  country_name: string;
  latitude: number;
  longitude: number;
  population: number;
  average_cost_per_day: number;
  description: string;
}

class DataService {
  private cities: City[] = [];
  private attractions: Attraction[] = [];
  private destinations: Destination[] = [];

  async loadData() {
    try {
      const [citiesRes, attractionsRes, destinationsRes] = await Promise.all([
        fetch('/data/cities.csv'),
        fetch('/data/attractions.csv'),
        fetch('/data/destinations.csv')
      ]);

      this.cities = this.parseCSV(await citiesRes.text(), this.parseCityRow);
      this.attractions = this.parseCSV(await attractionsRes.text(), this.parseAttractionRow);
      this.destinations = this.parseCSV(await destinationsRes.text(), this.parseDestinationRow);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  private parseCSV<T>(csvText: string, rowParser: (row: string[]) => T): T[] {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
      const values = this.parseCSVLine(line);
      return rowParser(values);
    });
  }

  private parseCSVLine(line: string): string[] {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }

  private parseCityRow = (row: string[]): City => ({
    name: row[0],
    country_name: row[1],
    latitude: parseFloat(row[2]),
    longitude: parseFloat(row[3]),
    population: parseInt(row[4]),
    average_cost_per_day: parseFloat(row[5]),
    description: row[6]?.replace(/"/g, ''),
    image_url: row[7]
  });

  private parseAttractionRow = (row: string[]): Attraction => ({
    name: row[0],
    city_name: row[1],
    category: row[2],
    description: row[3]?.replace(/"/g, ''),
    latitude: parseFloat(row[4]),
    longitude: parseFloat(row[5]),
    average_visit_duration: parseInt(row[6]),
    average_cost: parseFloat(row[7]),
    rating: parseFloat(row[8]),
    image_url: row[9],
    website_url: row[10]
  });

  private parseDestinationRow = (row: string[]): Destination => ({
    name: row[0],
    country_name: row[1],
    latitude: parseFloat(row[2]),
    longitude: parseFloat(row[3]),
    population: parseInt(row[4]),
    average_cost_per_day: parseFloat(row[5]),
    description: row[6]?.replace(/"/g, '')
  });

  // Filter methods
  getCities(filters?: { country?: string; maxCost?: number; minPopulation?: number }) {
    let filtered = [...this.cities];
    
    if (filters?.country) {
      filtered = filtered.filter(city => 
        city.country_name.toLowerCase().includes(filters.country!.toLowerCase())
      );
    }
    
    if (filters?.maxCost) {
      filtered = filtered.filter(city => city.average_cost_per_day <= filters.maxCost!);
    }
    
    if (filters?.minPopulation) {
      filtered = filtered.filter(city => city.population >= filters.minPopulation!);
    }
    
    return filtered;
  }

  getAttractions(filters?: { city?: string; category?: string; maxCost?: number; minRating?: number }) {
    let filtered = [...this.attractions];
    
    if (filters?.city) {
      filtered = filtered.filter(attraction => 
        attraction.city_name.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }
    
    if (filters?.category) {
      filtered = filtered.filter(attraction => 
        attraction.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }
    
    if (filters?.maxCost) {
      filtered = filtered.filter(attraction => attraction.average_cost <= filters.maxCost!);
    }
    
    if (filters?.minRating) {
      filtered = filtered.filter(attraction => attraction.rating >= filters.minRating!);
    }
    
    return filtered;
  }

  getDestinations(filters?: { country?: string; maxCost?: number }) {
    let filtered = [...this.destinations];
    
    if (filters?.country) {
      filtered = filtered.filter(dest => 
        dest.country_name.toLowerCase().includes(filters.country!.toLowerCase())
      );
    }
    
    if (filters?.maxCost) {
      filtered = filtered.filter(dest => dest.average_cost_per_day <= filters.maxCost!);
    }
    
    return filtered;
  }

  searchCities(query: string) {
    return this.cities.filter(city =>
      city.name.toLowerCase().includes(query.toLowerCase()) ||
      city.country_name.toLowerCase().includes(query.toLowerCase()) ||
      city.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  getAttractionsByCity(cityName: string) {
    return this.attractions.filter(attraction =>
      attraction.city_name.toLowerCase() === cityName.toLowerCase()
    );
  }

  getCountries() {
    return [...new Set(this.cities.map(city => city.country_name))].sort();
  }

  getAttractionCategories() {
    return [...new Set(this.attractions.map(attraction => attraction.category))].sort();
  }
}

export const dataService = new DataService();