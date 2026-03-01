import { useState } from 'react';
import { MessBill } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Printer, IndianRupee } from 'lucide-react';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const StudentMessBill = ({ bills }: { bills: MessBill[] }) => {
  const [selectedMonth, setSelectedMonth] = useState('1');
  const bill = bills.find(b => b.month === parseInt(selectedMonth));

  const handlePrint = () => window.print();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-6">Mess Bill</h1>

      <div className="mb-6">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m, i) => (
              <SelectItem key={i} value={String(i + 1)}>{m} 2025</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {bill ? (
        <Card className="shadow-card">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg">{months[bill.month - 1]} {bill.year}</CardTitle>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <BillRow label="Total Present Days" value={`${bill.totalDaysPresent} days`} />
              <BillRow label="Cost Per Day" value={`₹${bill.costPerDay}`} />
              <div className="border-t border-border my-2" />
              <BillRow label="Total Amount" value={`₹${bill.totalAmount}`} bold />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center">
            <IndianRupee className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No bill generated for this month yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const BillRow = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className={`text-sm ${bold ? 'font-bold text-foreground' : 'font-medium text-foreground'}`}>{value}</span>
  </div>
);

export default StudentMessBill;
