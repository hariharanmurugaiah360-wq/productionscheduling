import { jsPDF } from "jspdf";
import { type Product, MACHINING_RATE_PER_HOUR } from "@/data/products";

interface InvoiceData {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  pincode: string;
  deliveryAddress: string;
  product: Product;
  quantity: number;
  deliveryDate: string;
  subtotal: number;
  gst: number;
  deliveryCharges: number;
  total: number;
  profit: number;
}

export function generateInvoicePDF(data: InvoiceData) {
  const doc = new jsPDF();
  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
  const orderDate = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  // Header bar
  doc.setFillColor(30, 58, 95);
  doc.rect(0, 0, 210, 38, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("PRODUCTION ORDER INVOICE", 14, 18);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Manufacturing Planning & Control System", 14, 26);
  doc.text(`Invoice #: ${orderId}`, 14, 33);
  doc.text(`Date: ${orderDate}`, 150, 33);

  // Customer details
  doc.setTextColor(30, 58, 95);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Customer Details", 14, 50);

  doc.setDrawColor(30, 58, 95);
  doc.setLineWidth(0.5);
  doc.line(14, 53, 196, 53);

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const details = [
    ["Name:", data.customerName],
    ["Email:", data.email],
    ["Phone:", data.phone],
    ["Address:", data.address || "N/A"],
    ["Pincode:", data.pincode || "N/A"],
    ["Delivery Addr:", data.deliveryAddress || "Same as above"],
    ["Delivery Date:", data.deliveryDate || "TBD"],
  ];
  details.forEach(([label, value], i) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 14, 61 + i * 7);
    doc.setFont("helvetica", "normal");
    // Wrap long text to avoid overflow
    const lines = doc.splitTextToSize(value, 130);
    doc.text(lines[0], 60, 61 + i * 7);
  });

  // Product table header
  let y = 61 + details.length * 7 + 6;
  doc.setTextColor(30, 58, 95);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Order Items", 14, y);
  y += 3;
  doc.line(14, y, 196, y);
  y += 5;

  // Table header
  doc.setFillColor(240, 244, 248);
  doc.rect(14, y - 3, 182, 9, "F");
  doc.setFontSize(9);
  doc.setTextColor(30, 58, 95);
  doc.text("Product", 16, y + 3);
  doc.text("Material", 68, y + 3);
  doc.text("Qty", 118, y + 3);
  doc.text("Unit Price", 136, y + 3);
  doc.text("Amount", 172, y + 3);
  y += 12;

  // Table row
  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", "normal");
  doc.text(data.product.name.substring(0, 25), 16, y);
  doc.text(data.product.material.substring(0, 22), 68, y);
  doc.text(String(data.quantity), 118, y);
  doc.text(`Rs.${data.product.mrp.toLocaleString("en-IN")}`, 136, y);
  doc.text(`Rs.${data.subtotal.toLocaleString("en-IN")}`, 172, y);
  y += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(14, y, 196, y);

  // Totals - right-aligned block
  y += 8;
  const labelX = 126;
  const valueX = 172;
  const totals = [
    ["Subtotal:", `Rs.${data.subtotal.toLocaleString("en-IN")}`],
    ["GST (18%):", `Rs.${data.gst.toLocaleString("en-IN")}`],
    ["Delivery Charges:", `Rs.${data.deliveryCharges.toLocaleString("en-IN")}`],
  ];
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  totals.forEach(([label, value], i) => {
    doc.setFont("helvetica", "normal");
    doc.text(label, labelX, y + i * 7);
    doc.text(value, valueX, y + i * 7);
  });
  y += totals.length * 7 + 2;
  doc.setDrawColor(30, 58, 95);
  doc.setLineWidth(0.5);
  doc.line(labelX, y, 196, y);
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 95);
  doc.text("Total Amount:", labelX, y);
  doc.text(`Rs.${data.total.toLocaleString("en-IN")}`, valueX, y);

  // MRP Summary
  y += 30;
  doc.setTextColor(30, 58, 95);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Manufacturing Summary (MRP)", 14, y);
  y += 3;
  doc.line(14, y, 196, y);
  y += 8;

  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", "normal");

  const totalMachiningHours = data.product.machiningHoursPerUnit * data.quantity;
  const machiningCost = totalMachiningHours * MACHINING_RATE_PER_HOUR;
  const totalLaborCost = data.product.laborCostPerUnit * data.quantity;

  const mrpItems = [
    ["Raw Materials:", data.product.rawMaterials.map(r => `${r.name}: ${r.perUnit * data.quantity} ${r.unit}`).join(", ")],
    ["Machining Hours:", `${totalMachiningHours} hrs (Rs.${machiningCost.toLocaleString("en-IN")})`],
    ["Labor Cost:", `Rs.${totalLaborCost.toLocaleString("en-IN")}`],
    ["Dimensions:", data.product.dimensions],
    ["Weight (per unit):", data.product.weight],
  ];
  mrpItems.forEach(([label, value], i) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 14, y + i * 7);
    doc.setFont("helvetica", "normal");
    doc.text(value, 55, y + i * 7);
  });

  // Footer
  doc.setFillColor(240, 244, 248);
  doc.rect(0, 275, 210, 22, "F");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text("This is a system-generated invoice from the Production Scheduling & Planning System.", 14, 283);
  doc.text("© 2025 Mechanical Manufacturing Division | All rights reserved", 14, 289);

  doc.save(`Invoice_${orderId}.pdf`);
}
