import { motion } from "framer-motion";
import { Globe, Users, MapPin, Calendar, DollarSign, Heart } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <Globe className="h-16 w-16 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            About <span className="gradient-text">GlobeTrotter</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Empowering personalized travel planning for adventurers worldwide. 
            We transform the way you dream, design, and organize your perfect journey.
          </p>
        </motion.section>

        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div className="bg-card rounded-2xl border border-border p-8 md:p-12">
            <h2 className="font-display text-3xl font-bold mb-6 text-center">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
              To build a user-centric, responsive application that simplifies the complexity of planning 
              multi-city travel. We provide travelers with intuitive tools to create personalized itineraries, 
              manage budgets automatically, visualize timelines, and share trip plans within a vibrant community—making 
              travel planning as exciting as the trip itself.
            </p>
          </div>
        </motion.section>

        {/* Features Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="font-display text-3xl font-bold text-center mb-12">
            What Makes Us Special
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Smart Planning</h3>
              <p className="text-muted-foreground">
                Add and manage travel stops with intelligent duration suggestions and budget tracking.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Visual Timeline</h3>
              <p className="text-muted-foreground">
                Visualize your entire journey with beautiful timelines and calendar views.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Budget Management</h3>
              <p className="text-muted-foreground">
                Automatically estimate trip budgets and track expenses in real-time.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Community Sharing</h3>
              <p className="text-muted-foreground">
                Share your travel plans and get inspired by fellow travelers' adventures.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Global Destinations</h3>
              <p className="text-muted-foreground">
                Explore cities and activities worldwide with detailed information and reviews.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Personalized Experience</h3>
              <p className="text-muted-foreground">
                Tailored recommendations based on your preferences and travel history.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Vision Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="bg-gradient-hero rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="font-display text-3xl font-bold mb-6">
              Our Vision
            </h2>
            <p className="text-lg text-white/90 max-w-4xl mx-auto leading-relaxed mb-8">
              To become the world's leading intelligent and collaborative travel planning solution that 
              enables millions of travelers to explore global destinations, visualize journeys through 
              structured itineraries, make cost-effective decisions, and share travel plans within a 
              thriving community.
            </p>
            <Link to="/register">
              <Button variant="secondary" size="lg">
                Join Our Community
              </Button>
            </Link>
          </div>
        </motion.section>

        {/* Technology Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <h2 className="font-display text-3xl font-bold mb-6">
            Built with Modern Technology
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            GlobeTrotter is built using cutting-edge technologies to ensure a fast, reliable, 
            and beautiful experience across all devices.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="px-4 py-2 bg-card border border-border rounded-full">React</span>
            <span className="px-4 py-2 bg-card border border-border rounded-full">TypeScript</span>
            <span className="px-4 py-2 bg-card border border-border rounded-full">Node.js</span>
            <span className="px-4 py-2 bg-card border border-border rounded-full">PostgreSQL</span>
            <span className="px-4 py-2 bg-card border border-border rounded-full">Tailwind CSS</span>
            <span className="px-4 py-2 bg-card border border-border rounded-full">Framer Motion</span>
          </div>
        </motion.section>
      </div>
    </Layout>
  );
}