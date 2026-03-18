import { useState } from "react";
import { 
  ClipboardCheck, Factory, SearchCheck, Truck, PackageCheck, Clock,
  ChevronDown, ChevronUp, MapPin
} from "lucide-react";
import { type OrderRecord, type OrderStatus } from "./EODSummary";
import { Button } from "@/components/ui/button";

interface OrderStatusTrackerProps {
  orders: OrderRecord[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

const STATUS_STEPS: { key: OrderStatus; label: string; icon: typeof Clock }[] = [
  { key: "pending", label: "Pending", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: ClipboardCheck },
  { key: "in-production", label: "In Production", icon: Factory },
  { key: "quality-check", label: "QC Check", icon: SearchCheck },
  { key: "dispatched", label: "Dispatched", icon: Truck },
  { key: "delivered", label: "Delivered", icon: PackageCheck },
];

const getStepIndex = (status: OrderStatus) =>
  STATUS_STEPS.findIndex((s) => s.key === status);

const OrderStatusTracker = ({ orders, onUpdateStatus }: OrderStatusTrackerProps) => {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  if (orders.length === 0) return null;

  return (
    <div className="card-industrial p-6 animate-fade-in">
      <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2 mb-6">
        <MapPin className="h-5 w-5 text-primary" />
        Order Status Tracking
      </h2>

      <div className="space-y-3">
        {orders.map((order) => {
          const currentStep = getStepIndex(order.status);
          const isExpanded = expandedOrder === order.id;

          return (
            <div
              key={order.id}
              className="rounded-xl border border-border/50 bg-muted/20 overflow-hidden transition-all"
            >
              {/* Order header row */}
              <button
                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/40 transition-colors text-left"
              >
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="font-mono text-xs font-semibold text-primary">{order.id}</span>
                  <span className="text-sm font-medium text-foreground">{order.customerName}</span>
                  <span className="text-sm text-muted-foreground">{order.product}</span>
                  <span className="text-xs text-muted-foreground">×{order.quantity}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`badge-status text-xs ${
                      currentStep >= 5
                        ? "bg-success/15 text-success"
                        : currentStep >= 3
                        ? "bg-accent/15 text-accent"
                        : "bg-primary/15 text-primary"
                    }`}
                  >
                    {STATUS_STEPS[currentStep].label}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Expanded progress view */}
              {isExpanded && (
                <div className="px-4 pb-5 pt-1">
                  {/* Progress bar */}
                  <div className="relative flex items-center justify-between mb-6">
                    {/* Background line */}
                    <div className="absolute top-5 left-[20px] right-[20px] h-[3px] bg-border rounded-full" />
                    {/* Active line */}
                    <div
                      className="absolute top-5 left-[20px] h-[3px] bg-primary rounded-full transition-all duration-500"
                      style={{
                        width: `calc(${(currentStep / (STATUS_STEPS.length - 1)) * 100}% - 40px * ${currentStep / (STATUS_STEPS.length - 1)})`,
                      }}
                    />

                    {STATUS_STEPS.map((step, i) => {
                      const StepIcon = step.icon;
                      const isCompleted = i <= currentStep;
                      const isCurrent = i === currentStep;

                      return (
                        <div key={step.key} className="relative z-10 flex flex-col items-center gap-1.5">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                              isCurrent
                                ? "bg-primary border-primary text-primary-foreground scale-110 shadow-md shadow-primary/30"
                                : isCompleted
                                ? "bg-primary/15 border-primary text-primary"
                                : "bg-muted border-border text-muted-foreground"
                            }`}
                          >
                            <StepIcon className="h-4 w-4" />
                          </div>
                          <span
                            className={`text-[10px] font-medium text-center leading-tight ${
                              isCurrent
                                ? "text-primary font-semibold"
                                : isCompleted
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      ₹{order.total.toLocaleString("en-IN")} •{" "}
                      {order.timestamp.toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <div className="flex gap-2">
                      {currentStep < STATUS_STEPS.length - 1 && (
                        <Button
                          size="sm"
                          onClick={() =>
                            onUpdateStatus(order.id, STATUS_STEPS[currentStep + 1].key)
                          }
                          className="gradient-industrial text-primary-foreground h-8 text-xs px-4 rounded-lg"
                        >
                          Move to {STATUS_STEPS[currentStep + 1].label}
                        </Button>
                      )}
                      {currentStep === STATUS_STEPS.length - 1 && (
                        <span className="text-xs font-semibold text-success flex items-center gap-1">
                          <PackageCheck className="h-3.5 w-3.5" /> Order Complete
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTracker;
