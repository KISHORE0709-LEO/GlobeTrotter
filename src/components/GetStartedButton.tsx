import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface GetStartedButtonProps {
  className?: string;
}

export default function GetStartedButton({ className = "" }: GetStartedButtonProps) {
  const navigate = useNavigate();

  return (
    <div className={`absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50 ${className}`}>
      <Button
        size="lg"
        onClick={() => navigate('/login')}
        className="bg-white hover:bg-gray-100 text-amber-800 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
      >
        Get Started
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}