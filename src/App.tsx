import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatBot } from "@/components/ChatBot";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TrendingSites from "./pages/TrendingSites";
import PlanTrip from "./pages/PlanTrip";
import BuildItinerary from "./pages/BuildItinerary";
import MyTrips from "./pages/MyTrips";
import Profile from "./pages/Profile";
import SearchResults from "./pages/SearchResults";
import ItineraryView from "./pages/ItineraryView";
import Community from "./pages/Community";
import CalendarView from "./pages/CalendarView";
import AdminPanel from "./pages/AdminPanel";
import Settings from "./pages/Settings";
import Destinations from "./pages/Destinations";
import Attractions from "./pages/Attractions";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trending" element={<TrendingSites />} />
          <Route path="/plan-trip" element={<PlanTrip />} />
          <Route path="/itinerary/new" element={<BuildItinerary />} />
          <Route path="/itinerary/:id" element={<BuildItinerary />} />
          <Route path="/trips" element={<MyTrips />} />
          <Route path="/trips/:id" element={<ItineraryView />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/community" element={<Community />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/attractions" element={<Attractions />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatBot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
