import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, DollarSign, Clock, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SearchBar } from "@/components/shared/SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiEndpoints } from "@/lib/api";

export default function SearchResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async (query = '') => {
    try {
      setLoading(true);
      const url = query 
        ? `${apiEndpoints.destinations.search}?q=${encodeURIComponent(query)}`
        : apiEndpoints.destinations.list;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchDestinations(query);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl border p-4">
                <div className="flex gap-4">
                  <div className="w-48 h-32 bg-muted rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                    <div className="h-6 bg-muted rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Search Results
          </h1>
          <p className="text-muted-foreground">
            Find destinations, activities, and experiences
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar 
            placeholder="Search cities, activities, or keywords..." 
            onSearch={handleSearch}
          />
        </div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <p className="text-muted-foreground">
            Showing <span className="text-foreground font-medium">{results.length}</span> results
            {searchQuery && <span> for "{searchQuery}"</span>}
          </p>
        </motion.div>

        {/* Results List */}
        <div className="space-y-4">
          {results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-card rounded-xl border border-border p-4 hover:border-primary/30 transition-all duration-300 card-hover"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Image */}
                <div className="sm:w-48 h-32 sm:h-auto rounded-lg overflow-hidden flex-shrink-0">
                  {result.image_url ? (
                    <img
                      src={result.image_url}
                      alt={result.city_name || result.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-hero flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {result.city_name ? 'Destination' : 'Attraction'}
                      </Badge>
                      <h3 className="font-display text-lg font-semibold">
                        {result.city_name ? `${result.city_name}, ${result.country_name}` : result.name}
                      </h3>
                    </div>
                    {result.rating && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted">
                        <Star className="h-3 w-3 text-amber fill-amber" />
                        <span className="text-sm font-medium">{result.rating}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {result.description || `Explore ${result.city_name || result.name} and discover amazing attractions and experiences.`}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                    {result.average_cost_per_day && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-primary" />
                        ${result.average_cost_per_day}/day
                      </span>
                    )}
                    {result.average_cost && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-primary" />
                        ${result.average_cost}
                      </span>
                    )}
                    {result.average_visit_duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-primary" />
                        {result.average_visit_duration} min
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-2">
                      {result.category && (
                        <Badge variant="outline" className="text-xs">
                          {result.category}
                        </Badge>
                      )}
                      {result.country_name && (
                        <Badge variant="outline" className="text-xs">
                          {result.country_name}
                        </Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" className="group-hover:text-primary">
                      View Details
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {results.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="font-display text-xl font-bold mb-2">No results found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? `No destinations found for "${searchQuery}"` : 'No destinations available'}
            </p>
            <Button onClick={() => handleSearch('')}>Show All Destinations</Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
