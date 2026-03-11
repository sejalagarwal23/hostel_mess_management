// src\services\bills.ts

export async function getStudentBills(userId: string, token: string) {
  const res = await fetch(`https://mess-management-backend-wyd2.onrender.com/api/bills/student/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
}