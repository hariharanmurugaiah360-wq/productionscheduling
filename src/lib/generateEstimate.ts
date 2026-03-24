import { jsPDF } from "jspdf";
import { type Product, MACHINING_RATE_PER_HOUR } from "@/data/products";

interface EstimateData {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  product: Product;
  quantity: number;
  subtotal: number;
  discountAmount: number;
  discountedSubtotal: number;
  gst: number;
  deliveryCharges: number;
  total: number;
  discount: number;
  deliveryNeeded: boolean;
  manufacturingDays: number;
}

export function generateEstimatePDF(data: EstimateData) {
  const doc = new jsPDF();
  const estId = `EST-${Date.now().toString(36).toUpperCase()}`;
  const estDate = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 15);
  const validUntilStr = validUntil.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  // Header bar
  doc.setFillColor(20, 80, 60);
  doc.rect(0, 0, 210, 38, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("PRODUCTION ESTIMATE", 14, 18);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Manufacturing Planning & Control System", 14, 26);
  doc.text(`Estimate #: ${estId}`, 14, 33);
  doc.text(`Date: ${estDate}`, 120, 33);
  doc.text(`Valid Until: ${validUntilStr}`, 150, 26);

  // Customer details
  doc.setTextColor(20, 80, 60);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Customer Details", 14, 50);
  doc.setDrawColor(20, 80, 60);
  doc.setLineWidth(0.5);
  doc.line(14, 53, 196, 53);

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const details = [
    ["Name:", data.customerName || "—"],
    ["Email:", data.email || "—"],
    ["Phone:", data.phone || "—"],
    ["Address:", data.address || "—"],
    ["Delivery:", data.deliveryNeeded ? "Required" : "Self Pickup"],
    ["Est. Mfg. Time:", `${data.manufacturingDays} working days`],
  ];
  details.forEach(([label, value], i) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 14, 61 + i * 7);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(value, 130);
    doc.text(lines[0], 55, 61 + i * 7);
  });

  // Product table
  let y = 61 + details.length * 7 + 6;
  doc.setTextColor(20, 80, 60);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Estimate Breakdown", 14, y);
  y += 3;
  doc.line(14, y, 196, y);
  y += 5;

  // Table header
  doc.setFillColor(235, 245, 240);
  doc.rect(14, y - 3, 182, 9, "F");
  doc.setFontSize(9);
  doc.setTextColor(20, 80, 60);
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

  // Totals
  y += 8;
  const labelX = 120;
  const valueX = 172;
  const totals = [
    ["Subtotal:", `Rs.${data.subtotal.toLocaleString("en-IN")}`],
    ...(data.discount > 0 ? [[`Discount (${data.discount}%):`, `- Rs.${data.discountAmount.toLocaleString("en-IN")}`]] : []),
    ["Taxable Amount:", `Rs.${data.discountedSubtotal.toLocaleString("en-IN")}`],
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
  doc.setDrawColor(20, 80, 60);
  doc.setLineWidth(0.5);
  doc.line(labelX, y, 196, y);
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(20, 80, 60);
  doc.text("Estimated Total:", labelX, y);
  doc.text(`Rs.${data.total.toLocaleString("en-IN")}`, valueX, y);

  // MRP Summary
  y += 14;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Manufacturing Summary", 14, y);
  y += 3;
  doc.line(14, y, 196, y);
  y += 8;

  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", "normal");

  const totalMachiningHours = data.product.machiningHoursPerUnit * data.quantity;
  const machiningCost = totalMachiningHours * MACHINING_RATE_PER_HOUR;

  const mrpItems = [
    ["Raw Materials:", data.product.rawMaterials.map(r => `${r.name}: ${r.perUnit * data.quantity} ${r.unit}`).join(", ")],
    ["Machining Hours:", `${totalMachiningHours} hrs`],
    ["Dimensions:", data.product.dimensions],
    ["Weight (per unit):", data.product.weight],
  ];
  mrpItems.forEach(([label, value], i) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 14, y + i * 7);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(value, 130);
    doc.text(lines[0], 55, y + i * 7);
  });

  // Disclaimer
  y += mrpItems.length * 7 + 10;
  doc.setFillColor(255, 250, 235);
  doc.rect(14, y - 4, 182, 16, "F");
  doc.setFontSize(8);
  doc.setTextColor(140, 100, 20);
  doc.setFont("helvetica", "italic");
  doc.text("Note: This is an estimate only, not a confirmed order. Prices may vary based on material", 18, y + 2);
  doc.text(`availability and market conditions. Valid until ${validUntilStr}.`, 18, y + 8);

  // Footer
  doc.setFillColor(235, 245, 240);
  doc.rect(0, 275, 210, 22, "F");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.setFont("helvetica", "normal");
  doc.text("This is a system-generated estimate from the Production Scheduling & Planning System.", 14, 283);
  doc.text("© 2025 Mechanical Manufacturing Division | All rights reserved", 14, 289);

  doc.save(`Estimate_${estId}.pdf`);
}
