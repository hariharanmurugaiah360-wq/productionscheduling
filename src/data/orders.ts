export interface Order {
  id: string;
  customerName: string;
  product: string;
  quantity: number;
  totalAmount: number;
  status: "pending" | "in-production" | "quality-check" | "dispatched" | "delivered";
  orderDate: string;
  deliveryDate: string;
}

export const sampleOrders: Order[] = [
  { id: "ORD-2024-001", customerName: "Tata Motors Ltd", product: "Pump Housing", quantity: 50, totalAmount: 501500, status: "dispatched", orderDate: "2024-12-15", deliveryDate: "2025-01-15" },
  { id: "ORD-2024-002", customerName: "L&T Engineering", product: "Gear Shaft", quantity: 120, totalAmount: 877680, status: "in-production", orderDate: "2025-01-02", deliveryDate: "2025-02-10" },
  { id: "ORD-2024-003", customerName: "Bharat Forge", product: "Flywheel Assembly", quantity: 30, totalAmount: 424800, status: "quality-check", orderDate: "2025-01-10", deliveryDate: "2025-02-20" },
  { id: "ORD-2024-004", customerName: "Mahindra & Mahindra", product: "Bearing Housing", quantity: 200, totalAmount: 1132800, status: "pending", orderDate: "2025-02-01", deliveryDate: "2025-03-15" },
  { id: "ORD-2024-005", customerName: "Ashok Leyland", product: "Pump Housing", quantity: 75, totalAmount: 752250, status: "delivered", orderDate: "2024-11-20", deliveryDate: "2024-12-25" },
];
