import { useState } from "react";
import { Search, FileText, Download } from "lucide-react";
import { sampleOrders } from "@/data/orders";
import { Button } from "@/components/ui/button";

const statusStyles: Record<string, string> = {
  pending: "bg-warning/15 text-warning",
  "in-production": "bg-primary/15 text-primary",
  "quality-check": "bg-accent/15 text-accent",
  dispatched: "bg-success/15 text-success",
  delivered: "bg-muted text-muted-foreground",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  "in-production": "In Production",
  "quality-check": "QC Check",
  dispatched: "Dispatched",
  delivered: "Delivered",
};

const OrderHistory = () => {
  const [search, setSearch] = useState("");

  const filtered = sampleOrders.filter(
    (o) =>
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card-industrial p-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Order History
        </h2>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="input-industrial w-full pl-9"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Order ID</th>
              <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer</th>
              <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product</th>
              <th className="text-right py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Qty</th>
              <th className="text-right py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
              <th className="text-center py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-center py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-3 font-mono text-xs font-semibold text-primary">{order.id}</td>
                <td className="py-3 px-3 font-medium text-foreground">{order.customerName}</td>
                <td className="py-3 px-3 text-muted-foreground">{order.product}</td>
                <td className="py-3 px-3 text-right font-semibold text-foreground">{order.quantity}</td>
                <td className="py-3 px-3 text-right font-semibold text-foreground">₹{order.totalAmount.toLocaleString("en-IN")}</td>
                <td className="py-3 px-3 text-center">
                  <span className={`badge-status ${statusStyles[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </td>
                <td className="py-3 px-3 text-center">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Download className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderHistory;
