import { useState, useEffect } from 'react';
import { fetchStudents, assignLeave, deleteLeave } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { TreePalm } from 'lucide-react';

interface Student {
  _id?: string
  id?: string
  rollNumber: string
  name: string
}
interface Leave {
  _id: string;
  userId: string;
  fromDate: string;
  toDate: string;
}


const AdminLeave = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [rollNumber, setRollNumber] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const loadLeaves = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("http://mess-management-backend-wyd2.onrender.com/api/leave/all", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    setLeaves(Array.isArray(data) ? data : []);

  } catch (err) {
    console.error(err);
  }
};

  // Fetch students from backend
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const data = await fetchStudents(token);
        setStudents(data);
      } catch (err) {
        console.error(err);
      }
    };
     
    loadStudents();
         loadLeaves();
  }, []);
 

  const filteredStudents = rollNumber.trim()
    ? students.filter((s: Student) =>
        s.rollNumber.toLowerCase().includes(rollNumber.toLowerCase()) ||
        s.name.toLowerCase().includes(rollNumber.toLowerCase())
      )
    : [];

  const selectedStudent = students.find(
    (s: Student) => s.rollNumber.toLowerCase() === rollNumber.toLowerCase()
  );

  const handleSelectStudent = (roll: string) => {
    setRollNumber(roll);
    setShowSuggestions(false);
  };

  const handleSave = async () => {
  if (!selectedStudent || !fromDate || !toDate) {
    toast.error("Please select a valid student and fill all fields");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Not authenticated");
      return;
    }

   await assignLeave(
      selectedStudent._id || selectedStudent.id,
      fromDate,
      toDate,
      token
    );

    await loadLeaves();

    toast.success(`Leave assigned to ${selectedStudent.name} successfully!`);

    setRollNumber("");
    setFromDate("");
    setToDate("");

  } catch (err) {
    console.error(err);
    toast.error("Failed to assign leave");
  }
};

const handleDeleteLeave = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    await deleteLeave(id, token);

    toast.success("Leave deleted");

    setLeaves(prev => prev.filter(l => l._id !== id));

  } catch (err) {
    console.error(err);
    toast.error("Failed to delete leave");
  }
};

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-heading font-bold text-foreground">Leave Management</h1>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TreePalm className="w-5 h-5" /> Assign Leave
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* Student Search */}
          <div className="space-y-2 relative">
            <Label>Student Roll Number</Label>

            <Input
              placeholder="Search by roll number or name..."
              value={rollNumber}
              onChange={e => {
                setRollNumber(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />

            {showSuggestions &&
              rollNumber.trim() &&
              filteredStudents.length > 0 &&
              !selectedStudent && (

              <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">

                {filteredStudents.map((s: Student, index) => (
                  <button
                    key={s._id || index || s.id}
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
              <p className="text-xs text-success">
                Selected: {selectedStudent.name}
              </p>
            )}

            {rollNumber && !selectedStudent && filteredStudents.length === 0 && (
              <p className="text-xs text-destructive">No student found</p>
            )}

          </div>

          {/* From Date */}
          <div className="space-y-2">
            <Label>From Date</Label>
            <Input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
            />
          </div>

          {/* To Date */}
          <div className="space-y-2">
            <Label>To Date</Label>
            <Input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
            />
          </div>

          <Button
            onClick={handleSave}
            className="w-full gradient-primary text-primary-foreground"
          >
            Save Leave
          </Button>

        </CardContent>
      </Card>
      <Card className="shadow-card">
  <CardHeader>
    <CardTitle>Recent Leaves</CardTitle>
  </CardHeader>

  <CardContent className="space-y-3">

    {leaves.length === 0 && (
      <p className="text-sm text-muted-foreground">
        No leaves assigned yet
      </p>
    )}

    {leaves && leaves.map((leave) => {
      const student = students.find(
  (s) => (s._id?.toString() || s.id) === leave.userId?.toString() );

      return (
        <div
          key={leave._id}
          className="flex items-center justify-between border rounded-md p-3"
        >
          <div>
            <p className="font-medium">
              {student?.name || "Unknown Student"}
            </p>

            <p className="text-xs text-muted-foreground">
              {student?.rollNumber}
            </p>

            <p className="text-xs">
              {leave.fromDate} → {leave.toDate}
            </p>
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteLeave(leave._id)}
          >
            Delete
          </Button>
        </div>
      );
    })}

  </CardContent>
</Card>
    </div>
  );
};

export default AdminLeave;