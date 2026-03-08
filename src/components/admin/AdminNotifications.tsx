import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Send } from 'lucide-react';
import { sendNotification } from "@/lib/store";

const AdminNotifications = () => {
  const [message, setMessage] = useState('');

  const handleSend = async () => {
  if (!message.trim()) {
    toast.error("Please write a message");
    return;
  }

  const token = localStorage.getItem("token");

  const res = await sendNotification(message, token!);

  if (res.error) {
    toast.error(res.error);
  } else {
    toast.success("Notification sent to all students!");
    setMessage("");
  }
};

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-6">Notifications</h1>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Send className="w-5 h-5" /> Send Notification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              placeholder="Write your notification message here..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={5}
            />
          </div>
          <Button onClick={handleSend} className="w-full gradient-primary text-primary-foreground">
            <Send className="w-4 h-4 mr-2" />
            Send to All Students
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotifications;
