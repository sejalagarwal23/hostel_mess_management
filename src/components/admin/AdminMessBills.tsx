import { useState, useEffect } from "react";
import { fetchStudentsOnly } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { IndianRupee, CalendarDays } from "lucide-react";

const API = "https://mess-management-backend-wyd2.onrender.com/api";

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

  //  LOAD STUDENTS+BILL TOTALS 

 const loadStudents = async () => {
  try {
    const token = localStorage.getItem("token");
    const data = await fetchStudentsOnly(token!);
    console.log("Raw students:", data); 
    const mappedStudents = data.map((s: any) => ({
  id: s._id || s.id || s.userId,
  name: s.name,
  rollNumber: s.rollNumber
}));

    setStudents(mappedStudents);
    const totals: Record<string, number> = {};
    for (const student of mappedStudents) {
      if (!student.id) continue; // prevent undefined API call
      const res = await fetch(
        `https://mess-management-backend-wyd2.onrender.com/api/bills/student/${student.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const bills = await res.json();

      console.log("Bills for student", student.id, bills[0]);

      const total = bills.reduce(
  (sum: number, b: Bill) => sum + (b.totalAmount || 0),0
);
      totals[student.id] = total;
    }
    setStudentTotals(totals);

  } catch (err) {
    console.error("Failed to fetch students", err);
  }
};

  //LOAD MONTHLY COST
  const loadMonthlyCost = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API}/bills/monthly-cost?month=${selectedMonth}&year=${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (data?.cost !== undefined) {
        setSelectedCost(String(data.cost));
      }

    } catch (err) {
      console.error("Failed to fetch monthly cost");
    }
  };

  // INITIAL LOAD 
  useEffect(() => {
    loadStudents();
    loadMonthlyCost();
  }, []);

  //  LOAD COST WHEN MONTH/YEAR CHANGES 
  useEffect(() => {
    loadMonthlyCost();
  }, [selectedMonth, selectedYear]);

  //SAVE MONTHLY COST
  const handleSaveCosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API}/bills/monthly-cost`,
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
      loadMonthlyCost();
    } catch (err) {
      toast.error("Failed to save monthly cost");
    }
  };

  // GENERATE MONTHLY BILLS

  const generateMonthlyBills = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API}/bills/generate-monthly`,
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

      {/* COST SETUP */}

      <Card className="shadow-card">

        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="w-5 h-5"/>
            Monthly Cost Per Day
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

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

            <div>
              <p className="text-sm mb-1 text-muted-foreground">Cost Per Day</p>

              <Input
                type="number"
                value={selectedCost}
                onChange={(e) => setSelectedCost(e.target.value)}
              />
            </div>

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

      {/* GENERATE BILLS */}

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

      {/* STUDENT BILL SUMMARY */}

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