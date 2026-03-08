import { useEffect, useState } from "react";
import { fetchNotifications, Notification } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { format } from "date-fns";

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      const token = localStorage.getItem("token");
      const data = await fetchNotifications(token!);
      setNotifications(data);
    };

    loadNotifications();
  }, []);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-6">
        Notifications
      </h1>

      {notifications.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center">
            <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No notifications yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card key={n.id} className="shadow-card">
              <CardContent className="py-4">
                <p className="text-sm text-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {format(new Date(n.createdAt), "dd MMM yyyy, hh:mm a")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentNotifications;