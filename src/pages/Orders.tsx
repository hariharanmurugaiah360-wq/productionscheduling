import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Factory, Bell, Settings, Menu, X,
  Search, FileText, Download, Filter, Eye,
  ChevronLeft, ChevronRight, Package, TrendingUp, Clock, CheckCircle,
  Pencil, Trash2, Save, AlertTriangle, Truck, CreditCard, Smartphone
} from "lucide-react";
import { type Order } from "@/data/orders";
import { getStoredOrders, updateOrder, deleteOrder } from "@/lib/ordersStore";
import { generateInvoicePDF } from "@/lib/generateInvoice";
import { products, GST_RATE } from "@/data/products";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

const Orders = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Order>>({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const ordersPerPage = 10;

  // Auto-recalculate total amount and delivery date when editing quantity or product
  const recalculate = useCallback((currentEdit: Partial<Order>, order: Order) => {
    const productName = currentEdit.product ?? order.product;
    const qty = currentEdit.quantity ?? order.quantity;
    const product = products.find((p) => p.name === productName);
    if (!product) return currentEdit;

    const subtotal = product.mrp * qty;
    const deliveryCharges = qty <= 50 ? 2500 : qty <= 200 ? 5000 : 10000;
    const gst = subtotal * GST_RATE;
    const totalAmount = subtotal + gst + deliveryCharges;

    const totalHours = product.machiningHoursPerUnit * qty;
    const manufacturingDays = Math.max(Math.ceil(totalHours / 8), product.manufacturingDays);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + manufacturingDays);
    const deliveryDate = minDate.toISOString().split("T")[0];

    return { ...currentEdit, totalAmount, deliveryDate };
  }, []);

  // Orders needing dispatch (delivery is tomorrow or today, not yet dispatched/delivered)
  const dispatchAlerts = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    const todayStr = new Date().toISOString().split("T")[0];
    return allOrders.filter((o) => {
      const deliveryStr = o.deliveryDate?.split("T")[0];
      return (
        (deliveryStr === tomorrowStr || deliveryStr === todayStr) &&
        o.status !== "dispatched" &&
        o.status !== "delivered"
      );
    });
  }, [allOrders]);

  useEffect(() => {
    setAllOrders(getStoredOrders());
  }, []);

  const filtered = allOrders.filter((o) => {
    const matchesSearch =
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / ordersPerPage);
  const paginatedOrders = filtered.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const stats = [
    {
      label: "Total Orders",
      value: allOrders.length,
      icon: Package,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "In Production",
      value: allOrders.filter((o) => o.status === "in-production").length,
      icon: Factory,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Pending",
      value: allOrders.filter((o) => o.status === "pending").length,
      icon: Clock,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "Delivered",
      value: allOrders.filter((o) => o.status === "delivered").length,
      icon: CheckCircle,
      color: "text-success",
      bg: "bg-success/10",
    },
  ];

  const totalRevenue = allOrders.reduce((s, o) => s + o.totalAmount, 0);

  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Orders", path: "/orders" },
    { label: "Production", path: "#" },
    { label: "Inventory", path: "#" },
    { label: "Reports", path: "#" },
  ];

  return (
    <div className="min-h-screen bg-background">
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
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    item.label === "Orders"
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

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border pb-3 px-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="block w-full text-left px-3 py-2 text-sm text-primary-foreground/70 hover:text-primary-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-heading text-foreground">Orders Management</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Track and manage all manufacturing orders
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total Revenue</p>
            <p className="text-xl font-bold text-primary font-heading">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="card-industrial p-4 flex items-center gap-3"
              >
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground font-heading">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dispatch Notifications */}
        {dispatchAlerts.length > 0 && (
          <div className="card-industrial border-warning/50 bg-warning/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="font-semibold text-sm">Dispatch Reminder — {dispatchAlerts.length} order(s) need dispatch today!</h3>
            </div>
            <div className="space-y-1">
              {dispatchAlerts.map((o) => (
                <div key={o.id} className="flex items-center justify-between text-sm bg-background/60 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-3">
                    <Truck className="h-4 w-4 text-warning" />
                    <span className="font-mono text-xs text-primary font-semibold">{o.id}</span>
                    <span className="text-foreground font-medium">{o.customerName}</span>
                    <span className="text-muted-foreground">— {o.product}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Delivery: {new Date(o.deliveryDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </span>
                    <span className={`badge-status text-xs ${statusStyles[o.status]}`}>
                      {statusLabels[o.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="card-industrial p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                className="input-industrial w-full pl-9"
                placeholder="Search by order ID, customer, product..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-muted-foreground" />
              {["all", "pending", "in-production", "quality-check", "dispatched", "delivered"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors font-medium ${
                      statusFilter === status
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-muted-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {status === "all" ? "All" : statusLabels[status]}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="card-industrial overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Order Details ({filtered.length} orders)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Product
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Order Date
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Delivery Date
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-primary">
                      {order.id}
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">
                      {order.customerName}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{order.product}</td>
                    <td className="py-3 px-4 text-right font-semibold text-foreground">
                      {order.quantity}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-foreground">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4 text-center text-xs text-muted-foreground">
                      {new Date(order.orderDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 text-center text-xs text-muted-foreground">
                      {new Date(order.deliveryDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`badge-status text-xs ${statusStyles[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {paginatedOrders.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-muted-foreground">
                      No orders found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Showing {(currentPage - 1) * ordersPerPage + 1}–
                {Math.min(currentPage * ordersPerPage, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="h-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(i + 1)}
                    className="h-8 w-8 p-0"
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="h-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="card-industrial max-w-lg w-full p-6 space-y-4 animate-fade-in max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-heading text-foreground">
                  {isEditing ? "Edit Order" : "Order Details"}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => { setSelectedOrder(null); setIsEditing(false); }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm font-semibold text-primary">
                    {selectedOrder.id}
                  </span>
                  {isEditing ? (
                    <select
                      className="input-industrial text-xs px-2 py-1"
                      value={editData.status || selectedOrder.status}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value as Order["status"] })}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-production">In Production</option>
                      <option value="quality-check">QC Check</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  ) : (
                    <span className={`badge-status text-xs ${statusStyles[selectedOrder.status]}`}>
                      {statusLabels[selectedOrder.status]}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Customer</p>
                    {isEditing ? (
                      <input
                        className="input-industrial w-full text-sm"
                        value={editData.customerName ?? selectedOrder.customerName}
                        onChange={(e) => setEditData({ ...editData, customerName: e.target.value })}
                      />
                    ) : (
                      <p className="font-medium text-foreground">{selectedOrder.customerName}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    {isEditing ? (
                      <input
                        type="email"
                        className="input-industrial w-full text-sm"
                        value={editData.email ?? selectedOrder.email ?? ""}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      />
                    ) : (
                      <p className="font-medium text-foreground">{selectedOrder.email || "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    {isEditing ? (
                      <input
                        className="input-industrial w-full text-sm"
                        value={editData.phone ?? selectedOrder.phone ?? ""}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      />
                    ) : (
                      <p className="font-medium text-foreground">{selectedOrder.phone || "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Address</p>
                    {isEditing ? (
                      <input
                        className="input-industrial w-full text-sm"
                        value={editData.address ?? selectedOrder.address ?? ""}
                        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      />
                    ) : (
                      <p className="font-medium text-foreground">{selectedOrder.address || "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Pincode</p>
                    {isEditing ? (
                      <input
                        className="input-industrial w-full text-sm"
                        value={editData.pincode ?? selectedOrder.pincode ?? ""}
                        onChange={(e) => setEditData({ ...editData, pincode: e.target.value })}
                      />
                    ) : (
                      <p className="font-medium text-foreground">{selectedOrder.pincode || "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Product</p>
                    {isEditing ? (
                      <select
                        className="input-industrial w-full text-sm"
                        value={editData.product ?? selectedOrder.product}
                        onChange={(e) => {
                          const updated = { ...editData, product: e.target.value };
                          setEditData(recalculate(updated, selectedOrder));
                        }}
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="font-medium text-foreground">{selectedOrder.product}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Quantity</p>
                    {isEditing ? (
                      <input
                        type="number"
                        min={1}
                        className="input-industrial w-full text-sm"
                        value={editData.quantity ?? selectedOrder.quantity}
                        onChange={(e) => {
                          const updated = { ...editData, quantity: Number(e.target.value) || 1 };
                          setEditData(recalculate(updated, selectedOrder));
                        }}
                      />
                    ) : (
                      <p className="font-semibold text-foreground">{selectedOrder.quantity} units</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Amount</p>
                    <p className="font-semibold text-primary">
                      ₹{(editData.totalAmount ?? selectedOrder.totalAmount).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Order Date</p>
                    <p className="text-foreground">
                      {new Date(selectedOrder.orderDate).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "long", year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Expected Delivery {isEditing && <span className="text-primary">(auto)</span>}</p>
                    <p className={`text-foreground ${isEditing ? "font-semibold text-primary" : ""}`}>
                      {new Date(editData.deliveryDate ?? selectedOrder.deliveryDate).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "long", year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payment Method</p>
                    {isEditing ? (
                      <select
                        className="input-industrial w-full text-sm"
                        value={editData.paymentMethod ?? selectedOrder.paymentMethod ?? "cash"}
                        onChange={(e) => setEditData({ ...editData, paymentMethod: e.target.value as Order["paymentMethod"] })}
                      >
                        <option value="cash">Cash</option>
                        <option value="bank-transfer">Bank Transfer</option>
                        <option value="upi">UPI</option>
                        <option value="cheque">Cheque</option>
                      </select>
                    ) : (
                      <p className="font-medium text-foreground flex items-center gap-1">
                        {(selectedOrder.paymentMethod ?? "cash") === "upi" ? <Smartphone className="h-3 w-3" /> : <CreditCard className="h-3 w-3" />}
                        {({ cash: "Cash", "bank-transfer": "Bank Transfer", upi: "UPI", cheque: "Cheque" })[selectedOrder.paymentMethod ?? "cash"]}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payment Details</p>
                    {(() => {
                      const pm = editData.paymentMethod ?? selectedOrder.paymentMethod ?? "cash";
                      if (pm === "upi") {
                        return isEditing ? (
                          <input
                            className="input-industrial w-full text-sm"
                            value={editData.upiTransactionId ?? selectedOrder.upiTransactionId ?? ""}
                            onChange={(e) => setEditData({ ...editData, upiTransactionId: e.target.value })}
                            placeholder="UPI Transaction ID"
                          />
                        ) : (
                          <p className="font-mono text-sm text-foreground">Txn: {selectedOrder.upiTransactionId || "Not provided"}</p>
                        );
                      }
                      if (pm === "bank-transfer") {
                        return isEditing ? (
                          <input
                            className="input-industrial w-full text-sm"
                            value={editData.bankTransferUTR ?? selectedOrder.bankTransferUTR ?? ""}
                            onChange={(e) => setEditData({ ...editData, bankTransferUTR: e.target.value })}
                            placeholder="URL Number"
                          />
                        ) : (
                          <p className="font-mono text-sm text-foreground">UTR: {selectedOrder.bankTransferUTR || "Not provided"}</p>
                        );
                      }
                      if (pm === "cheque") {
                        return isEditing ? (
                          <input
                            className="input-industrial w-full text-sm"
                            value={editData.chequeNumber ?? selectedOrder.chequeNumber ?? ""}
                            onChange={(e) => setEditData({ ...editData, chequeNumber: e.target.value })}
                            placeholder="Cheque Number"
                          />
                        ) : (
                          <p className="font-mono text-sm text-foreground">Cheque: {selectedOrder.chequeNumber || "Not provided"}</p>
                        );
                      }
                      return (
                        <p className="text-foreground">
                          {Math.max(0, Math.ceil((new Date(editData.deliveryDate ?? selectedOrder.deliveryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days remaining
                        </p>
                      );
                    })()}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteConfirmOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const order = selectedOrder;
                      const product = products.find((p) => p.name === (editData.product ?? order.product));
                      if (!product) {
                        toast.error("Product not found");
                        return;
                      }
                      const qty = editData.quantity ?? order.quantity;
                      const subtotal = product.mrp * qty;
                      const gst = subtotal * GST_RATE;
                      const deliveryCharges = qty <= 50 ? 2500 : qty <= 200 ? 5000 : 10000;
                      const total = editData.totalAmount ?? order.totalAmount;
                      const totalManufacturingCost = product.manufacturingCost * qty;
                      const profit = subtotal - totalManufacturingCost;
                      const totalHours = product.machiningHoursPerUnit * qty;
                      const mfgDays = Math.max(Math.ceil(totalHours / 8), product.manufacturingDays);

                      generateInvoicePDF({
                        customerName: editData.customerName ?? order.customerName,
                        email: editData.email ?? order.email ?? "",
                        phone: editData.phone ?? order.phone ?? "",
                        address: editData.address ?? order.address ?? "",
                        pincode: editData.pincode ?? order.pincode ?? "",
                        deliveryAddress: editData.deliveryAddress ?? order.deliveryAddress ?? "",
                        product,
                        quantity: qty,
                        deliveryDate: editData.deliveryDate ?? order.deliveryDate,
                        subtotal,
                        gst,
                        deliveryCharges,
                        total,
                        profit,
                        deliveryNeeded: order.deliveryNeeded ?? true,
                        manufacturingDays: mfgDays,
                        paymentMethod: editData.paymentMethod ?? order.paymentMethod ?? "cash",
                        upiTransactionId: editData.upiTransactionId ?? order.upiTransactionId,
                        bankTransferUTR: editData.bankTransferUTR ?? order.bankTransferUTR,
                        chequeNumber: editData.chequeNumber ?? order.chequeNumber,
                      });
                      toast.success("Invoice PDF downloaded!");
                    }}
                  >
                    <Download className="h-4 w-4 mr-1" /> Invoice
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => { setIsEditing(false); setEditData({}); }}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={() => {
                        updateOrder(selectedOrder.id, editData);
                        const refreshed = getStoredOrders();
                        setAllOrders(refreshed);
                        const updated = refreshed.find(o => o.id === selectedOrder.id);
                        if (updated) setSelectedOrder(updated);
                        setIsEditing(false);
                        setEditData({});
                        toast.success("Order updated successfully");
                      }}>
                        <Save className="h-4 w-4 mr-1" /> Save
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setSelectedOrder(null)}>
                        Close
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => { setIsEditing(true); setEditData({}); }}>
                        <Pencil className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Order?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete order <span className="font-semibold text-foreground">{selectedOrder?.id}</span>. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  if (selectedOrder) {
                    deleteOrder(selectedOrder.id);
                    setAllOrders(getStoredOrders());
                    setSelectedOrder(null);
                    setDeleteConfirmOpen(false);
                    toast.success("Order deleted successfully");
                  }
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <footer className="text-center py-6 text-xs text-muted-foreground border-t border-border">
          © 2025 Production Scheduling & Planning System — Mechanical Manufacturing Division
        </footer>
      </main>
    </div>
  );
};

export default Orders;
