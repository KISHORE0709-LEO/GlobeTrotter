import { motion } from "framer-motion";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-amber-900 text-white py-6 mt-12"
    >
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          © 2024 GlobeTrotter. Empowering Personalized Travel Planning.
        </p>
      </div>
    </motion.footer>
  );
}