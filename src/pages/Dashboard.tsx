import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Map, 
  Plane, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Clock,
  ArrowRight 
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SearchBar } from "@/components/shared/SearchBar";
import { DestinationCard } from "@/components/shared/DestinationCard";
import { TripCard } from "@/components/shared/TripCard";
import { StatCard } from "@/components/shared/StatCard";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";

import heroImage from "@/assets/hero-travel.jpg";
import parisImage from "@/assets/destination-paris.jpg";
import tokyoImage from "@/assets/destination-tokyo.jpg";
import newyorkImage from "@/assets/destination-newyork.jpg";
import baliImage from "@/assets/destination-bali.jpg";
import dubaiImage from "@/assets/destination-dubai.jpg";

const stats = [
  { title: "Total Trips", value: 12, icon: Map, trend: { value: 8, isPositive: true } },
  { title: "Countries Visited", value: 8, icon: Plane, trend: { value: 25, isPositive: true } },
  { title: "Upcoming Trips", value: 3, icon: Calendar },
  { title: "Total Spent", value: "$12,450", icon: DollarSign },
];

const destinations = [
  { name: "Paris", country: "France", image: parisImage, rating: 4.8, priceRange: "$$$" },
  { name: "Tokyo", country: "Japan", image: tokyoImage, rating: 4.9, priceRange: "$$$$" },
  { name: "New York", country: "USA", image: newyorkImage, rating: 4.7, priceRange: "$$$" },
  { name: "Bali", country: "Indonesia", image: baliImage, rating: 4.6, priceRange: "$$" },
  { name: "Dubai", country: "UAE", image: dubaiImage, rating: 4.8, priceRange: "$$$$" },
];

const recentTrips = [
  {
    id: "1",
    title: "European Adventure",
    destinations: ["Paris", "Rome", "Barcelona"],
    startDate: "Jan 15",
    endDate: "Jan 28",
    budget: 4500,
    status: "ongoing" as const,
    coverImage: parisImage,
  },
  {
    id: "2",
    title: "Asian Discovery",
    destinations: ["Tokyo", "Kyoto", "Osaka"],
    startDate: "Feb 10",
    endDate: "Feb 20",
    budget: 3800,
    status: "upcoming" as const,
    coverImage: tokyoImage,
  },
  {
    id: "3",
    title: "NYC Getaway",
    destinations: ["New York"],
    startDate: "Dec 20",
    endDate: "Dec 27",
    budget: 2200,
    status: "completed" as const,
    coverImage: newyorkImage,
  },
];

export default function Dashboard() {
  return (
    <>
      <Layout>
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden mb-8 sm:mb-10"
          >
            <div className="absolute inset-0">
              <video
                src="/src/assets/Blue Ocean Travel Vlog Opening Video.mp4"
                autoPlay
                loop
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
            
            <div className="relative z-10 p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 max-w-full sm:max-w-2xl">
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 text-white leading-tight">
                Where will your next
                <span className="text-amber-300 block">adventure take you?</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-200 mb-6 sm:mb-8 max-w-full sm:max-w-md leading-relaxed">
                Plan, organize, and share your travel itineraries with ease. 
                Your journey starts here.
              </p>
              <Link to="/plan-trip">
                <Button variant="hero" size="xl">
                  Plan a New Trip
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.section>

          {/* Search and Filter Bar */}
          <section className="mb-8 sm:mb-10">
            <SearchBar />
          </section>

          {/* Stats Grid */}
          <section className="mb-8 sm:mb-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {stats.map((stat, index) => (
                <StatCard key={stat.title} {...stat} delay={index} />
              ))}
            </div>
          </section>

          {/* Explore Destinations */}
          <section className="mb-8 sm:mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold">Explore Destinations</h2>
                <p className="text-muted-foreground text-sm sm:text-base">Discover popular places to visit</p>
              </div>
              <Link to="/search">
                <Button variant="ghost">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {destinations.map((dest, index) => (
                <motion.div
                  key={dest.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <DestinationCard {...dest} />
                </motion.div>
              ))}
            </div>
          </section>

          {/* Recent Trips */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold">Recent Trips</h2>
                <p className="text-muted-foreground">Your travel history at a glance</p>
              </div>
              <Link to="/trips">
                <Button variant="ghost">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="space-y-3">
              {recentTrips.map((trip) => (
                <TripCard key={trip.id} {...trip} />
              ))}
            </div>
          </section>
        </div>
      </Layout>
      <Footer />
    </>
  );
}
