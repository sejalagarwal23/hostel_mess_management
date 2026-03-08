// // src\components\admin\AdminMessBills.tsx

// import { useState ,useEffect } from 'react';
// import { fetchStudentsOnly } from '@/lib/store';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { toast } from 'sonner';
// import { IndianRupee, CalendarDays } from 'lucide-react';

// const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// interface Student {
//   id: string;
//   name: string;
//   rollNumber: string;
// }

// const AdminMessBills = () => {
//   const [students, setStudents] = useState<Student[]>([]);
//   const [studentTotals, setStudentTotals] = useState<Record<string, number>>({});
// const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
// const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
// const [selectedCost, setSelectedCost] = useState("120");


//   useEffect(() => {
//     const loadStudents = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const data = await fetchStudentsOnly(token!);
//         setStudents(data);
//       } catch (err) {
//         console.error("Failed to fetch students");
//       }
//     };

//     loadStudents();
//   }, []);

//   const [monthlyCosts, setMonthlyCosts] = useState<Record<number, string>>(
//     Object.fromEntries(months.map((_, i) => [i + 1, '120']))
//   );



// <div className="flex gap-3 mb-4">

//   <select
//     value={selectedMonth}
//     onChange={(e) => setSelectedMonth(Number(e.target.value))}
//     className="border rounded p-2"
//   >
//     {months.map((m, i) => (
//       <option key={i} value={i + 1}>
//         {m}
//       </option>
//     ))}
//   </select>

//   <Input
//     type="number"
//     value={selectedYear}
//     onChange={(e) => setSelectedYear(Number(e.target.value))}
//     className="w-28"
//   />

// </div>

// const generateMonthlyBills = async () => {
//   try {
//     const token = localStorage.getItem("token");

//     const res = await fetch("http://localhost:5000/api/bills/generate-monthly", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`
//       },
//       body: JSON.stringify({
//         month: selectedMonth,
//         year: selectedYear
//       })
//     });

//     const data = await res.json();

//     if (!res.ok) throw new Error(data.error);

//     toast.success("Monthly bills generated successfully");

//   } catch (err) {
//     toast.error("Failed to generate bills");
//   }
// };

//   const handleCostChange = (month: number, value: string) => {
//     setMonthlyCosts(prev => ({ ...prev, [month]: value }));
//   };

//  const handleSaveCosts = async () => {

//   try {
//     const token = localStorage.getItem("token");

//     const res = await fetch("http://localhost:5000/api/bills/monthly-cost", {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`
//       },
//       body: JSON.stringify({
//         year: new Date().getFullYear(),
//         costs: monthlyCosts
//       })
//     });

//     const data = await res.json();

//     if (!res.ok) throw new Error(data.error);

//     toast.success("Monthly costs saved successfully");

//   } catch (err) {
//     toast.error("Failed to save monthly costs");
//   }
// };

//   return (
//     <div className="max-w-3xl">
//       <h1 className="text-2xl font-heading font-bold text-foreground mb-6">Mess Bill Management</h1>

//       {/* Monthly Cost Per Day */}
//       <Card className="shadow-card mb-6">
//         <CardHeader>
//           <CardTitle className="text-lg flex items-center gap-2"><IndianRupee className="w-5 h-5" /> Monthly Cost Per Day</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-3">
         
//           <Button onClick={handleSaveCosts} className="w-full gradient-primary text-primary-foreground mt-2">Save Costs</Button>
//         </CardContent>
//       </Card>

//       {/* Actions */}
//       <div className="mb-6 flex flex-wrap gap-3">
//         <Button onClick={generateMonthlyBills} variant="outline">
//           <CalendarDays className="w-4 h-4 mr-2" />
//           Generate Monthly Bills
//         </Button>
//       </div>

//       {/* Student Summary */}
//       <Card className="shadow-card">
//         <CardHeader>
//           <CardTitle className="text-lg">Student Bill Summary</CardTitle>
//         </CardHeader>
//         <CardContent className="py-2">
//           {students.map(s => (
//             <div key={s.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
//               <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
//                   {s.name.charAt(0)}
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-foreground">{s.name}</p>
//                   <p className="text-xs text-muted-foreground">{s.rollNumber}</p>
//                 </div>
//               </div>
//               <div className="text-right">
//               <p className="text-sm font-bold text-foreground"> ₹{studentTotals[s.id] || 0}</p> <p className="text-xs text-muted-foreground"> Total Deducted</p>
//               </div>
//             </div>
//           ))}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AdminMessBills;


