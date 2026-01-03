import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { apiEndpoints } from "@/lib/api";

import parisImage from "@/assets/destination-paris.jpg";
import tokyoImage from "@/assets/destination-tokyo.jpg";
import newyorkImage from "@/assets/destination-newyork.jpg";
import baliImage from "@/assets/destination-bali.jpg";
import dubaiImage from "@/assets/destination-dubai.jpg";

export default function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserProfile();
    fetchUserTrips();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (user.id) {
        const response = await fetch(apiEndpoints.users.profile, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
        } else {
          // Fallback to localStorage user data
          setUserProfile(user);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setUserProfile(user);
    }
  };

  const fetchUserTrips = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiEndpoints.trips.list, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTrips(data);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="animate-pulse">
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8 mb-10">
              <div className="flex gap-6">
                <div className="w-28 h-28 rounded-full bg-muted"></div>
                <div className="flex-1">
                  <div className="h-8 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                  <div className="h-16 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!userProfile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center">
            <p>Please log in to view your profile.</p>
            <Link to="/login">
              <Button className="mt-4">Login</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const upcomingTrips = trips.filter(trip => trip.status === 'planned' || trip.status === 'draft');
  const completedTrips = trips.filter(trip => trip.status === 'completed');

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
                    {userProfile.firstName} {userProfile.lastName}
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
                  {userProfile.location || 'Location not set'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-primary" />
                  Joined {new Date(userProfile.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>

              <p className="text-foreground/80 mb-4 max-w-2xl">
                {userProfile.bio || 'No bio added yet. Tell us about your travel adventures!'}
              </p>

              {/* Stats */}
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold gradient-text">{trips.length}</p>
                  <p className="text-xs text-muted-foreground">Trips</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold gradient-text">{upcomingTrips.length}</p>
                  <p className="text-xs text-muted-foreground">Upcoming</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold gradient-text">{completedTrips.length}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Upcoming Trips */}
        {upcomingTrips.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <h2 className="font-display text-xl font-bold mb-4">Upcoming Trips</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingTrips.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="group bg-card rounded-xl border border-border overflow-hidden card-hover"
                >
                  <div className="aspect-video relative bg-gradient-hero">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className="absolute top-3 right-3 status-upcoming">
                      {trip.status === 'planned' ? 'Planned' : 'Draft'}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{trip.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      Budget: {trip.currency} {trip.total_budget || 'Not set'}
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
        )}

        {/* Completed Trips */}
        {completedTrips.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display text-xl font-bold mb-4">Completed Trips</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedTrips.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="group bg-card rounded-xl border border-border overflow-hidden card-hover"
                >
                  <div className="aspect-video relative bg-gradient-hero">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className="absolute top-3 right-3 status-completed">Completed</Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{trip.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      Spent: {trip.currency} {trip.actual_spent || 0}
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
        )}

        {/* No Trips Message */}
        {trips.length === 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center py-12"
          >
            <h3 className="font-display text-xl font-bold mb-2">No trips yet</h3>
            <p className="text-muted-foreground mb-6">Start planning your first adventure!</p>
            <Link to="/plan-trip">
              <Button>Plan Your First Trip</Button>
            </Link>
          </motion.section>
        )}
      </div>
    </Layout>
  );
}
