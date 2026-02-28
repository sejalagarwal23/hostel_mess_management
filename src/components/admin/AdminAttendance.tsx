import { useState } from 'react';
import { getAllStudents } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CalendarDays } from 'lucide-react';

const AdminAttendance = () => {
  const students = getAllStudents();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [costPerDay, setCostPerDay] = useState('120');
  const [statuses, setStatuses] = useState<Record<string, 'present' | 'absent' | 'leave'>>(
    Object.fromEntries(students.map(s => [s.id, 'absent']))
  );

  const toggleStatus = (id: string) => {
    setStatuses(prev => ({
      ...prev,
      [id]: prev[id] === 'present' ? 'absent' : prev[id] === 'absent' ? 'leave' : 'present',
    }));
  };

  const markAllPresent = () => {
    setStatuses(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(id => {
        if (next[id] !== 'leave') next[id] = 'present';
      });
      return next;
    });
  };

  const markAllAbsent = () => {
    setStatuses(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(id => {
        if (next[id] !== 'leave') next[id] = 'absent';
      });
      return next;
    });
  };

  const save = () => toast.success(`Attendance saved for ${date}`);
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
                  {s.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.rollNumber}</p>
                </div>
              </div>
              <button
                onClick={() => toggleStatus(s.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  statuses[s.id] === 'present' ? 'bg-success/15 text-success' :
                  statuses[s.id] === 'leave' ? 'bg-leave/15 text-leave' :
                  'bg-destructive/15 text-destructive'
                }`}
              >
                {statuses[s.id].charAt(0).toUpperCase() + statuses[s.id].slice(1)}
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
