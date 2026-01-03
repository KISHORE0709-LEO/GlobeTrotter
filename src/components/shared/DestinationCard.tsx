import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";

interface DestinationCardProps {
  name: string;
  country: string;
  image: string;
  rating?: number;
  priceRange?: string;
  onClick?: () => void;
}

export function DestinationCard({
  name,
  country,
  image,
  rating = 4.5,
  priceRange = "$$",
  onClick,
}: DestinationCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Rating badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
          <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
          <span className="text-xs font-medium text-white">{rating}</span>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-display text-lg font-semibold text-white">{name}</h3>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1 text-gray-200 text-sm">
              <MapPin className="h-3 w-3" />
              {country}
            </div>
            <span className="text-xs text-amber-400 font-medium">{priceRange}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
