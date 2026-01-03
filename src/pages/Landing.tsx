import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Compass } from "lucide-react";
import GetStartedButton from "@/components/GetStartedButton";

const svgFiles = [
  "/src/assets/LANDING/1.svg", // India SVG (starting image)
  "/src/assets/LANDING/2.svg",
  "/src/assets/LANDING/3.svg",
  "/src/assets/LANDING/4.svg",
  "/src/assets/LANDING/5.svg",
  "/src/assets/LANDING/6.svg",
  "/src/assets/LANDING/7.svg"
];

export default function Landing() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % svgFiles.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section with SVG Slideshow */}
      <div className="h-screen w-full overflow-hidden relative">
        {/* SVG Slideshow */}
        <div className="flex w-full h-full">
          <motion.div
            className="flex h-full"
            animate={{ x: `-${currentIndex * 100}%` }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ width: `${svgFiles.length * 100}%` }}
          >
            {svgFiles.map((svg, index) => (
              <div key={index} className="w-full h-full flex-shrink-0 relative">
                <img 
                  src={svg}
                  alt={`Travel destination ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Get Started Button */}
        <GetStartedButton />
      </div>

      {/* Scroll-Down Content */}
      <div className="bg-white">
        {/* About Section */}
        <div className="max-w-6xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6 font-display">
              Your Journey Starts Here
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-body">
              Plan smarter, travel better. GlobeTrotter helps you create personalized itineraries, 
              manage budgets, and discover amazing destinations worldwide.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-display">Smart Planning</h3>
              <p className="text-gray-600">Build detailed itineraries with budget tracking and timeline visualization.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-display">Trip Organization</h3>
              <p className="text-gray-600">Manage multiple trips with calendar views and timeline planning.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-display">Travel Community</h3>
              <p className="text-gray-600">Share itineraries and get inspired by fellow travelers' adventures.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Compass className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-display">Explore More</h3>
              <p className="text-gray-600">Discover destinations and activities that match your travel style.</p>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-yellow-800 rounded-3xl p-12 shadow-2xl text-white">
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 font-display">GlobeTrotter</h3>
                  <p className="text-yellow-100">Empowering personalized travel planning for adventurers worldwide.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 font-display">Features</h4>
                  <ul className="space-y-2 text-yellow-100">
                    <li>Trip Planning</li>
                    <li>Budget Tracking</li>
                    <li>Calendar View</li>
                    <li>Community</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 font-display">Support</h4>
                  <ul className="space-y-2 text-yellow-100">
                    <li>Help Center</li>
                    <li>Contact Us</li>
                    <li>Travel Tips</li>
                    <li>FAQ</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 font-display">Connect</h4>
                  <ul className="space-y-2 text-yellow-100">
                    <li>Newsletter</li>
                    <li>Social Media</li>
                    <li>Travel Blog</li>
                    <li>Community</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-yellow-700 mt-8 pt-8 text-center text-yellow-100">
                <p>&copy; 2024 GlobeTrotter. Made with ❤️ for travelers.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}