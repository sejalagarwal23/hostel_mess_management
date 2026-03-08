//src/components/admin/adminattendance.tsx

import {  useEffect, useState } from 'react';
import { fetchStudentsOnly } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { markAttendance } from "@/services/attendance";
import { CalendarDays } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
}

const AdminAttendance = () => {
 const [students, setStudents] = useState<Student[]>([]);

useEffect(() => {
  const loadStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await fetchStudentsOnly(token!);
      setStudents(data);
    } catch (err) {
      console.error("Failed to fetch students");
    }
  };

  loadStudents();
}, []);

useEffect(() => {
  const initialStatuses = Object.fromEntries(
    students.map(s => [s.id, "absent"])
  ) as Record<string, 'present' | 'absent' | 'leave'>;
  setStatuses(initialStatuses);
}, [students]);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [costPerDay, setCostPerDay] = useState('120');
const [statuses, setStatuses] = useState<Record<string, 'present' | 'absent' | 'leave'>>({});

  const toggleStatus = (id: string) => {
    setStatuses(prev => ({
      ...prev,
      [id]: prev[id] === 'present' ? 'absent' : prev[id] === 'absent' ? 'leave' : 'present',
    }));
  };

const markAllPresent = () => {
  setStatuses(prev => {
    const updated = { ...prev };

    students.forEach(student => {
      if (updated[student.id] != "leave") {
        updated[student.id] = "present";
      }
    });

    return updated;
  });
};

 const markAllAbsent = () => {
  setStatuses(prev => {
    const updated = { ...prev };

    students.forEach(student => {
      if (updated[student.id] != "leave") {
        updated[student.id] = "absent";
      }
    });

    return updated;
  });
};

const save = async () => {
  const token = localStorage.getItem("token");

  try {
    await Promise.all(
      Object.entries(statuses).map(([studentId, status]) =>
        markAttendance(studentId, date, status, token!)
      )
    );

    // 👇 trigger update across tabs
    localStorage.setItem("attendanceUpdated", Date.now().toString());

    toast.success("Attendance saved successfully");
  } catch (err) {
    console.log(err);
    toast.error("Failed to save attendance");
  }
};

  const generateBills = () => toast.success('Monthly bills generated for all students!');

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-6">Attendance Management</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="space-y-1">
          <Label>Date</Label>
          <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-44" />
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={markAllPresent}>Mark All Present</Button>
        <Button variant="outline" size="sm" onClick={markAllAbsent}>Mark All Absent</Button>
      </div>

      <Card className="shadow-card mb-6">
        <CardContent className="py-2">
          {students.map(s => (
            <div key={s.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {s.name?.charAt(0) || "?"}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{s.name || "Unknown"}</p>
                  <p className="text-xs text-muted-foreground">{s.rollNumber}</p>
                </div>
              </div>
             <button
  onClick={() => toggleStatus(s.id)}
  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${ (statuses[s.id] || "absent") === "present" ? "bg-success/15 text-success" : (statuses[s.id] || "absent") === "leave" ? "bg-leave/15 text-leave" : "bg-destructive/15 text-destructive" }`} > {(statuses[s.id] || "absent").charAt(0).toUpperCase() + (statuses[s.id] || "absent").slice(1)}
</button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={save} className="gradient-primary text-primary-foreground">Save Attendance</Button>
      </div>
    </div>
  );
};

export default AdminAttendance;
