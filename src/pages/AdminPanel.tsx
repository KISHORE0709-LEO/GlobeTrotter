import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  MapPin, 
  Activity, 
  TrendingUp,
  Eye,
  Edit2,
  Trash2,
  MoreVertical
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const stats = [
  { title: "Total Users", value: "12,458", icon: Users, trend: { value: 12, isPositive: true } },
  { title: "Popular Cities", value: "156", icon: MapPin, trend: { value: 8, isPositive: true } },
  { title: "Activities Booked", value: "8,234", icon: Activity, trend: { value: 15, isPositive: true } },
  { title: "Engagement Rate", value: "68%", icon: TrendingUp, trend: { value: 5, isPositive: true } },
];

const userGrowthData = [
  { month: "Jan", users: 4000 },
  { month: "Feb", users: 5200 },
  { month: "Mar", users: 6100 },
  { month: "Apr", users: 7800 },
  { month: "May", users: 9200 },
  { month: "Jun", users: 10500 },
  { month: "Jul", users: 12458 },
];

const cityPopularityData = [
  { name: "Paris", value: 35, color: "hsl(16, 80%, 60%)" },
  { name: "Tokyo", value: 25, color: "hsl(200, 60%, 45%)" },
  { name: "New York", value: 20, color: "hsl(38, 80%, 55%)" },
  { name: "Bali", value: 12, color: "hsl(180, 40%, 40%)" },
  { name: "Dubai", value: 8, color: "hsl(270, 40%, 60%)" },
];

const activityData = [
  { name: "Museums", bookings: 2400 },
  { name: "Tours", bookings: 1800 },
  { name: "Restaurants", bookings: 1600 },
  { name: "Adventures", bookings: 1200 },
  { name: "Shows", bookings: 800 },
];

const recentUsers = [
  { id: "1", name: "Sarah Johnson", email: "sarah@example.com", trips: 5, joined: "Jan 12, 2024" },
  { id: "2", name: "Mike Chen", email: "mike@example.com", trips: 3, joined: "Jan 11, 2024" },
  { id: "3", name: "Emma Wilson", email: "emma@example.com", trips: 7, joined: "Jan 10, 2024" },
  { id: "4", name: "David Park", email: "david@example.com", trips: 2, joined: "Jan 9, 2024" },
  { id: "5", name: "Lisa Brown", email: "lisa@example.com", trips: 4, joined: "Jan 8, 2024" },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Admin Panel
          </h1>
          <p className="text-muted-foreground">
            Monitor usage, popular destinations, and engagement trends
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.title} {...stat} delay={index} />
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Manage Users</TabsTrigger>
            <TabsTrigger value="cities">Popular Cities</TabsTrigger>
            <TabsTrigger value="activities">Popular Activities</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <h3 className="font-display text-lg font-semibold mb-4">User Growth</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
                      <XAxis dataKey="month" stroke="hsl(220, 10%, 55%)" />
                      <YAxis stroke="hsl(220, 10%, 55%)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(220, 18%, 10%)",
                          border: "1px solid hsl(220, 15%, 20%)",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="hsl(16, 80%, 60%)"
                        strokeWidth={3}
                        dot={{ fill: "hsl(16, 80%, 60%)" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* City Popularity Pie Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <h3 className="font-display text-lg font-semibold mb-4">City Popularity</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={cityPopularityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {cityPopularityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(220, 18%, 10%)",
                          border: "1px solid hsl(220, 15%, 20%)",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {cityPopularityData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-muted-foreground">
                          {item.name} ({item.value}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Activity Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <h3 className="font-display text-lg font-semibold mb-4">Activity Bookings</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
                    <XAxis dataKey="name" stroke="hsl(220, 10%, 55%)" />
                    <YAxis stroke="hsl(220, 10%, 55%)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(220, 18%, 10%)",
                        border: "1px solid hsl(220, 15%, 20%)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="bookings" fill="hsl(38, 80%, 55%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </TabsContent>

          {/* Manage Users Tab */}
          <TabsContent value="users">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border overflow-hidden"
            >
              <div className="p-4 border-b border-border">
                <h3 className="font-display text-lg font-semibold">Recent Users</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Trips</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Joined</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr key={user.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-medium">{user.name}</td>
                        <td className="p-4 text-muted-foreground">{user.email}</td>
                        <td className="p-4">
                          <Badge variant="secondary">{user.trips} trips</Badge>
                        </td>
                        <td className="p-4 text-muted-foreground">{user.joined}</td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit2 className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </TabsContent>

          {/* Popular Cities Tab */}
          <TabsContent value="cities">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <h3 className="font-display text-lg font-semibold mb-6">Top Destinations</h3>
              <div className="space-y-4">
                {cityPopularityData.map((city, index) => (
                  <div key={city.name} className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{city.name}</span>
                        <span className="text-sm text-muted-foreground">{city.value}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${city.value}%`, backgroundColor: city.color }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Popular Activities Tab */}
          <TabsContent value="activities">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <h3 className="font-display text-lg font-semibold mb-6">Top Activities</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
                    <XAxis type="number" stroke="hsl(220, 10%, 55%)" />
                    <YAxis dataKey="name" type="category" stroke="hsl(220, 10%, 55%)" width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(220, 18%, 10%)",
                        border: "1px solid hsl(220, 15%, 20%)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="bookings" fill="hsl(16, 80%, 60%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
