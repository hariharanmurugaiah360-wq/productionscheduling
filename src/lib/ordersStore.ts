import { type Order } from "@/data/orders";

const STORAGE_KEY = "production_orders";

export const getStoredOrders = (): Order[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveOrder = (order: Order): void => {
  const orders = getStoredOrders();
  orders.unshift(order);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
};

export const updateOrderStatus = (orderId: string, status: Order["status"]): void => {
  const orders = getStoredOrders();
  const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
