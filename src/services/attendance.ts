// services\attendance.ts
const API = "https://mess-management-backend-wyd2.onrender.com/api";

export async function getAttendance(userId: string, token: string) {
  const res = await fetch(`${API}/attendance/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch attendance");
  }

  return res.json();
}



export const markAttendance = async (
  userId: string,
  date: string,
  status: string,
  token: string
) => {

  const res = await fetch(`${API}/attendance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      userId,
      date,
      status
    })
  });

  if (!res.ok) {
    throw new Error("Failed to mark attendance");
  }

  return res.json();
};