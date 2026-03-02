import { useState } from 'react';
import { getAllStudents } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { TreePalm } from 'lucide-react';

const AdminLeave = () => {
  const students = getAllStudents();
  const [rollNumber, setRollNumber] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredStudents = rollNumber.trim()
    ? students.filter(s =>
        s.rollNumber.toLowerCase().includes(rollNumber.toLowerCase()) ||
        s.name.toLowerCase().includes(rollNumber.toLowerCase())
      )
    : [];

  const selectedStudent = students.find(
    s => s.rollNumber.toLowerCase() === rollNumber.toLowerCase()
  );

  const handleSelectStudent = (roll: string) => {
    setRollNumber(roll);
    setShowSuggestions(false);
  };

  const handleSave = () => {
    if (!selectedStudent || !fromDate || !toDate) {
      toast.error('Please select a valid student and fill all fields');
      return;
    }
    toast.success(`Leave assigned to ${selectedStudent.name} successfully!`);
    setRollNumber('');
    setFromDate('');
    setToDate('');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-heading font-bold text-foreground">Leave Management</h1>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><TreePalm className="w-5 h-5" /> Assign Leave</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 relative">
            <Label>Student Roll Number</Label>
            <Input
              placeholder="Search by roll number or name..."
              value={rollNumber}
              onChange={e => { setRollNumber(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
            />
            {/* Suggestions dropdown */}
            {showSuggestions && rollNumber.trim() && filteredStudents.length > 0 && !selectedStudent && (
              <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredStudents.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-accent flex items-center gap-3 transition-colors"
                    onClick={() => handleSelectStudent(s.rollNumber)}
                  >
                    <div className="w-7 h-7 rounded-md gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.rollNumber}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {rollNumber && selectedStudent && (
              <p className="text-xs text-success">Selected: {selectedStudent.name}</p>
            )}
            {rollNumber && !selectedStudent && filteredStudents.length === 0 && (
              <p className="text-xs text-destructive">No student found</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>From Date</Label>
            <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>To Date</Label>
            <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
          </div>
          <Button onClick={handleSave} className="w-full gradient-primary text-primary-foreground">Save Leave</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLeave;
