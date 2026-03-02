import { useState } from 'react';
import { getAllStudents } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Receipt, IndianRupee, CalendarDays } from 'lucide-react';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const AdminMessBills = () => {
  const students = getAllStudents();
  const [monthlyCosts, setMonthlyCosts] = useState<Record<number, string>>(
    Object.fromEntries(months.map((_, i) => [i + 1, '120']))
  );

  const generateSemBills = () => toast.success('Semester bills generated for all students!');
  const generateMonthlyBills = () => toast.success('Monthly bills generated for all students!');

  const handleCostChange = (month: number, value: string) => {
    setMonthlyCosts(prev => ({ ...prev, [month]: value }));
  };

  const handleSaveCosts = () => {
    toast.success('Monthly cost per day updated successfully!');
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-6">Mess Bill Management</h1>

      {/* Monthly Cost Per Day */}
      <Card className="shadow-card mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><IndianRupee className="w-5 h-5" /> Monthly Cost Per Day</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {months.map((m, i) => (
              <div key={i} className="space-y-1">
                <Label className="text-xs">{m}</Label>
                <Input
                  type="number"
                  min={0}
                  value={monthlyCosts[i + 1]}
                  onChange={e => handleCostChange(i + 1, e.target.value)}
                  className="h-9"
                />
              </div>
            ))}
          </div>
          <Button onClick={handleSaveCosts} className="w-full gradient-primary text-primary-foreground mt-2">Save Costs</Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Button onClick={generateSemBills} className="gradient-primary text-primary-foreground">
          <Receipt className="w-4 h-4 mr-2" />
          Generate Semester Bills (6 months)
        </Button>
        <Button onClick={generateMonthlyBills} variant="outline">
          <CalendarDays className="w-4 h-4 mr-2" />
          Generate Monthly Bills
        </Button>
      </div>

      {/* Student Summary */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Student Bill Summary</CardTitle>
        </CardHeader>
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
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">₹5,880</p>
                <p className="text-xs text-muted-foreground">2 months</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMessBills;
