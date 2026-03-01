// src/services/db.ts

export async function fetchUsers() {
  return [
    { id: 1, name: 'John Doe', email: 'john@example.com' }
  ];
}

export async function fetchAttendance() {
  return [
    { id: 1, student: 'John Doe', date: '2026-03-01', status: 'Present' }
  ];
}

export async function fetchBills() {
  return [
    { id: 1, student: 'John Doe', amount: 5000, paid: false }
  ];
}

export async function updatePassword(userId: number, newPassword: string) {
  console.log(`Password updated for user ${userId}: ${newPassword}`);
  return true;
}