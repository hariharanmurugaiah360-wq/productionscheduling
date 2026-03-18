import { ClipboardList, Download, Package, IndianRupee, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";

export interface OrderRecord {
  id: string;
  customerName: string;
  product: string;
  quantity: number;
  total: number;
  timestamp: Date;
}

interface EODSummaryProps {
  orders: OrderRecord[];
}

const EODSummary = ({ orders }: EODSummaryProps) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalUnits = orders.reduce((sum, o) => sum + o.quantity, 0);
  const uniqueCustomers = new Set(orders.map((o) => o.customerName)).size;
  const uniqueProducts = new Set(orders.map((o) => o.product)).size;
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const stats = [
    { label: "Orders Placed", value: orders.length, icon: ClipboardList, color: "text-primary" },
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-success" },
    { label: "Units Ordered", value: totalUnits, icon: Package, color: "text-accent" },
    { label: "Unique Customers", value: uniqueCustomers, icon: Users, color: "text-primary" },
  ];

  const downloadEODPdf = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

    // Header
    doc.setFillColor(30, 58, 95);
    doc.rect(0, 0, 210, 34, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("END OF DAY SUMMARY REPORT", 14, 16);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Report Date: ${date}`, 14, 24);
    doc.text("Production Scheduling & Planning System", 14, 30);

    // Stats
    let y = 46;
    doc.setTextColor(30, 58, 95);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Daily Overview", 14, y);
    y += 3;
    doc.setDrawColor(30, 58, 95);
    doc.setLineWidth(0.5);
    doc.line(14, y, 196, y);
    y += 8;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const summaryItems = [
      ["Total Orders:", String(orders.length)],
      ["Total Revenue:", `Rs.${totalRevenue.toLocaleString("en-IN")}`],
      ["Total Units Ordered:", String(totalUnits)],
      ["Unique Customers:", String(uniqueCustomers)],
      ["Products Ordered:", String(uniqueProducts)],
    ];
    summaryItems.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 14, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 70, y);
      y += 7;
    });

    // Orders table
    y += 6;
    doc.setTextColor(30, 58, 95);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Order Details", 14, y);
    y += 3;
    doc.line(14, y, 196, y);
    y += 5;

    // Table header
    doc.setFillColor(240, 244, 248);
    doc.rect(14, y - 3, 182, 9, "F");
    doc.setFontSize(8);
    doc.setTextColor(30, 58, 95);
    doc.text("ORDER ID", 16, y + 3);
    doc.text("CUSTOMER", 48, y + 3);
    doc.text("PRODUCT", 95, y + 3);
    doc.text("QTY", 140, y + 3);
    doc.text("AMOUNT", 158, y + 3);
    doc.text("TIME", 183, y + 3);
    y += 12;

    doc.setTextColor(60, 60, 60);
    doc.setFont("helvetica", "normal");
    orders.forEach((order) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(order.id, 16, y);
      doc.text(order.customerName.substring(0, 20), 48, y);
      doc.text(order.product.substring(0, 20), 95, y);
      doc.text(String(order.quantity), 140, y);
      doc.text(`Rs.${order.total.toLocaleString("en-IN")}`, 158, y);
      doc.text(
        order.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        183,
        y
      );
      y += 7;
      doc.setDrawColor(220, 220, 220);
      doc.line(14, y - 2, 196, y - 2);
    });

    // Footer
    doc.setFillColor(240, 244, 248);
    doc.rect(0, 275, 210, 22, "F");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("End of Day Summary — Production Scheduling & Planning System", 14, 283);
    doc.text("© 2025 Mechanical Manufacturing Division | All rights reserved", 14, 289);

    doc.save(`EOD_Report_${date.replace(/ /g, "_")}.pdf`);
  };

  if (orders.length === 0) {
    return null;
  }

  return (
    <div className="card-industrial p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            End of Day Summary
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{today}</p>
        </div>
        <Button
          onClick={downloadEODPdf}
          className="gradient-industrial text-primary-foreground h-10 px-5 rounded-lg font-semibold gap-2"
        >
          <Download className="h-4 w-4" />
          Download EOD Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-muted/50 border border-border/50 p-4 text-center space-y-1"
          >
            <stat.icon className={`h-5 w-5 mx-auto ${stat.color}`} />
            <p className="text-2xl font-bold font-heading text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Order ID", "Customer", "Product", "Qty", "Amount", "Time"].map((h) => (
                <th
                  key={h}
                  className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-3 font-mono text-xs font-semibold text-primary">{order.id}</td>
                <td className="py-3 px-3 font-medium text-foreground">{order.customerName}</td>
                <td className="py-3 px-3 text-muted-foreground">{order.product}</td>
                <td className="py-3 px-3 font-semibold text-foreground">{order.quantity}</td>
                <td className="py-3 px-3 font-semibold text-foreground">₹{order.total.toLocaleString("en-IN")}</td>
                <td className="py-3 px-3 text-muted-foreground">
                  {order.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EODSummary;
