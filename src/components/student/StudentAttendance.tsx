//src/components/stuednts/studentattendance.tsx

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

/*
  
  We are keeping billing mock for now.
  Remove bills array once:
  - You create backend bill model
  - You create GET /api/bills route
  - You fetch bill using useEffect
*/

const bills = [
  {
    month: 1,
    costPerDay: 100,
    totalAmount: 2500,
  },
  {
    month: 2,
    costPerDay: 100,
    totalAmount: 2300,
  },
];
  const currentYear = new Date().getFullYear();
const months = [ "January","February","March","April","May","June", "July","August","September","October","November","December" ];
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Attendance = {
  _id: string;
  date: string;
  status: "present" | "absent" | "leave";
};

const StudentAttendance = () => {
   const [selectedMonth, setSelectedMonth] = useState(
    String(new Date().getMonth())
  );

  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  const idx = parseInt(selectedMonth);


  useEffect(() => {
  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) return;

      const monthString = `${currentYear}-${String(idx + 1).padStart(2, "0")}`;

      const res = await fetch(
        `https://mess-management-backend-wyd2.onrender.com/api/attendance/${userId}?month=${monthString}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }, cache: "no-store"
        }
      );
      const data = await res.json();
      setRecords(data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchAttendance();

  const interval = setInterval(fetchAttendance, 5000); // refresh every 5 sec

  return () => clearInterval(interval);

}, [selectedMonth]);

 

  // Filter records by selected month
  const filteredRecords = records.filter((r) => {
    const recordDate = new Date(r.date);
    return recordDate.getMonth() === idx;
  });

  const presentCount = filteredRecords.filter(
    (r) => r.status === "present"
  ).length;

  const absentCount = filteredRecords.filter(
    (r) => r.status === "absent"
  ).length;

  const leaveCount = filteredRecords.filter(
    (r) => r.status === "leave"
  ).length;


  const firstDay = new Date(currentYear, idx, 1).getDay();

  // 🔵 STILL USING MOCK BILL
  const bill = bills.find((b) => b.month === idx + 1);

  if (loading) {
    return <div className="p-4">Loading attendance...</div>;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-6">
        Attendance
      </h1>

      {/* Month Selector */}
      <div className="mb-6">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((m, i) => (
              <SelectItem key={i} value={String(i)}>
                {m} {currentYear}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard
          label="Present"
          count={presentCount}
          className="bg-green-100 text-green-700"
        />
        <StatCard
          label="Absent"
          count={absentCount}
          className="bg-red-100 text-red-700"
        />
        <StatCard
          label="Leave"
          count={leaveCount}
          className="bg-yellow-100 text-yellow-700"
        />
      </div>

      {/* Calendar */}
      <Card className="shadow-card mb-6">
        <CardHeader>
          <CardTitle className="text-lg">
            {months[idx]} {currentYear}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((d) => (
              <div
                key={d}
                className="text-center text-xs font-medium text-muted-foreground py-1"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {Array.from({ length: new Date(currentYear, idx + 1, 0).getDate() }).map((_, i) => {
  const day = i + 1;

  const record = records.find(
    r => new Date(r.date).getDate() === day
  );

  const status = record?.status;

  return (
    <div
      key={day}
      className={`aspect-square flex items-center justify-center rounded-md text-xs font-medium ${
        status === "present"
          ? "bg-green-200 text-green-800"
          : status === "absent"
          ? "bg-red-200 text-red-800"
          : status === "leave"
          ? "bg-yellow-200 text-yellow-800"
          : "bg-muted"
      }`}
    >
      {day}
    </div>
  );
})}
          </div>

          <div className="flex gap-4 mt-4 pt-4 border-t border-border">
            <Legend color="bg-green-500" label="Present" />
            <Legend color="bg-red-500" label="Absent" />
            <Legend color="bg-yellow-500" label="Leave" />
          </div>
        </CardContent>
      </Card>


      {bill && (
        <Card className="shadow-card">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Cost per day
              </span>
              <span className="font-medium">₹{bill.costPerDay}</span>
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-muted-foreground">
                Monthly Bill
              </span>
              <span className="font-bold text-lg">
                ₹{bill.totalAmount}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const StatCard = ({
  label,
  count,
  className,
}: {
  label: string;
  count: number;
  className: string;
}) => (
  <div className={`rounded-lg p-3 text-center ${className}`}>
    <p className="text-2xl font-bold">{count}</p>
    <p className="text-xs font-medium">{label}</p>
  </div>
);

const Legend = ({
  color,
  label,
}: {
  color: string;
  label: string;
}) => (
  <div className="flex items-center gap-1.5">
    <div className={`w-3 h-3 rounded-sm ${color}`} />
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);

export default StudentAttendance;