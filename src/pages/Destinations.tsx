import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SearchBar } from '@/components/shared/SearchBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, DollarSign } from 'lucide-react';
import { useData } from '@/hooks/useData';

export default function Destinations() {
  const { getCities, isLoading } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<any>({});

  const filteredCities = useMemo(() => {
    if (isLoading) return [];
    
    let cities = getCities(filters);
    
    if (searchQuery) {
      cities = cities.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.country_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return cities;
  }, [getCities, filters, searchQuery, isLoading]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading destinations...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Explore Destinations</h1>
          <SearchBar
            placeholder="Search cities, countries, or descriptions..."
            onSearch={setSearchQuery}
            onFilter={setFilters}
            type="cities"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => (
            <Card key={`${city.name}-${city.country_name}`} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                {city.image_url && (
                  <img
                    src={city.image_url}
                    alt={city.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90 text-black">
                    ${city.average_cost_per_day}/day
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {city.name}, {city.country_name}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {city.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {(city.population / 1000000).toFixed(1)}M people
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    ${city.average_cost_per_day}/day
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No destinations found matching your criteria.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}