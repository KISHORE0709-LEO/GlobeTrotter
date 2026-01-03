import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  Image as ImageIcon, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { DestinationCard } from "@/components/shared/DestinationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

import parisImage from "@/assets/destination-paris.jpg";
import tokyoImage from "@/assets/destination-tokyo.jpg";
import newyorkImage from "@/assets/destination-newyork.jpg";
import baliImage from "@/assets/destination-bali.jpg";
import dubaiImage from "@/assets/destination-dubai.jpg";

const suggestedDestinations = [
  { name: "Paris", country: "France", image: parisImage, rating: 4.8, priceRange: "$$$" },
  { name: "Tokyo", country: "Japan", image: tokyoImage, rating: 4.9, priceRange: "$$$$" },
  { name: "New York", country: "USA", image: newyorkImage, rating: 4.7, priceRange: "$$$" },
  { name: "Bali", country: "Indonesia", image: baliImage, rating: 4.6, priceRange: "$$" },
  { name: "Dubai", country: "UAE", image: dubaiImage, rating: 4.8, priceRange: "$$$$" },
  { name: "Santorini", country: "Greece", image: parisImage, rating: 4.9, priceRange: "$$$$" },
];

export default function PlanTrip() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tripData, setTripData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
    coverImage: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTripData({ ...tripData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Trip created!",
      description: "Now let's build your itinerary.",
    });
    navigate("/itinerary/new");
  };

  const handleDestinationClick = (name: string) => {
    setTripData({ ...tripData, name: `${name} Adventure` });
    toast({
      title: `${name} selected!`,
      description: "Great choice! Fill in the dates to continue.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Plan a New Trip
          </h1>
          <p className="text-muted-foreground">
            Create your perfect travel itinerary
          </p>
        </motion.div>

        {/* Trip Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-card rounded-2xl border border-border p-6 md:p-8 mb-12"
        >
          <div className="space-y-6">
            {/* Trip Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Trip Name</Label>
              <div className="relative">
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., European Summer Adventure"
                  value={tripData.name}
                  onChange={handleChange}
                  className="pl-10 h-12 bg-muted/50"
                  required
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={tripData.startDate}
                    onChange={handleChange}
                    className="pl-10 h-12 bg-muted/50"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={tripData.endDate}
                    onChange={handleChange}
                    className="pl-10 h-12 bg-muted/50"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="What's special about this trip?"
                value={tripData.description}
                onChange={handleChange}
                className="bg-muted/50 min-h-[100px] resize-none"
              />
            </div>

            {/* Cover Image URL */}
            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image URL (optional)</Label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="coverImage"
                  name="coverImage"
                  placeholder="https://example.com/image.jpg"
                  value={tripData.coverImage}
                  onChange={handleChange}
                  className="pl-10 h-12 bg-muted/50"
                />
              </div>
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full sm:w-auto">
              Continue to Itinerary
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.form>

        {/* Suggested Destinations */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-6">
            <h2 className="font-display text-xl font-bold mb-1">
              Need Inspiration?
            </h2>
            <p className="text-muted-foreground">
              Click a destination to quick-start your trip
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {suggestedDestinations.map((dest, index) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <DestinationCard
                  {...dest}
                  onClick={() => handleDestinationClick(dest.name)}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </Layout>
  );
}
