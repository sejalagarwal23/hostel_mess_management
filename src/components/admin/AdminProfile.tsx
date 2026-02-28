import { useState } from 'react';
import { User } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, Mail, Hash, ShieldCheck, Lock } from 'lucide-react';
import { toast } from 'sonner';

const AdminProfile = ({ user }: { user: User }) => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    toast.success('Password changed successfully!');
    setShowChangePassword(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-6">Admin Profile</h1>
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center text-2xl font-bold text-accent-foreground">
              {user.name.charAt(0)}
            </div>
            <div>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Administrator
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoRow icon={Hash} label="Employee ID" value={user.rollNumber} />
            <InfoRow icon={Phone} label="Mobile" value={user.phone} />
            <InfoRow icon={Mail} label="Email" value={user.email || '—'} />
          </div>

          <div className="mt-6">
            <Button variant="outline" onClick={() => setShowChangePassword(!showChangePassword)} className="gap-2">
              <Lock className="w-4 h-4" /> Change Password
            </Button>
            {showChangePassword && (
              <div className="mt-4 space-y-3 p-4 rounded-lg border border-border bg-muted/30">
                <div className="space-y-1">
                  <Label>Old Password</Label>
                  <Input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="Enter old password" />
                </div>
                <div className="space-y-1">
                  <Label>New Password</Label>
                  <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" />
                </div>
                <div className="space-y-1">
                  <Label>Confirm New Password</Label>
                  <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleChangePassword} className="gradient-primary text-primary-foreground">Update Password</Button>
                  <Button variant="ghost" onClick={() => setShowChangePassword(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
    <Icon className="w-4 h-4 text-muted-foreground" />
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  </div>
);

export default AdminProfile;
