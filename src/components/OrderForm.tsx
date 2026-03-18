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

  const selectedProduct = products.find((p) => p.id === selectedProductId)!;

  const calculations = useMemo(() => {
    const subtotal = selectedProduct.mrp * quantity;
    const gst = subtotal * GST_RATE;
    const total = subtotal + gst;
    const totalManufacturingCost = selectedProduct.manufacturingCost * quantity;
    const profit = subtotal - totalManufacturingCost;
    const profitMargin = ((profit / subtotal) * 100).toFixed(1);
    return { subtotal, gst, total, profit, profitMargin };
  }, [selectedProduct, quantity]);

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

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Customer Address</label>
              <textarea
                className="input-industrial w-full min-h-[70px] resize-none"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Plot No. 12, Industrial Area, Phase-II, Pune 411026"
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

            {/* Pricing Summary */}
            <div className="rounded-xl bg-muted/50 p-5 space-y-3 border border-border/50">
              <h3 className="font-semibold font-heading text-foreground">Order Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Subtotal</p>
                  <p className="text-lg font-bold text-foreground">₹{calculations.subtotal.toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">GST (18%)</p>
                  <p className="text-lg font-bold text-foreground">₹{calculations.gst.toLocaleString("en-IN")}</p>
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
