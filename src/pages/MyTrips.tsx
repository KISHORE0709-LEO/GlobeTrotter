import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SearchBar } from "@/components/shared/SearchBar";
import { TripCard } from "@/components/shared/TripCard";
import { Footer } from "@/components/shared/Footer";

import parisImage from "@/assets/destination-paris.jpg";
import tokyoImage from "@/assets/destination-tokyo.jpg";
import newyorkImage from "@/assets/destination-newyork.jpg";
import baliImage from "@/assets/destination-bali.jpg";
import dubaiImage from "@/assets/destination-dubai.jpg";

const trips = {
  ongoing: [
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
  ],
  upcoming: [
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
      title: "Bali Retreat",
      destinations: ["Ubud", "Seminyak", "Nusa Dua"],
      startDate: "Mar 5",
      endDate: "Mar 15",
      budget: 2500,
      status: "upcoming" as const,
      coverImage: baliImage,
    },
    {
      id: "4",
      title: "Dubai Luxury Escape",
      destinations: ["Dubai", "Abu Dhabi"],
      startDate: "Apr 1",
      endDate: "Apr 8",
      budget: 5200,
      status: "upcoming" as const,
      coverImage: dubaiImage,
    },
  ],
  completed: [
    {
      id: "5",
      title: "NYC Getaway",
      destinations: ["New York"],
      startDate: "Dec 20",
      endDate: "Dec 27",
      budget: 2200,
      status: "completed" as const,
      coverImage: newyorkImage,
    },
    {
      id: "6",
      title: "Mediterranean Cruise",
      destinations: ["Barcelona", "Marseille", "Rome"],
      startDate: "Nov 1",
      endDate: "Nov 14",
      budget: 3800,
      status: "completed" as const,
      coverImage: parisImage,
    },
  ],
};

const sections = [
  { key: "ongoing", title: "Ongoing", data: trips.ongoing },
  { key: "upcoming", title: "Upcoming", data: trips.upcoming },
  { key: "completed", title: "Completed", data: trips.completed },
];

export default function MyTrips() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            My Trips
          </h1>
          <p className="text-muted-foreground">
            View and manage all your travel plans
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-8">
          <SearchBar placeholder="Search your trips..." />
        </div>

        {/* Trip Sections */}
        <div className="space-y-10">
          {sections.map((section, sectionIndex) => (
            <motion.section
              key={section.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-3">
                <span>{section.title}</span>
                <span className="px-2 py-0.5 text-sm font-normal rounded-full bg-muted text-muted-foreground">
                  {section.data.length}
                </span>
              </h2>
              
              {section.data.length > 0 ? (
                <div className="space-y-3">
                  {section.data.map((trip) => (
                    <TripCard key={trip.id} {...trip} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 rounded-xl border border-dashed border-border">
                  <p className="text-muted-foreground">No {section.title.toLowerCase()} trips</p>
                </div>
              )}
            </motion.section>
          ))}
        </div>
      </div>
    </Layout>
  );
}
