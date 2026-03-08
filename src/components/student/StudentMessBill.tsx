// // src\componenets\studnet\StudentMessBill.tsx
// import { useState, useEffect } from 'react';
// import { MessBill } from '@/lib/store';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Button } from '@/components/ui/button';
// import { Printer, IndianRupee } from 'lucide-react';

// const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// const SEMESTER_PRESET = 36500;
// const currentYear = new Date().getFullYear();
// const StudentMessBill = () => {
//   const [bills, setBills] = useState<MessBill[]>([]);

//   useEffect(() => {
//   const fetchBills = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const studentId = localStorage.getItem("userId");

//       const res = await fetch(`http://localhost:5000/api/bills/student/${studentId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       const data = await res.json();
//       setBills(data);
//     } catch (err) {
//       console.error("Failed to fetch bills", err);
//     }
//   };

//   fetchBills();
// }, []);

//   const [selectedMonth, setSelectedMonth] = useState('1');
// const bill = bills.find(
//   b => b.month === parseInt(selectedMonth) && b.year === currentYear );

//   const totalDeducted = bills.reduce((sum, b) => sum + (b.totalAmount||0), 0);
//   const semesterBalance = SEMESTER_PRESET - totalDeducted;

//   const handlePrint = () => window.print();

//   return (
//     <div className="max-w-2xl">
//       <h1 className="text-2xl font-heading font-bold text-foreground mb-6">Mess Bill</h1>

//       {/* Semester Overview */}
//       <Card className="shadow-card mb-6">
//         <CardContent className="py-4">
//           <div className="grid grid-cols-3 gap-4 text-center">
//             <div>
//               <p className="text-xs text-muted-foreground">Semester Preset</p>
//               <p className="text-lg font-bold text-foreground">₹{SEMESTER_PRESET.toLocaleString()}</p>
//             </div>
//             <div>
//               <p className="text-xs text-muted-foreground">Total Deducted</p>
//               <p className="text-lg font-bold text-foreground">₹{totalDeducted.toLocaleString()}</p>
//             </div>
//             <div>
//               <p className="text-xs text-muted-foreground">Balance</p>
//               <p className={`text-lg font-bold ${semesterBalance >= 0 ? 'text-success' : 'text-destructive'}`}>
//                 ₹{semesterBalance.toLocaleString()}
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="mb-6">
//         <Select value={selectedMonth} onValueChange={setSelectedMonth}>
//           <SelectTrigger className="w-48">
//             <SelectValue placeholder="Select month" />
//           </SelectTrigger>
//           <SelectContent>
//             {months.map((m, i) => (
//               <SelectItem key={i} value={String(i + 1)}>{m} {currentYear}</SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       {bill ? (
//         <Card className="shadow-card">
//           <CardHeader className="flex-row items-center justify-between">
//             <CardTitle className="text-lg">{months[bill.month - 1]} {bill.year}</CardTitle>
//             <Button variant="outline" size="sm" onClick={handlePrint}>
//               <Printer className="w-4 h-4 mr-2" />
//               Print
//             </Button>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               <BillRow label="Total Present Days" value={`${bill.totalDaysPresent} days`} />
//               <BillRow label="Cost Per Day" value={`₹${bill.costPerDay}`} />
//               <div className="border-t border-border my-2" />
//               <BillRow label="Monthly Deduction" value={`₹${bill.totalAmount}`} bold />
//             </div>
//           </CardContent>
//         </Card>
//       ) : (
//         <Card className="shadow-card">
//           <CardContent className="py-12 text-center">
//             <IndianRupee className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
//             <p className="text-muted-foreground">No bill generated for this month yet.</p>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// const BillRow = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
//   <div className="flex items-center justify-between">
//     <span className="text-sm text-muted-foreground">{label}</span>
//     <span className={`text-sm ${bold ? 'font-bold text-foreground' : 'font-medium text-foreground'}`}>{value}</span>
//   </div>
// );

// export default StudentMessBill;


