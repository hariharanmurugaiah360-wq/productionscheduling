import { useState, useMemo } from "react";
import { CalendarIcon, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products, GST_RATE } from "@/data/products";
import { generateInvoicePDF } from "@/lib/generateInvoice";
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

  const discountPresets = [0, 5, 10, 15, 20];

  const selectedProduct = products.find((p) => p.id === selectedProductId)!;

  const calculations = useMemo(() => {
    const subtotal = selectedProduct.mrp * quantity;
    const discountAmount = subtotal * (discount / 100);
    const discountedSubtotal = subtotal - discountAmount;
    const deliveryCharges = quantity <= 50 ? 2500 : quantity <= 200 ? 5000 : 10000;
    const gst = discountedSubtotal * GST_RATE;
    const total = discountedSubtotal + gst + deliveryCharges;
    const totalManufacturingCost = selectedProduct.manufacturingCost * quantity;
    const profit = discountedSubtotal - totalManufacturingCost;
    const profitMargin = discountedSubtotal > 0 ? ((profit / discountedSubtotal) * 100).toFixed(1) : "0.0";
    return { subtotal, discountAmount, discountedSubtotal, gst, deliveryCharges, total, profit, profitMargin };
  }, [selectedProduct, quantity, discount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    generateInvoicePDF({
      customerName: name,
      email,
      phone,
      address,
      pincode,
      deliveryAddress,
      product: selectedProduct,
      quantity,
      deliveryDate,
      subtotal: calculations.subtotal,
      gst: calculations.gst,
      deliveryCharges: calculations.deliveryCharges,
      total: calculations.total,
      profit: calculations.profit,
    });
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

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Delivery Address</label>
              <textarea
                className="input-industrial w-full min-h-[70px] resize-none"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Warehouse B, MIDC Industrial Estate, Ranjangaon, Pune 412220"
                required
              />
            </div>

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
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    required
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Discount Selector */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Discount</label>
              <div className="flex gap-2">
                {discountPresets.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDiscount(d)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                      discount === d
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                    }`}
                  >
                    {d === 0 ? "None" : `${d}%`}
                  </button>
                ))}
              </div>
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

            <Button type="submit" className="w-full md:w-auto gradient-industrial text-primary-foreground h-11 px-8 rounded-lg font-semibold">
              Place Order & Generate Invoice
            </Button>
          </form>
        </div>

        {/* Product Preview */}
        <ProductPreview product={selectedProduct} />
      </div>

    </div>
  );
};

export default OrderForm;
