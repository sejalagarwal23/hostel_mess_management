// src\services\bills.ts

export async function getStudentBills(userId: string, token: string) {
  const res = await fetch(`http://localhost:5000/api/bills/student/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
}