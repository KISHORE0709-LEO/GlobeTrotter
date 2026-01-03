import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SearchBar } from '@/components/shared/SearchBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, Star, ExternalLink } from 'lucide-react';
import { useData } from '@/hooks/useData';

export default function Attractions() {
  const { getAttractions, isLoading } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<any>({});

  const filteredAttractions = useMemo(() => {
    if (isLoading) return [];
    
    let attractions = getAttractions(filters);
    
    if (searchQuery) {
      attractions = attractions.filter(attraction =>
        attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attraction.city_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attraction.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return attractions;
  }, [getAttractions, filters, searchQuery, isLoading]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading attractions...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Discover Attractions</h1>
          <SearchBar
            placeholder="Search attractions, cities, or categories..."
            onSearch={setSearchQuery}
            onFilter={setFilters}
            type="attractions"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAttractions.map((attraction, index) => (
            <Card key={`${attraction.name}-${index}`} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-500 to-blue-600 relative">
                {attraction.image_url && (
                  <img
                    src={attraction.image_url}
                    alt={attraction.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90 text-black">
                    {attraction.category}
                  </Badge>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge variant="default" className="bg-yellow-500 text-black flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    {attraction.rating}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {attraction.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{attraction.city_name}</p>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {attraction.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {attraction.average_visit_duration} min
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    ${attraction.average_cost}
                  </div>
                </div>

                {attraction.website_url && (
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href={attraction.website_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAttractions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No attractions found matching your criteria.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}