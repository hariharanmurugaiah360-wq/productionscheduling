import { Package, TrendingUp, Users, Truck, Clock, IndianRupee } from "lucide-react";

const stats = [
  { label: "Active Orders", value: "24", change: "+12%", icon: Package, color: "text-primary" },
  { label: "Monthly Revenue", value: "₹48.5L", change: "+8.3%", icon: IndianRupee, color: "text-success" },
  { label: "Production Rate", value: "92%", change: "+3.1%", icon: TrendingUp, color: "text-accent" },
  { label: "On-Time Delivery", value: "96.5%", change: "+1.2%", icon: Truck, color: "text-primary" },
  { label: "Avg Lead Time", value: "18 days", change: "-2 days", icon: Clock, color: "text-warning" },
  { label: "Active Clients", value: "156", change: "+5", icon: Users, color: "text-accent" },
];

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="stat-card animate-slide-up"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-center justify-between mb-3">
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
            <span className="text-xs font-medium text-success">{stat.change}</span>
          </div>
          <p className="text-2xl font-bold font-heading text-foreground">{stat.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
