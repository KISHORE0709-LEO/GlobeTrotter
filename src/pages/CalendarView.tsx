import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, X, Edit, Trash2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SearchBar } from "@/components/shared/SearchBar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Event {
  id: string;
  title: string;
  place?: string;
  description?: string;
  date: string;
  time?: string;
  color: string;
}

const eventColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500"
];

const daysOfWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
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

function formatDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function CalendarView() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth()));
  const [events, setEvents] = useState<Record<string, Event[]>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    place: "",
    description: "",
    time: "",
    color: eventColors[0]
  });
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const prevYear = () => {
    setCurrentDate(new Date(year - 1, month));
  };

  const nextYear = () => {
    setCurrentDate(new Date(year + 1, month));
  };

  const goToToday = () => {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth()));
  };

  const handleDateClick = (day: number) => {
    const dateKey = formatDateKey(year, month, day);
    setSelectedDate(dateKey);
    setIsEventDialogOpen(true);
    setEditingEvent(null);
    setEventForm({ title: "", place: "", description: "", time: "", color: eventColors[0] });
  };

  const handleEventClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      place: event.place || "",
      description: event.description || "",
      time: event.time || "",
      color: event.color
    });
    setSelectedDate(event.date);
    setIsEventDialogOpen(true);
  };

  const saveEvent = () => {
    if (!selectedDate || !eventForm.title.trim()) return;

    const newEvent: Event = {
      id: editingEvent?.id || Date.now().toString(),
      title: eventForm.title,
      place: eventForm.place,
      description: eventForm.description,
      date: selectedDate,
      time: eventForm.time,
      color: eventForm.color
    };

    setEvents(prev => {
      const updated = { ...prev };
      if (!updated[selectedDate]) {
        updated[selectedDate] = [];
      }
      
      if (editingEvent) {
        const index = updated[selectedDate].findIndex(e => e.id === editingEvent.id);
        if (index !== -1) {
          updated[selectedDate][index] = newEvent;
        }
      } else {
        updated[selectedDate].push(newEvent);
      }
      
      return updated;
    });

    setIsEventDialogOpen(false);
    setEditingEvent(null);
    setEventForm({ title: "", place: "", description: "", time: "", color: eventColors[0] });
  };

  const deleteEvent = () => {
    if (!editingEvent || !selectedDate) return;

    setEvents(prev => {
      const updated = { ...prev };
      if (updated[selectedDate]) {
        updated[selectedDate] = updated[selectedDate].filter(e => e.id !== editingEvent.id);
        if (updated[selectedDate].length === 0) {
          delete updated[selectedDate];
        }
      }
      return updated;
    });

    setIsEventDialogOpen(false);
    setEditingEvent(null);
  };

  // Generate calendar grid
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
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
  );
}
