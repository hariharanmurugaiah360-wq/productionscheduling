import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, BellRing, BellOff, CheckCheck, AlertTriangle, Clock, Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import {
  buildNotifications,
  getReadIds,
  markRead,
  isPushEnabled,
  pushPermission,
  pushSupported,
  requestPushPermission,
  setPushEnabled,
  pushUrgentNotifications,
  type AppNotification,
} from "@/lib/notificationsStore";

const severityIcon = {
  urgent: <AlertTriangle className="h-4 w-4 text-destructive" />,
  warning: <Clock className="h-4 w-4 text-accent" />,
  info: <Info className="h-4 w-4 text-muted-foreground" />,
};

const NotificationBell = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [read, setRead] = useState<string[]>([]);
  const [pushOn, setPushOn] = useState(false);

  const refresh = () => {
    const list = buildNotifications();
    setItems(list);
    setRead(getReadIds());
    setPushOn(isPushEnabled());
    pushUrgentNotifications(list);
  };

  useEffect(() => {
    refresh();
    const interval = window.setInterval(refresh, 60000);
    window.addEventListener("focus", refresh);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const unread = useMemo(() => items.filter((n) => !read.includes(n.id)), [items, read]);

  const handleTogglePush = async () => {
    if (!pushSupported()) {
      toast({ title: "Not supported", description: "This browser does not support notifications.", variant: "destructive" });
      return;
    }
    if (pushOn) {
      setPushEnabled(false);
      setPushOn(false);
      toast({ title: "Popups disabled", description: "You will still see alerts in this panel." });
      return;
    }
    if (pushPermission() === "denied") {
      toast({
        title: "Blocked by browser",
        description: "Allow notifications for this site in your browser settings, then try again.",
        variant: "destructive",
      });
      return;
    }
    const result = await requestPushPermission();
    if (result === "granted") {
      setPushOn(true);
      toast({ title: "Notifications enabled", description: "You will get popups for urgent dispatches." });
      pushUrgentNotifications(buildNotifications());
    } else {
      toast({ title: "Permission not granted", description: "Popups stay off; in-app alerts still work." });
    }
  };

  const handleMarkAll = () => {
    markRead(items.map((n) => n.id));
    setRead(getReadIds());
  };

  const openOrder = (n: AppNotification) => {
    markRead([n.id]);
    setRead(getReadIds());
    navigate("/orders");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative p-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
          aria-label={`Notifications${unread.length ? `, ${unread.length} unread` : ""}`}
        >
          {unread.length ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
          {unread.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
              {unread.length > 9 ? "9+" : unread.length}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[340px] p-0">
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <p className="text-sm font-semibold font-heading tracking-wide">Notifications</p>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" title={pushOn ? "Disable browser popups" : "Enable browser popups"} onClick={handleTogglePush}>
              {pushOn ? <BellRing className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" title="Mark all as read" onClick={handleMarkAll}>
              <CheckCheck className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {!pushOn && (
          <button onClick={handleTogglePush} className="w-full text-left px-3 py-2 text-[11px] bg-muted/50 hover:bg-muted border-b text-muted-foreground">
            Enable browser popups for overdue and due-today dispatches
          </button>
        )}

        <ScrollArea className="max-h-[320px]">
          {items.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">You are all caught up.</p>
          ) : (
            <ul className="divide-y">
              {items.map((n) => {
                const isRead = read.includes(n.id);
                return (
                  <li key={n.id}>
                    <button
                      onClick={() => openOrder(n)}
                      className={`w-full text-left px-3 py-2.5 flex gap-2 hover:bg-muted/50 transition-colors ${isRead ? "opacity-60" : ""}`}
                    >
                      <span className="mt-0.5">{severityIcon[n.severity]}</span>
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold text-foreground">{n.title}</span>
                        <span className="block text-[11px] text-muted-foreground">{n.message}</span>
                      </span>
                      {!isRead && <span className="ml-auto mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
