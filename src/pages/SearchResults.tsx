import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, DollarSign, Clock, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SearchBar } from "@/components/shared/SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import parisImage from "@/assets/destination-paris.jpg";
import tokyoImage from "@/assets/destination-tokyo.jpg";
import newyorkImage from "@/assets/destination-newyork.jpg";
import baliImage from "@/assets/destination-bali.jpg";
import dubaiImage from "@/assets/destination-dubai.jpg";

const searchResults = [
  {
    id: "1",
    type: "destination",
    name: "Paris, France",
    description: "The City of Light offers world-renowned art, architecture, and cuisine. Visit the Eiffel Tower, Louvre Museum, and charming Montmartre.",
    rating: 4.8,
    priceLevel: "$$$",
    duration: "5-7 days recommended",
    tags: ["Culture", "History", "Romance"],
    image: parisImage,
  },
  {
    id: "2",
    type: "destination",
    name: "Tokyo, Japan",
    description: "A fascinating blend of traditional temples and cutting-edge technology. Experience ancient shrines, vibrant neighborhoods, and incredible food.",
    rating: 4.9,
    priceLevel: "$$$$",
    duration: "7-10 days recommended",
    tags: ["Culture", "Food", "Technology"],
    image: tokyoImage,
  },
  {
    id: "3",
    type: "activity",
    name: "Central Park Walking Tour",
    description: "Explore the iconic 843-acre urban park in the heart of Manhattan. Visit famous landmarks like Bethesda Fountain and Bow Bridge.",
    rating: 4.7,
    priceLevel: "$",
    duration: "3-4 hours",
    tags: ["Nature", "Walking", "Photography"],
    image: newyorkImage,
  },
  {
    id: "4",
    type: "destination",
    name: "Bali, Indonesia",
    description: "Tropical paradise known for forested volcanic mountains, iconic rice paddies, beaches, and coral reefs. Perfect for relaxation and adventure.",
    rating: 4.6,
    priceLevel: "$$",
    duration: "7-14 days recommended",
    tags: ["Beach", "Nature", "Wellness"],
    image: baliImage,
  },
  {
    id: "5",
    type: "activity",
    name: "Desert Safari Adventure",
    description: "Experience thrilling dune bashing, camel rides, and a traditional Bedouin camp dinner under the stars in the Dubai desert.",
    rating: 4.8,
    priceLevel: "$$",
    duration: "6-8 hours",
    tags: ["Adventure", "Desert", "Culture"],
    image: dubaiImage,
  },
  {
    id: "6",
    type: "destination",
    name: "New York City, USA",
    description: "The Big Apple offers endless entertainment, world-class museums, Broadway shows, and iconic landmarks like Times Square and the Statue of Liberty.",
    rating: 4.7,
    priceLevel: "$$$",
    duration: "4-7 days recommended",
    tags: ["Urban", "Entertainment", "Shopping"],
    image: newyorkImage,
  },
];

export default function SearchResults() {
  const [results] = useState(searchResults);

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
          <SearchBar placeholder="Search cities, activities, or keywords..." />
        </div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <p className="text-muted-foreground">
            Showing <span className="text-foreground font-medium">{results.length}</span> results
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
                  <img
                    src={result.image}
                    alt={result.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {result.type === "destination" ? "Destination" : "Activity"}
                      </Badge>
                      <h3 className="font-display text-lg font-semibold">{result.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted">
                      <Star className="h-3 w-3 text-amber fill-amber" />
                      <span className="text-sm font-medium">{result.rating}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {result.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-primary" />
                      {result.priceLevel}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-primary" />
                      {result.duration}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-2">
                      {result.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
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
      </div>
    </Layout>
  );
}
