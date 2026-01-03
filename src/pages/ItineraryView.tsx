import { motion } from "framer-motion";
import { 
  ArrowDown, 
  DollarSign, 
  AlertTriangle,
  Plane,
  Hotel,
  Camera,
  Utensils,
  TrendingUp
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const tripData = {
  name: "European Adventure",
  totalBudget: 5000,
  spent: 3450,
  days: [
    {
      day: 1,
      date: "Jan 15",
      activities: [
        { id: "1", time: "08:00", name: "Flight to Paris", type: "transport", cost: 450 },
        { id: "2", time: "14:00", name: "Hotel Check-in", type: "lodging", cost: 0 },
        { id: "3", time: "16:00", name: "Eiffel Tower Visit", type: "activity", cost: 25 },
        { id: "4", time: "19:00", name: "Dinner at Le Marais", type: "food", cost: 65 },
      ],
      totalCost: 540,
    },
    {
      day: 2,
      date: "Jan 16",
      activities: [
        { id: "5", time: "09:00", name: "Louvre Museum", type: "activity", cost: 17 },
        { id: "6", time: "12:30", name: "Lunch at Café de Flore", type: "food", cost: 45 },
        { id: "7", time: "15:00", name: "Seine River Cruise", type: "activity", cost: 35 },
        { id: "8", time: "19:30", name: "Dinner at Montmartre", type: "food", cost: 75 },
      ],
      totalCost: 172,
    },
    {
      day: 3,
      date: "Jan 17",
      activities: [
        { id: "9", time: "08:00", name: "Train to Rome", type: "transport", cost: 120 },
        { id: "10", time: "14:00", name: "Hotel Check-in Rome", type: "lodging", cost: 180 },
        { id: "11", time: "16:00", name: "Colosseum Tour", type: "activity", cost: 45 },
        { id: "12", time: "20:00", name: "Dinner in Trastevere", type: "food", cost: 55 },
      ],
      totalCost: 400,
    },
  ],
};

const typeIcons = {
  transport: Plane,
  lodging: Hotel,
  activity: Camera,
  food: Utensils,
};

const typeColors = {
  transport: "bg-ocean/20 text-ocean",
  lodging: "bg-lavender/20 text-lavender",
  activity: "bg-primary/20 text-primary",
  food: "bg-amber/20 text-amber",
};

const expenseBreakdown = [
  { category: "Transport", amount: 850, percentage: 25, color: "bg-ocean" },
  { category: "Lodging", amount: 1200, percentage: 35, color: "bg-lavender" },
  { category: "Activities", amount: 650, percentage: 19, color: "bg-primary" },
  { category: "Food & Dining", amount: 750, percentage: 21, color: "bg-amber" },
];

export default function ItineraryView() {
  const budgetUsed = (tripData.spent / tripData.totalBudget) * 100;
  const isOverBudget = budgetUsed > 90;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            {tripData.name}
          </h1>
          <p className="text-muted-foreground">
            Day-by-day itinerary with expense tracking
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Itinerary Flow */}
          <div className="lg:col-span-2 space-y-8">
            {tripData.days.map((day, dayIndex) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: dayIndex * 0.1 }}
              >
                {/* Day Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-hero flex flex-col items-center justify-center shadow-glow">
                    <span className="text-xs text-primary-foreground/80">Day</span>
                    <span className="text-xl font-bold text-primary-foreground">{day.day}</span>
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-semibold">{day.date}</h2>
                    <p className="text-sm text-muted-foreground">
                      Daily total: <span className="text-primary font-medium">${day.totalCost}</span>
                    </p>
                  </div>
                </div>

                {/* Activities Flow */}
                <div className="relative pl-8 border-l-2 border-border ml-8 space-y-4">
                  {day.activities.map((activity, actIndex) => {
                    const Icon = typeIcons[activity.type as keyof typeof typeIcons];
                    const colorClass = typeColors[activity.type as keyof typeof typeColors];
                    
                    return (
                      <div key={activity.id} className="relative">
                        {/* Timeline dot */}
                        <div className="absolute -left-[25px] top-4 w-3 h-3 rounded-full bg-primary" />
                        
                        {/* Activity Card */}
                        <div className="flex gap-4 bg-card rounded-xl border border-border p-4 hover:border-primary/30 transition-colors">
                          <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-muted-foreground">{activity.time}</span>
                              <Badge variant="outline" className="text-xs">
                                {activity.type}
                              </Badge>
                            </div>
                            <h3 className="font-medium">{activity.name}</h3>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <p className="font-bold text-primary">${activity.cost}</p>
                          </div>
                        </div>

                        {/* Arrow connector */}
                        {actIndex < day.activities.length - 1 && (
                          <div className="flex justify-center py-2">
                            <ArrowDown className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Expense Sidebar */}
          <div className="space-y-6">
            {/* Budget Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-6 sticky top-24"
            >
              <h3 className="font-display text-lg font-semibold mb-4">Budget Overview</h3>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Spent</span>
                  <span className="font-bold">${tripData.spent.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="font-medium">${tripData.totalBudget.toLocaleString()}</span>
                </div>
                <Progress value={budgetUsed} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2">
                  {budgetUsed.toFixed(0)}% of budget used
                </p>
              </div>

              {isOverBudget && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">Approaching budget limit!</span>
                </div>
              )}

              {/* Expense Breakdown */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Expense Breakdown
                </h4>
                <div className="space-y-3">
                  {expenseBreakdown.map((item) => (
                    <div key={item.category}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{item.category}</span>
                        <span className="font-medium">${item.amount}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-500`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Average */}
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Daily Average</span>
                  <span className="text-xl font-bold gradient-text">
                    ${Math.round(tripData.spent / tripData.days.length)}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
