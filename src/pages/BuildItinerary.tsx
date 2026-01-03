import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, Reorder } from "framer-motion";
import { 
  Plus, 
  GripVertical, 
  MapPin, 
  Calendar, 
  DollarSign,
  Plane,
  Hotel,
  Camera,
  Utensils,
  Trash2,
  Save,
  ArrowRight
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ItinerarySection {
  id: string;
  type: "transport" | "lodging" | "activity" | "food";
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: string;
}

const sectionIcons = {
  transport: Plane,
  lodging: Hotel,
  activity: Camera,
  food: Utensils,
};

const sectionColors = {
  transport: "text-ocean",
  lodging: "text-lavender",
  activity: "text-primary",
  food: "text-amber",
};

const initialSections: ItinerarySection[] = [
  {
    id: "1",
    type: "transport",
    title: "Flight to Destination",
    description: "International flight with one layover",
    startDate: "",
    endDate: "",
    budget: "800",
  },
  {
    id: "2",
    type: "lodging",
    title: "Hotel Accommodation",
    description: "4-star hotel in city center",
    startDate: "",
    endDate: "",
    budget: "1200",
  },
  {
    id: "3",
    type: "activity",
    title: "City Tour & Sightseeing",
    description: "Guided tour of major landmarks",
    startDate: "",
    endDate: "",
    budget: "150",
  },
];

export default function BuildItinerary() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sections, setSections] = useState<ItinerarySection[]>(initialSections);

  const addSection = (type: ItinerarySection["type"]) => {
    const newSection: ItinerarySection = {
      id: Date.now().toString(),
      type,
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      budget: "",
    };
    setSections([...sections, newSection]);
    toast({
      title: "Section added",
      description: "Fill in the details for your new section.",
    });
  };

  const updateSection = (id: string, field: keyof ItinerarySection, value: string) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const deleteSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
    toast({
      title: "Section removed",
      description: "The section has been deleted.",
    });
  };

  const handleSave = () => {
    toast({
      title: "Itinerary saved!",
      description: "Your trip itinerary has been saved successfully.",
    });
    navigate("/trips");
  };

  const totalBudget = sections.reduce((sum, s) => sum + (parseFloat(s.budget) || 0), 0);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Build Your Itinerary
            </h1>
            <p className="text-muted-foreground">
              Drag sections to reorder • Add activities, transport, lodging
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-lg bg-card border border-border">
              <span className="text-sm text-muted-foreground">Est. Budget:</span>
              <span className="ml-2 font-bold text-primary">${totalBudget.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Itinerary Sections */}
        <Reorder.Group
          axis="y"
          values={sections}
          onReorder={setSections}
          className="space-y-4 mb-8"
        >
          {sections.map((section, index) => {
            const Icon = sectionIcons[section.type];
            const colorClass = sectionColors[section.type];
            
            return (
              <Reorder.Item
                key={section.id}
                value={section}
                className="cursor-grab active:cursor-grabbing"
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-xl border border-border p-6 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Drag Handle */}
                    <div className="flex-shrink-0 pt-2">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </div>

                    {/* Icon */}
                    <div className={`flex-shrink-0 p-3 rounded-lg bg-muted ${colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-4">
                      {/* Title & Description */}
                      <div className="grid grid-cols-1 gap-4">
                        <Input
                          placeholder="Section title (e.g., Flight to Paris)"
                          value={section.title}
                          onChange={(e) => updateSection(section.id, "title", e.target.value)}
                          className="bg-muted/50 font-medium"
                        />
                        <Textarea
                          placeholder="Description..."
                          value={section.description}
                          onChange={(e) => updateSection(section.id, "description", e.target.value)}
                          className="bg-muted/50 min-h-[60px] resize-none"
                        />
                      </div>

                      {/* Date Range & Budget */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Start Date</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="date"
                              value={section.startDate}
                              onChange={(e) => updateSection(section.id, "startDate", e.target.value)}
                              className="pl-10 bg-muted/50"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">End Date</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="date"
                              value={section.endDate}
                              onChange={(e) => updateSection(section.id, "endDate", e.target.value)}
                              className="pl-10 bg-muted/50"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Budget</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder="0"
                              value={section.budget}
                              onChange={(e) => updateSection(section.id, "budget", e.target.value)}
                              className="pl-10 bg-muted/50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteSection(section.id)}
                      className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>

        {/* Add Section Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          <Button
            variant="outline"
            onClick={() => addSection("transport")}
            className="gap-2"
          >
            <Plane className="h-4 w-4 text-ocean" />
            Add Transport
          </Button>
          <Button
            variant="outline"
            onClick={() => addSection("lodging")}
            className="gap-2"
          >
            <Hotel className="h-4 w-4 text-lavender" />
            Add Lodging
          </Button>
          <Button
            variant="outline"
            onClick={() => addSection("activity")}
            className="gap-2"
          >
            <Camera className="h-4 w-4 text-primary" />
            Add Activity
          </Button>
          <Button
            variant="outline"
            onClick={() => addSection("food")}
            className="gap-2"
          >
            <Utensils className="h-4 w-4 text-amber" />
            Add Food
          </Button>
        </motion.div>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button variant="hero" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Itinerary
          </Button>
        </div>
      </div>
    </Layout>
  );
}
