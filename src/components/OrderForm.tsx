import { useState, useMemo } from "react";
import { CalendarIcon, ShoppingCart, Truck, Clock, FileDown, CreditCard, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { products, GST_RATE } from "@/data/products";
import { generateInvoicePDF } from "@/lib/generateInvoice";
import { generateEstimatePDF } from "@/lib/generateEstimate";
import { saveOrder } from "@/lib/ordersStore";
import { toast } from "sonner";
import ProductPreview from "./ProductPreview";
import { type OrderRecord } from "./EODSummary";

interface OrderFormProps {
  onOrderPlaced?: (order: OrderRecord) => void;
}

const OrderForm = ({ onOrderPlaced }: OrderFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(products[0].id);
  const [quantity, setQuantity] = useState(10);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [discount, setDiscount] = useState(0);
  const [deliveryNeeded, setDeliveryNeeded] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank-transfer" | "upi" | "cheque">("cash");
  const [upiTransactionId, setUpiTransactionId] = useState("");

  const discountPresets = [0, 5, 10, 15, 20];

  const selectedProduct = products.find((p) => p.id === selectedProductId)!;

  // Calculate manufacturing days based on quantity and product
  const manufacturingDays = useMemo(() => {
    const totalHours = selectedProduct.machiningHoursPerUnit * quantity;
    const workingHoursPerDay = 8;
    const days = Math.ceil(totalHours / workingHoursPerDay);
    return Math.max(days, selectedProduct.manufacturingDays);
  }, [selectedProduct, quantity]);

  // Minimum delivery date = today + manufacturing days
  const minDeliveryDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + manufacturingDays);
    return date.toISOString().split("T")[0];
  }, [manufacturingDays]);

  const calculations = useMemo(() => {
    const subtotal = selectedProduct.mrp * quantity;
    const discountAmount = subtotal * (discount / 100);
    const discountedSubtotal = subtotal - discountAmount;
    const deliveryCharges = deliveryNeeded
      ? quantity <= 50 ? 2500 : quantity <= 200 ? 5000 : 10000
      : 0;
    const gst = discountedSubtotal * GST_RATE;
    const total = discountedSubtotal + gst + deliveryCharges;
    const totalManufacturingCost = selectedProduct.manufacturingCost * quantity;
    const profit = discountedSubtotal - totalManufacturingCost;
    const profitMargin = discountedSubtotal > 0 ? ((profit / discountedSubtotal) * 100).toFixed(1) : "0.0";
    return { subtotal, discountAmount, discountedSubtotal, gst, deliveryCharges, total, profit, profitMargin };
  }, [selectedProduct, quantity, discount, deliveryNeeded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deliveryDate < minDeliveryDate) {
      toast.error(`Delivery date must be after ${new Date(minDeliveryDate).toLocaleDateString("en-IN")} (${manufacturingDays} days needed for manufacturing)`);
      return;
    }
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    generateInvoicePDF({
      customerName: name,
      email,
      phone,
      address,
      pincode,
      deliveryAddress: deliveryNeeded ? deliveryAddress : "Self Pickup",
      product: selectedProduct,
      quantity,
      deliveryDate,
      subtotal: calculations.subtotal,
      gst: calculations.gst,
      deliveryCharges: calculations.deliveryCharges,
      total: calculations.total,
      profit: calculations.profit,
      deliveryNeeded,
      manufacturingDays,
    });
    const orderRecord = {
      id: orderId,
      customerName: name,
      email,
      phone,
      address,
      pincode,
      deliveryAddress: deliveryNeeded ? deliveryAddress : "Self Pickup",
      product: selectedProduct.name,
      quantity,
      totalAmount: calculations.total,
      status: "pending" as const,
      orderDate: new Date().toISOString().split("T")[0],
      deliveryDate: deliveryDate,
      deliveryNeeded,
      paymentMethod,
      upiTransactionId: paymentMethod === "upi" ? upiTransactionId : undefined,
    };
    saveOrder(orderRecord);
    onOrderPlaced?.({
      id: orderId,
      customerName: name,
      product: selectedProduct.name,
      quantity,
      total: calculations.total,
      timestamp: new Date(),
      status: "pending",
    });
    toast.success("Order placed! Invoice PDF downloaded.");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Form */}
        <div className="lg:col-span-2 card-industrial p-6">
          <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2 mb-6">
            <ShoppingCart className="h-5 w-5 text-primary" />
            New Customer Order
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Customer Name</label>
                <input
                  className="input-industrial w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tata Motors Ltd"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  className="input-industrial w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="procurement@company.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
                <input
                  className="input-industrial w-full"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">Customer Address</label>
                <textarea
                  className="input-industrial w-full min-h-[70px] resize-none"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Plot No. 12, Industrial Area, Phase-II, Pune"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Pincode</label>
                <input
                  className="input-industrial w-full"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="411026"
                  required
                />
              </div>
            </div>

            {/* Delivery Toggle */}
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4 border border-border/50">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Delivery Needed?</p>
                  <p className="text-xs text-muted-foreground">
                    {deliveryNeeded ? "We will deliver to your address" : "Self pickup from factory"}
                  </p>
                </div>
              </div>
              <Switch checked={deliveryNeeded} onCheckedChange={setDeliveryNeeded} />
            </div>

            {deliveryNeeded && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Delivery Address</label>
                <textarea
                  className="input-industrial w-full min-h-[70px] resize-none"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Warehouse B, MIDC Industrial Estate, Ranjangaon, Pune 412220"
                  required={deliveryNeeded}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Product</label>
                <select
                  className="input-industrial w-full"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ₹{p.mrp.toLocaleString("en-IN")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Quantity</label>
                <input
                  type="number"
                  min={1}
                  className="input-industrial w-full"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Delivery Date</label>
                <div className="relative">
                  <input
                    type="date"
                    className="input-industrial w-full"
                    value={deliveryDate}
                    min={minDeliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    required
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Manufacturing Time Info */}
            <div className="flex items-center gap-3 rounded-xl bg-primary/5 p-4 border border-primary/20">
              <Clock className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Manufacturing Time: <span className="text-primary font-bold">{manufacturingDays} days</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Earliest delivery: {new Date(minDeliveryDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  {" · "}{selectedProduct.machiningHoursPerUnit * quantity} total machining hours
                </p>
              </div>
            </div>

            {/* Discount Selector */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Discount</label>
              <div className="flex items-center gap-2 flex-wrap">
                {discountPresets.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDiscount(d)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                      discount === d && !discountPresets.every(p => p !== discount)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                    }`}
                  >
                    {d === 0 ? "None" : `${d}%`}
                  </button>
                ))}
                <div className="flex items-center gap-1.5 ml-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.5}
                    className="input-industrial w-24 text-center"
                    value={discount}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setDiscount(isNaN(val) ? 0 : Math.min(100, Math.max(0, val)));
                    }}
                    placeholder="Custom"
                  />
                  <span className="text-sm font-medium text-muted-foreground">%</span>
                </div>
              </div>
              {parseFloat(calculations.profitMargin) < 0 && (
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2">
                  <span className="text-destructive text-xs font-semibold">⚠ Warning:</span>
                  <span className="text-destructive text-xs">
                    Discount of {discount}% exceeds profit margin — this order will result in a loss of ₹{Math.abs(calculations.profit).toLocaleString("en-IN")}
                  </span>
                </div>
              )}
              {parseFloat(calculations.profitMargin) >= 0 && parseFloat(calculations.profitMargin) < 5 && discount > 0 && (
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-warning/10 border border-warning/30 px-3 py-2">
                  <span className="text-warning text-xs font-semibold">⚠ Low Margin:</span>
                  <span className="text-warning text-xs">
                    Profit margin is only {calculations.profitMargin}% — consider reducing the discount.
                  </span>
                </div>
              )}
            </div>

            {/* Pricing Summary */}
            <div className="rounded-xl bg-muted/50 p-5 space-y-3 border border-border/50">
              <h3 className="font-semibold font-heading text-foreground">Order Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Subtotal</p>
                  <p className="text-lg font-bold text-foreground">₹{calculations.subtotal.toLocaleString("en-IN")}</p>
                </div>
                {discount > 0 && (
                  <div>
                    <p className="text-muted-foreground">Discount ({discount}%)</p>
                    <p className="text-lg font-bold text-destructive">-₹{calculations.discountAmount.toLocaleString("en-IN")}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">GST (18%)</p>
                  <p className="text-lg font-bold text-foreground">₹{calculations.gst.toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Delivery</p>
                  <p className="text-lg font-bold text-foreground">₹{calculations.deliveryCharges.toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Amount</p>
                  <p className="text-lg font-bold text-primary">₹{calculations.total.toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Est. Profit</p>
                  <p className="text-lg font-bold text-success">₹{calculations.profit.toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Margin</p>
                  <p className="text-lg font-bold text-accent">{calculations.profitMargin}%</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="submit" className="w-full sm:w-auto gradient-industrial text-primary-foreground h-11 px-8 rounded-lg font-semibold">
                Place Order & Generate Invoice
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto h-11 px-6 rounded-lg font-semibold gap-2"
                onClick={() => {
                  generateEstimatePDF({
                    customerName: name,
                    email,
                    phone,
                    address,
                    product: selectedProduct,
                    quantity,
                    subtotal: calculations.subtotal,
                    discountAmount: calculations.discountAmount,
                    discountedSubtotal: calculations.discountedSubtotal,
                    gst: calculations.gst,
                    deliveryCharges: calculations.deliveryCharges,
                    total: calculations.total,
                    discount,
                    deliveryNeeded,
                    manufacturingDays,
                  });
                  toast.success("Estimate PDF downloaded!");
                }}
              >
                <FileDown className="h-4 w-4" />
                Download Estimate
              </Button>
            </div>
          </form>
        </div>

        {/* Product Preview */}
        <ProductPreview product={selectedProduct} />
      </div>

    </div>
  );
};

export default OrderForm;
