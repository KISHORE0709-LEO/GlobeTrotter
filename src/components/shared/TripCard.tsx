import { motion } from "framer-motion";
import { Calendar, MapPin, DollarSign, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type TripStatus = "ongoing" | "upcoming" | "completed";

interface TripCardProps {
  id: string;
  title: string;
  destinations: string[];
  startDate: string;
  endDate: string;
  budget: number;
  status: TripStatus;
  coverImage?: string;
}

const statusConfig = {
  ongoing: { label: "Ongoing", className: "status-ongoing" },
  upcoming: { label: "Upcoming", className: "status-upcoming" },
  completed: { label: "Completed", className: "status-completed" },
};

export function TripCard({
  id,
  title,
  destinations,
  startDate,
  endDate,
  budget,
  status,
  coverImage,
}: TripCardProps) {
  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ x: 4 }}
      className="group"
    >
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 card-hover">
        {/* Cover Image */}
        {coverImage && (
          <div className="sm:w-32 h-24 sm:h-auto rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-display text-lg font-semibold truncate">{title}</h3>
            <Badge className={config.className}>{config.label}</Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="truncate">{destinations.join(" → ")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{startDate} - {endDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-primary" />
              <span>${budget.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="flex items-center sm:pl-4">
          <Link to={`/trips/${id}`}>
            <Button variant="ghost" size="sm" className="group-hover:text-primary">
              View
              <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
