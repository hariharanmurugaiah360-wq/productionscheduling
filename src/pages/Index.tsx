import { useState } from "react";
import { Factory, Menu, X, Bell, Settings } from "lucide-react";
import OrderForm from "@/components/OrderForm";
import ProductionCharts from "@/components/ProductionCharts";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-header sticky top-0 z-50 shadow-lg">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                <Factory className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold font-heading text-primary leading-tight tracking-wider">
                  Production Scheduler
                </h1>
                <p className="text-[10px] text-muted-foreground hidden sm:block tracking-widest uppercase">
                  Manufacturing Planning & Control
                </p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {["Dashboard", "Orders", "Production", "Inventory", "Reports"].map((item, i) => (
                <button
                  key={item}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    i === 0
                      ? "bg-primary-foreground/20 text-primary-foreground font-medium"
                      : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button className="relative p-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
              </button>
              <button className="p-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors hidden md:block">
                <Settings className="h-5 w-5" />
              </button>
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
          <div className="md:hidden border-t border-primary-foreground/10 pb-3 px-4">
            {["Dashboard", "Orders", "Production", "Inventory", "Reports"].map((item) => (
              <button
                key={item}
                className="block w-full text-left px-3 py-2 text-sm text-primary-foreground/80 hover:text-primary-foreground"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <OrderForm />
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
