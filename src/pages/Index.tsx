import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Factory, Menu, X, Bell, Settings, LogOut } from "lucide-react";
import OrderForm from "@/components/OrderForm";
import ProductionCharts from "@/components/ProductionCharts";
import EODSummary, { type OrderRecord, type OrderStatus } from "@/components/EODSummary";
import OrderStatusTracker from "@/components/OrderStatusTracker";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const handleOrderPlaced = (order: OrderRecord) => {
    setOrders((prev) => [...prev, order]);
  };

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-accent/[0.04] blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/[0.02] blur-3xl" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Header */}
      <header className="gradient-header sticky top-0 z-50 shadow-lg">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center border border-white/25">
                <Factory className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold font-heading text-primary-foreground leading-tight tracking-wider">
                  Production Scheduler
                </h1>
                <p className="text-[10px] text-primary-foreground/60 hidden sm:block tracking-widest uppercase">
                  Manufacturing Planning & Control
                </p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {[
                { label: "Dashboard", path: "/" },
                { label: "Orders", path: "/orders" },
                { label: "Production", path: "#" },
                { label: "Inventory", path: "#" },
                { label: "Reports", path: "#" },
              ].map((item, i) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    i === 0
                      ? "bg-white/20 text-primary-foreground font-medium border border-white/25"
                      : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button className="relative p-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent" />
              </button>
              <Link to="/settings" className="p-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors hidden md:block">
                <Settings className="h-5 w-5" />
              </Link>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="p-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors" title="Logout">
                    <LogOut className="h-5 w-5" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to log out? You will need to sign in again to access the dashboard.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <button
                className="md:hidden p-2 text-primary-foreground"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border pb-3 px-4">
            {["Dashboard", "Orders", "Production", "Inventory", "Reports"].map((item) => (
              <button
                key={item}
                className="block w-full text-left px-3 py-2 text-sm text-primary-foreground/70 hover:text-primary-foreground"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <OrderForm onOrderPlaced={handleOrderPlaced} />
        <OrderStatusTracker orders={orders} onUpdateStatus={handleUpdateStatus} />
        <EODSummary orders={orders} />
        <ProductionCharts />

        {/* Footer */}
        <footer className="text-center py-6 text-xs text-muted-foreground border-t border-border">
          © 2025 Production Scheduling & Planning System — Mechanical Manufacturing Division
        </footer>
      </main>
    </div>
  );
};

export default Index;
