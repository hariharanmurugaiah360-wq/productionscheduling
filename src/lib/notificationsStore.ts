import { getStoredOrders } from "@/lib/ordersStore";
import { type Order } from "@/data/orders";

export type NotificationSeverity = "urgent" | "warning" | "info";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  orderId: string;
  createdAt: string;
}

const READ_KEY = "notifications_read";
const PUSH_KEY = "notifications_push_enabled";
const PUSHED_KEY = "notifications_pushed";

const dayDiff = (dateStr: string): number => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return NaN;
  const today = new Date();
  d.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86400000);
};

const statusLabel: Record<Order["status"], string> = {
  pending: "Pending",
  "in-production": "In Production",
  "quality-check": "QC Check",
  dispatched: "Dispatched",
  delivered: "Delivered",
};

/** Derives the current notification list from stored orders. */
export const buildNotifications = (): AppNotification[] => {
  const orders = getStoredOrders();
  const list: AppNotification[] = [];

  for (const o of orders) {
    const days = dayDiff(o.deliveryDate);
    const open = o.status !== "delivered" && o.status !== "dispatched";

    if (open && !isNaN(days)) {
      if (days < 0) {
        list.push({
          id: `${o.id}-overdue`,
          title: "Delivery overdue",
          message: `${o.id} for ${o.customerName} is ${Math.abs(days)} day(s) overdue (${statusLabel[o.status]}).`,
          severity: "urgent",
          orderId: o.id,
          createdAt: o.deliveryDate,
        });
      } else if (days <= 3) {
        list.push({
          id: `${o.id}-due-soon`,
          title: days === 0 ? "Dispatch due today" : "Dispatch due soon",
          message: `${o.id} for ${o.customerName} is due in ${days} day(s).`,
          severity: "warning",
          orderId: o.id,
          createdAt: o.deliveryDate,
        });
      }
    }

    if (o.status === "pending") {
      list.push({
        id: `${o.id}-pending`,
        title: "Order awaiting confirmation",
        message: `${o.id} (${o.product} x${o.quantity}) is still pending.`,
        severity: "info",
        orderId: o.id,
        createdAt: o.orderDate,
      });
    }

    if (o.status === "quality-check") {
      list.push({
        id: `${o.id}-qc`,
        title: "QC check pending",
        message: `${o.id} for ${o.customerName} is waiting on quality check.`,
        severity: "info",
        orderId: o.id,
        createdAt: o.orderDate,
      });
    }
  }

  const rank: Record<NotificationSeverity, number> = { urgent: 0, warning: 1, info: 2 };
  return list.sort((a, b) => rank[a.severity] - rank[b.severity]);
};

export const getReadIds = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(READ_KEY) || "[]");
  } catch {
    return [];
  }
};

export const markRead = (ids: string[]): void => {
  const merged = Array.from(new Set([...getReadIds(), ...ids]));
  localStorage.setItem(READ_KEY, JSON.stringify(merged));
};

export const clearRead = (): void => localStorage.removeItem(READ_KEY);

/* ---------- Browser push ---------- */

export const pushSupported = (): boolean => typeof window !== "undefined" && "Notification" in window;

export const pushPermission = (): NotificationPermission =>
  pushSupported() ? Notification.permission : "denied";

export const isPushEnabled = (): boolean =>
  localStorage.getItem(PUSH_KEY) === "true" && pushPermission() === "granted";

export const setPushEnabled = (enabled: boolean): void =>
  localStorage.setItem(PUSH_KEY, String(enabled));

export const requestPushPermission = async (): Promise<NotificationPermission> => {
  if (!pushSupported()) return "denied";
  const result = await Notification.requestPermission();
  setPushEnabled(result === "granted");
  return result;
};

const getPushedIds = (): string[] => {
  try {
    return JSON.parse(sessionStorage.getItem(PUSHED_KEY) || "[]");
  } catch {
    return [];
  }
};

/** Shows desktop popups for urgent/warning notifications not yet pushed this session. */
export const pushUrgentNotifications = (notifications: AppNotification[]): void => {
  if (!isPushEnabled()) return;
  const pushed = getPushedIds();
  const fresh = notifications.filter(
    (n) => n.severity !== "info" && !pushed.includes(n.id)
  );
  if (!fresh.length) return;

  for (const n of fresh.slice(0, 3)) {
    try {
      new Notification(n.title, { body: n.message, tag: n.id });
    } catch {
      /* ignore */
    }
  }
  sessionStorage.setItem(
    PUSHED_KEY,
    JSON.stringify([...pushed, ...fresh.map((n) => n.id)])
  );
};
