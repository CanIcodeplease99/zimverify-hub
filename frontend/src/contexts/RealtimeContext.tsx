import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { toast } from "sonner";

export interface Notification {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  type: "customs" | "vehicle" | "police" | "verification" | "system";
  severity: "info" | "warning" | "error" | "success";
}

interface RealtimeContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
  clearAll: () => void;
  isConnected: boolean;
}

const RealtimeContext = createContext<RealtimeContextType>({
  notifications: [],
  unreadCount: 0,
  markAllRead: () => {},
  markRead: () => {},
  clearAll: () => {},
  isConnected: false,
});

export const useRealtime = () => useContext(RealtimeContext);

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

let notifCounter = 0;
function nextId() {
  return `notif-${Date.now()}-${++notifCounter}`;
}

export const RealtimeProvider = ({ children }: { children: ReactNode }) => {
  const { authMode, role, isAuthenticated } = useAuth();
  const isLive = authMode === "supabase" && isSupabaseConfigured;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const addNotification = useCallback((notif: Omit<Notification, "id" | "read">) => {
    const newNotif: Notification = { ...notif, id: nextId(), read: false };
    setNotifications(prev => [newNotif, ...prev].slice(0, 50));

    // Show toast based on severity
    if (notif.severity === "error") {
      toast.error(notif.title, { description: notif.desc });
    } else if (notif.severity === "warning") {
      toast.warning(notif.title, { description: notif.desc });
    } else if (notif.severity === "success") {
      toast.success(notif.title, { description: notif.desc });
    } else {
      toast.info(notif.title, { description: notif.desc });
    }
  }, []);

  // Handle customs_entries changes
  const handleCustomsChange = useCallback(
    (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
      const rec = payload.new as Record<string, unknown>;
      if (payload.eventType === "INSERT") {
        addNotification({
          title: "New Import Entry",
          desc: `${rec.make} ${rec.model} (${rec.vin}) — ${rec.port_of_entry}`,
          time: timeAgo(rec.created_at as string),
          type: "customs",
          severity: "info",
        });
      } else if (payload.eventType === "UPDATE") {
        addNotification({
          title: "Entry Updated",
          desc: `${rec.entry_number} status: ${rec.status}`,
          time: timeAgo(rec.created_at as string),
          type: "customs",
          severity: "info",
        });
      }
    },
    [addNotification]
  );

  // Handle vehicles changes
  const handleVehicleChange = useCallback(
    (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
      const rec = payload.new as Record<string, unknown>;
      if (payload.eventType === "INSERT") {
        addNotification({
          title: "New Vehicle Registered",
          desc: `${rec.make} ${rec.model} — ${rec.registration || rec.vin}`,
          time: timeAgo(rec.created_at as string),
          type: "vehicle",
          severity: "success",
        });
      } else if (payload.eventType === "UPDATE") {
        const isStolen = (rec.status as string) === "stolen";
        if (isStolen) {
          addNotification({
            title: "STOLEN VEHICLE ALERT",
            desc: `${rec.make} ${rec.model} (${rec.vin}) flagged as stolen`,
            time: timeAgo(rec.created_at as string),
            type: "vehicle",
            severity: "error",
          });
        } else {
          addNotification({
            title: "Vehicle Status Updated",
            desc: `${rec.make} ${rec.model} — ${rec.status}`,
            time: timeAgo(rec.created_at as string),
            type: "vehicle",
            severity: "info",
          });
        }
      }
    },
    [addNotification]
  );

  // Handle verification_logs changes
  const handleVerificationChange = useCallback(
    (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
      const rec = payload.new as Record<string, unknown>;
      if (payload.eventType === "INSERT") {
        const searchType = rec.search_type === "interpol_check" ? "Interpol" : "National DB";
        const found = rec.result_found as boolean;
        addNotification({
          title: `${searchType} Check`,
          desc: `Query: ${rec.search_query} — ${found ? "Match found" : "No match"}`,
          time: timeAgo(rec.created_at as string),
          type: "verification",
          severity: found && rec.search_type === "interpol_check" ? "warning" : "info",
        });
      }
    },
    [addNotification]
  );

  // Handle police_cases changes
  const handlePoliceChange = useCallback(
    (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
      const rec = payload.new as Record<string, unknown>;
      if (payload.eventType === "INSERT") {
        addNotification({
          title: "New Police Case",
          desc: `Plate: ${rec.plate} — ${rec.event || rec.status}`,
          time: timeAgo(rec.created_at as string),
          type: "police",
          severity: rec.status === "Flagged" ? "warning" : "info",
        });
      } else if (payload.eventType === "UPDATE") {
        addNotification({
          title: "Case Updated",
          desc: `Plate: ${rec.plate} — ${rec.status}`,
          time: timeAgo(rec.created_at as string),
          type: "police",
          severity: rec.status === "Escalated" ? "warning" : "info",
        });
      }
    },
    [addNotification]
  );

  useEffect(() => {
    if (!isLive || !isAuthenticated) {
      setIsConnected(false);
      return;
    }

    const channels: RealtimeChannel[] = [];

    // Subscribe based on role
    const shouldListenCustoms = ["CUSTOMS_OFFICER", "GOV_ADMIN", "POLICE_OFFICER", "POLICE_SUPERVISOR"].includes(role);
    const shouldListenVehicles = true; // all roles
    const shouldListenVerification = ["POLICE_OFFICER", "POLICE_SUPERVISOR", "GOV_ADMIN"].includes(role);
    const shouldListenPolice = ["POLICE_OFFICER", "POLICE_SUPERVISOR", "GOV_ADMIN"].includes(role);

    if (shouldListenCustoms) {
      const ch = supabase
        .channel("customs-changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "customs_entries" },
          handleCustomsChange
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") setIsConnected(true);
        });
      channels.push(ch);
    }

    if (shouldListenVehicles) {
      const ch = supabase
        .channel("vehicle-changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "vehicles" },
          handleVehicleChange
        )
        .subscribe();
      channels.push(ch);
    }

    if (shouldListenVerification) {
      const ch = supabase
        .channel("verification-changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "verification_logs" },
          handleVerificationChange
        )
        .subscribe();
      channels.push(ch);
    }

    if (shouldListenPolice) {
      const ch = supabase
        .channel("police-changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "police_cases" },
          handlePoliceChange
        )
        .subscribe();
      channels.push(ch);
    }

    // If no channels were created (e.g. demo), mark as connected anyway
    if (channels.length === 0) setIsConnected(true);

    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch));
      setIsConnected(false);
    };
  }, [
    isLive,
    isAuthenticated,
    role,
    handleCustomsChange,
    handleVehicleChange,
    handleVerificationChange,
    handlePoliceChange,
  ]);

  // Add demo notifications for demo mode
  useEffect(() => {
    if (authMode !== "demo" || !isAuthenticated) return;

    // Seed some mock notifications
    const demoNotifs: Notification[] = [
      {
        id: "demo-1",
        title: "Vehicle check complete",
        desc: "ABC 1234 ZW — Clear",
        time: "5 min ago",
        read: false,
        type: "verification",
        severity: "success",
      },
      {
        id: "demo-2",
        title: "Stolen vehicle alert",
        desc: "BMW 3 Series (WBADT43452G123456) flagged",
        time: "1 hr ago",
        read: false,
        type: "vehicle",
        severity: "error",
      },
      {
        id: "demo-3",
        title: "System update",
        desc: "Scheduled maintenance Apr 20, 02:00",
        time: "3 hrs ago",
        read: true,
        type: "system",
        severity: "info",
      },
    ];
    setNotifications(demoNotifs);
    setIsConnected(true);
  }, [authMode, isAuthenticated]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <RealtimeContext.Provider
      value={{ notifications, unreadCount, markAllRead, markRead, clearAll, isConnected }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};
