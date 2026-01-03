import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SearchBar } from "@/components/shared/SearchBar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";

const trips = [
  { id: "1", name: "Paris Trip", startDay: 15, endDay: 22, color: "bg-primary" },
  { id: "2", name: "Tokyo Adventure", startDay: 10, endDay: 20, color: "bg-ocean" },
  { id: "3", name: "NYC Getaway", startDay: 5, endDay: 8, color: "bg-amber" },
  { id: "4", name: "Bali Retreat", startDay: 25, endDay: 31, color: "bg-teal" },
];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0)); // January 2024
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  // Generate calendar grid
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Get trips for a specific day
  const getTripsForDay = (day: number) => {
    return trips.filter(trip => day >= trip.startDay && day <= trip.endDay);
  };

  return (
    <>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Calendar
            </h1>
            <p className="text-muted-foreground">
              View your trips and activities on a monthly calendar
            </p>
          </motion.div>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar placeholder="Search trips or activities..." />
          </div>

          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl border border-border overflow-hidden"
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <Button variant="ghost" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="font-display text-xl font-semibold">
                {months[month]} {year}
              </h2>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 border-b border-border">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="p-3 text-center text-sm font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => {
                const dayTrips = day ? getTripsForDay(day) : [];
                const isToday = day === 15 && month === 0; // Simulating today as Jan 15
                
                return (
                  <div
                    key={index}
                    className={`min-h-[100px] p-2 border-b border-r border-border last:border-r-0 ${
                      day ? 'hover:bg-muted/50 cursor-pointer transition-colors' : 'bg-muted/20'
                    }`}
                  >
                    {day && (
                      <>
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 text-sm rounded-full ${
                            isToday
                              ? 'bg-primary text-primary-foreground font-bold'
                              : 'text-foreground'
                          }`}
                        >
                          {day}
                        </span>
                        
                        {/* Trip Events */}
                        <div className="mt-1 space-y-1">
                          {dayTrips.map((trip) => (
                            <div
                              key={trip.id}
                              className={`${trip.color} text-primary-foreground text-xs px-2 py-1 rounded truncate`}
                            >
                              {trip.name}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 flex flex-wrap gap-4"
          >
            {trips.map((trip) => (
              <div key={trip.id} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${trip.color}`} />
                <span className="text-sm text-muted-foreground">{trip.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </Layout>
      <Footer />
    </>
  );
}