import { useState, useEffect } from "react";
import { MessBill } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Printer, IndianRupee } from "lucide-react";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const SEMESTER_PRESET = 36500;
const currentYear = new Date().getFullYear();

const StudentMessBill = () => {

  const [bills, setBills] = useState<MessBill[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState(
    String(new Date().getMonth() + 1)
  );

  useEffect(() => {

    const fetchBills = async () => {

      try {

        const token = localStorage.getItem("token");
        const studentId = localStorage.getItem("userId");

        if (!studentId || !token) {
          console.error("Missing auth data");
          return;
        }

        const res = await fetch(
          `http://localhost:5000/api/bills/student/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();
        setBills(data);

      } catch (err) {

        console.error("Failed to fetch bills", err);

      } finally {

        setLoading(false);

      }

    };

    fetchBills();

  }, []);

  const bill = bills.find(
    (b) =>
      b.month === Number(selectedMonth) &&
      b.year === currentYear
  );

  const totalDeducted = bills.reduce(
    (sum, b) => sum + (b.totalAmount || 0),
    0
  );

  const semesterBalance = SEMESTER_PRESET - totalDeducted;

  const handlePrint = () => window.print();

  return (
    <div className="max-w-2xl space-y-6">

      <h1 className="text-2xl font-bold">
        Mess Bill
      </h1>

      {/* Semester Overview */}
      <Card className="shadow-card">

        <CardContent className="py-4">

          <div className="grid grid-cols-3 gap-4 text-center">

            <div>
              <p className="text-xs text-muted-foreground">
                Semester Preset
              </p>
              <p className="text-lg font-bold">
                ₹{SEMESTER_PRESET.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Total Deducted
              </p>
              <p className="text-lg font-bold">
                ₹{totalDeducted.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Balance
              </p>
              <p
                className={`text-lg font-bold ${
                  semesterBalance >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                ₹{semesterBalance.toLocaleString()}
              </p>
            </div>

          </div>

        </CardContent>

      </Card>

      {/* Month Selector */}
      <div>

        <Select
          value={selectedMonth}
          onValueChange={setSelectedMonth}
        >

          <SelectTrigger className="w-56">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>

          <SelectContent>
            {months.map((m, i) => (
              <SelectItem key={i} value={String(i + 1)}>
                {m} {currentYear}
              </SelectItem>
            ))}
          </SelectContent>

        </Select>

      </div>

      {/* Bill Card */}
      {loading ? (

        <Card>
          <CardContent className="py-10 text-center">
            Loading bills...
          </CardContent>
        </Card>

      ) : bill ? (

        <Card className="shadow-card">

          <CardHeader className="flex-row items-center justify-between">

            <CardTitle className="text-lg">
              {months[bill.month - 1]} {bill.year}
            </CardTitle>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>

          </CardHeader>

          <CardContent>

            <div className="space-y-3">

              <BillRow
                label="Total Present Days"
                value={`${bill.totalDaysPresent} days`}
              />

              <BillRow
                label="Cost Per Day"
                value={`₹${bill.costPerDay}`}
              />

              <div className="border-t my-2" />

              <BillRow
                label="Monthly Deduction"
                value={`₹${bill.totalAmount}`}
                bold
              />

            </div>

          </CardContent>

        </Card>

      ) : (

        <Card>

          <CardContent className="py-12 text-center">

            <IndianRupee className="w-10 h-10 text-muted-foreground mx-auto mb-3" />

            <p className="text-muted-foreground">
              No bill generated for this month yet.
            </p>

          </CardContent>

        </Card>

      )}

    </div>
  );
};

const BillRow = ({
  label,
  value,
  bold
}: {
  label: string;
  value: string;
  bold?: boolean;
}) => (

  <div className="flex items-center justify-between">

    <span className="text-sm text-muted-foreground">
      {label}
    </span>

    <span
      className={`text-sm ${
        bold
          ? "font-bold text-foreground"
          : "font-medium text-foreground"
      }`}
    >
      {value}
    </span>

  </div>

);

export default StudentMessBill;

