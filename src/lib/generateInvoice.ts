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
    doc.text(value, 55, 61 + i * 7);
  });

  // Product table header
  let y = 96;
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
  doc.text("Material", 70, y + 3);
  doc.text("Qty", 120, y + 3);
  doc.text("Unit Price", 138, y + 3);
  doc.text("Amount", 170, y + 3);
  y += 12;

  // Table row
  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", "normal");
  doc.text(data.product.name, 16, y);
  doc.text(data.product.material.substring(0, 22), 70, y);
  doc.text(String(data.quantity), 120, y);
  doc.text(`Rs.${data.product.mrp.toLocaleString("en-IN")}`, 138, y);
  doc.text(`Rs.${data.subtotal.toLocaleString("en-IN")}`, 170, y);
  y += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(14, y, 196, y);

  // Totals
  y += 10;
  const totals = [
    ["Subtotal:", `Rs.${data.subtotal.toLocaleString("en-IN")}`],
    ["GST (18%):", `Rs.${data.gst.toLocaleString("en-IN")}`],
    ["Total Amount:", `Rs.${data.total.toLocaleString("en-IN")}`],
  ];
  totals.forEach(([label, value], i) => {
    const isBold = i === 2;
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setFontSize(isBold ? 11 : 10);
    if (isBold) doc.setTextColor(30, 58, 95);
    else doc.setTextColor(60, 60, 60);
    doc.text(label, 138, y + i * 8);
    doc.text(value, 170, y + i * 8);
  });

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
