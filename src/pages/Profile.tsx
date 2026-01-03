import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  MapPin, 
  Calendar, 
  Edit2, 
  Camera,
  Settings,
  Share2,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import parisImage from "@/assets/destination-paris.jpg";
import tokyoImage from "@/assets/destination-tokyo.jpg";
import newyorkImage from "@/assets/destination-newyork.jpg";
import baliImage from "@/assets/destination-bali.jpg";
import dubaiImage from "@/assets/destination-dubai.jpg";

const userProfile = {
  name: "John Doe",
  email: "john@example.com",
  location: "San Francisco, CA",
  joinDate: "January 2023",
  bio: "Adventure seeker and photography enthusiast. Love exploring new cultures, hiking mountains, and trying local cuisines around the world.",
  stats: {
    totalTrips: 12,
    countries: 8,
    activities: 47,
  },
};

const preplannedTrips = [
  {
    id: "1",
    title: "Asian Discovery",
    destination: "Tokyo, Japan",
    date: "Feb 2024",
    image: tokyoImage,
  },
  {
    id: "2",
    title: "Bali Retreat",
    destination: "Bali, Indonesia",
    date: "Mar 2024",
    image: baliImage,
  },
  {
    id: "3",
    title: "Dubai Escape",
    destination: "Dubai, UAE",
    date: "Apr 2024",
    image: dubaiImage,
  },
];

const previousTrips = [
  {
    id: "4",
    title: "European Adventure",
    destination: "Paris, France",
    date: "Jan 2024",
    image: parisImage,
  },
  {
    id: "5",
    title: "NYC Getaway",
    destination: "New York, USA",
    date: "Dec 2023",
    image: newyorkImage,
  },
  {
    id: "6",
    title: "Mediterranean",
    destination: "Barcelona, Spain",
    date: "Nov 2023",
    image: parisImage,
  },
];

export default function Profile() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border p-6 md:p-8 mb-10"
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-gradient-hero flex items-center justify-center shadow-glow">
                  <User className="h-14 w-14 text-primary-foreground" />
                </div>
                <button className="absolute bottom-0 right-0 p-2 rounded-full bg-card border border-border hover:bg-muted transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">
                    {userProfile.name}
                  </h1>
                  <p className="text-muted-foreground">{userProfile.email}</p>
                </div>
                <div className="flex gap-2">
                  <Link to="/settings">
                    <Button variant="outline" size="sm">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  {userProfile.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-primary" />
                  Joined {userProfile.joinDate}
                </span>
              </div>

              <p className="text-foreground/80 mb-4 max-w-2xl">
                {userProfile.bio}
              </p>

              {/* Stats */}
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold gradient-text">{userProfile.stats.totalTrips}</p>
                  <p className="text-xs text-muted-foreground">Trips</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold gradient-text">{userProfile.stats.countries}</p>
                  <p className="text-xs text-muted-foreground">Countries</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold gradient-text">{userProfile.stats.activities}</p>
                  <p className="text-xs text-muted-foreground">Activities</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Preplanned Trips */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h2 className="font-display text-xl font-bold mb-4">Preplanned Trips</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {preplannedTrips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="group bg-card rounded-xl border border-border overflow-hidden card-hover"
              >
                <div className="aspect-video relative">
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <Badge className="absolute top-3 right-3 status-upcoming">Upcoming</Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{trip.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {trip.destination} • {trip.date}
                  </p>
                  <Link to={`/trips/${trip.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Previous Trips */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-display text-xl font-bold mb-4">Previous Trips</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {previousTrips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="group bg-card rounded-xl border border-border overflow-hidden card-hover"
              >
                <div className="aspect-video relative">
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <Badge className="absolute top-3 right-3 status-completed">Completed</Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{trip.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {trip.destination} • {trip.date}
                  </p>
                  <div className="flex gap-2">
                    <Link to={`/trips/${trip.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </Layout>
  );
}