import { useState, useEffect } from "react";
import { fetchStudentsOnly } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { IndianRupee, CalendarDays } from "lucide-react";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

interface Student {
  id: string;
  name: string;
  rollNumber: string;
}

interface Bill {
  totalAmount: number;
}

const AdminMessBills = () => {

  const [students, setStudents] = useState<Student[]>([]);
  const [studentTotals, setStudentTotals] = useState<Record<string, number>>({});

  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedCost, setSelectedCost] = useState<string>("120");

  useEffect(() => {
     loadStudents();

  }, []);

    const loadStudents = async () => {

      try {

        const token = localStorage.getItem("token");
        const data = await fetchStudentsOnly(token!);

        setStudents(data);

        const totals: Record<string, number> = {};

        for (const student of data) {

          const res = await fetch(
            `http://localhost:5000/api/bills/student/${student.id}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          const bills = await res.json();

          const total = bills.reduce(
            (sum: number, b: Bill) => sum + (b.totalAmount || 0),
            0
          );

          totals[student.id] = total;
        }

        setStudentTotals(totals);

      } catch (err) {
        console.error("Failed to fetch students");
      }
    };

  const handleSaveCosts = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      "http://localhost:5000/api/bills/monthly-cost",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          year: selectedYear,
          costs: {
            [selectedMonth]: Number(selectedCost)
          }
        })
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    toast.success("Monthly cost saved successfully");

    // refresh
    loadStudents();

  } catch (err) {
    toast.error("Failed to save monthly cost");
  }
};

      const generateMonthlyBills = async () => {

        try {

          const token = localStorage.getItem("token");

          const res = await fetch(
            "http://localhost:5000/api/bills/generate-monthly",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                month: selectedMonth,
                year: selectedYear
              })
            }
          );

          const data = await res.json();

          if (!res.ok) throw new Error(data.error);

          toast.success("Monthly bills generated successfully");

          loadStudents();

        } catch (err) {
          toast.error("Failed to generate bills");
        }

      };

  return (
    <div className="max-w-4xl space-y-6">

      <h1 className="text-2xl font-bold">
        Mess Bill Management
      </h1>

      {/* Cost Setup */}
      <Card className="shadow-card">

        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="w-5 h-5"/>
            Monthly Cost Per Day
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Month */}
            <div>
              <p className="text-sm mb-1 text-muted-foreground">Month</p>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full border rounded-md p-2"
              >
                {months.map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>

            {/* Cost */}
            <div>
              <p className="text-sm mb-1 text-muted-foreground">Cost Per Day</p>
              <Input
                type="number"
                value={selectedCost}
                onChange={(e) => setSelectedCost(e.target.value)}
              />
            </div>

            {/* Year */}
            <div>
              <p className="text-sm mb-1 text-muted-foreground">Year</p>
              <Input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              />
            </div>

          </div>

          <Button
            onClick={handleSaveCosts}
            className="w-full gradient-primary"
          >
            Save Monthly Cost
          </Button>

        </CardContent>

      </Card>

      {/* Generate Bills */}
      <Card className="shadow-card">

        <CardContent className="py-6">

          <Button
            onClick={generateMonthlyBills}
            className="w-full"
            size="lg"
            variant="outline"
          >
            <CalendarDays className="w-4 h-4 mr-2"/>
            Generate Monthly Bills
          </Button>

        </CardContent>

      </Card>

      {/* Student Summary */}
      <Card className="shadow-card">

        <CardHeader>
          <CardTitle>
            Student Bill Summary
          </CardTitle>
        </CardHeader>

        <CardContent className="divide-y">

          {students.map((s) => (

            <div
              key={s.id}
              className="flex items-center justify-between py-4"
            >

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center text-sm font-bold text-white">
                  {s.name.charAt(0)}
                </div>

                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.rollNumber}
                  </p>
                </div>

              </div>

              <div className="text-right">

                <p className="font-semibold text-lg">
                  ₹{studentTotals[s.id] || 0}
                </p>

                <p className="text-xs text-muted-foreground">
                  Total Deducted
                </p>

              </div>

            </div>

          ))}

        </CardContent>

      </Card>

    </div>
  );
};

export default AdminMessBills;

