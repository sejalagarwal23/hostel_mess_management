// src\componenets\admin\AdminManageUsers.tsx
import { useState , useEffect } from 'react';
// import { getAllUsers, User, mockAttendance, mockBills } from '@/lib/store';
import { User } from '@/lib/store';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, ArrowLeft, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

const SEMESTER_PRESET = 36500;

type View = 'list' | 'add' | 'detail';

const AdminManageUsers = () => {
  const [view, setView] = useState<View>('list');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

   const [formData, setFormData] = useState({
  name: "",
  rollNumber: "",
  password: "",
  phone: "",
  role: "student",
  hostelNumber: "",
  semester: 0
});

  useEffect(() => {
  const loadUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();
      console.log("Users from API:", data);
      setUsers(data);


    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  loadUsers();
}, []);

   const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
    u.role.includes(search.toLowerCase())
  );
const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: formData.name,
        rollNumber: formData.rollNumber,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
        hostelNumber: formData.hostelNumber,
        semester: formData.semester
      })
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error);
      return;
    }
    toast.success("User created successfully!");
    setFormData({
  name: "",
  rollNumber: "",
  password: "",
  phone: "",
  role: "student",
  hostelNumber: "",
  semester: 0
}); 
    setView("list");
    // reload users
    const usersRes = await fetch("http://localhost:5000/api/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const users = await usersRes.json();
    setUsers(users);
  } catch (err) {
    console.error(err);
    toast.error("Failed to create user");
  }
};

  if (view === 'detail' && selectedUser) {
    // const totalDeducted = mockBills.reduce((sum, b) => sum + b.totalAmount, 0);
    // const balance = SEMESTER_PRESET - totalDeducted;

    // // Get attendance summary
    // const allAttendance = Object.values(mockAttendance).flat();
    // const presentDays = allAttendance.filter(a => a.status === 'present').length;
    // const absentDays = allAttendance.filter(a => a.status === 'absent').length;
    // const leaveDays = allAttendance.filter(a => a.status === 'leave').length;

    const totalDeducted = 0;
const balance = SEMESTER_PRESET;

const presentDays = 0;
const absentDays = 0;
const leaveDays = 0;

    return (
      <div className="max-w-2xl">
        <button onClick={() => { setView('list'); setSelectedUser(null); }} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to list
        </button>
        <Card className="shadow-card mb-4">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <CardTitle>{selectedUser.name}</CardTitle>
                <Badge variant="secondary" className="mt-1 capitalize">{selectedUser.role}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Detail label="Roll Number / ID" value={selectedUser.rollNumber} />
            <Detail label="Phone" value={selectedUser.phone} />
            {selectedUser.hostelNumber && <Detail label="Hostel" value={selectedUser.hostelNumber} />}
            {selectedUser.semester && <Detail label="Semester" value={`Semester ${selectedUser.semester}`} />}
            {selectedUser.email && <Detail label="Email" value={selectedUser.email} />}
          </CardContent>
        </Card>

        {/* Financial & Attendance Summary (for students) */}
        {selectedUser.role === 'student' && (
          <>
            <Card className="shadow-card mb-4">
              <CardHeader>
                <CardTitle className="text-base">Financial Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Semester Preset</p>
                    <p className="text-lg font-bold text-foreground">₹{SEMESTER_PRESET.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Total Deducted</p>
                    <p className="text-lg font-bold text-foreground">₹{totalDeducted.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Balance</p>
                    <p className={`text-lg font-bold ${balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                      ₹{balance.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Attendance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-success/10">
                    <p className="text-xs text-muted-foreground">Present</p>
                    <p className="text-lg font-bold text-success">{presentDays}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-destructive/10">
                    <p className="text-xs text-muted-foreground">Absent</p>
                    <p className="text-lg font-bold text-destructive">{absentDays}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-leave/10">
                    <p className="text-xs text-muted-foreground">Leave</p>
                    <p className="text-lg font-bold text-leave">{leaveDays}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    );
  }

  if (view === 'add') {
    return (
      <div className="max-w-lg">
        <button onClick={() => setView('list')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to list
        </button>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><UserPlus className="w-5 h-5" /> Add New User</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input placeholder="Full name" required value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value }) } />
              </div>
              <div className="space-y-2">
                <Label>Roll Number / Username</Label>
                <Input placeholder="e.g. 124103001/ADMIN00X"  required value={formData.rollNumber} onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value }) } />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" placeholder="Set password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value }) } />
              </div>
              <div className="space-y-2">
                <Label>Mobile Number</Label>
                <Input placeholder="10-digit number" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value }) } />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Hostel Number (if student)</Label>
                <Input placeholder="e.g. H1" value={formData.hostelNumber} onChange={(e) => setFormData({ ...formData, hostelNumber: e.target.value }) } />
              </div>
              <div className="space-y-2">
                <Label>Semester (if student)</Label>
                <Input type="number" min={0} max={8} value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) }) } />
              </div>
              <Button type="submit" className="w-full gradient-primary text-primary-foreground">Create User</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-foreground">Manage Users</h1>
        <Button onClick={() => setView('add')} className="gradient-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Add User
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by roll number, name, or role..."
          className="pl-10"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        {filtered.map(u => (
          <Card
            key={u.id}
            className="shadow-card cursor-pointer hover:shadow-card-hover transition-shadow"
            onClick={() => { setSelectedUser(u); setView('detail'); }}
          >
            <CardContent className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {u.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.rollNumber}</p>
                </div>
              </div>
              <Badge variant="secondary" className="capitalize">{u.role}</Badge>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No users found.</p>
        )}
      </div>
    </div>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div className="p-3 rounded-lg bg-muted/50">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm font-medium text-foreground">{value}</p>
  </div>
);

export default AdminManageUsers;
