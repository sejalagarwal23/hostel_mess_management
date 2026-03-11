// src/lib/store.ts

import { create } from "zustand";

export type UserRole = "student" | "admin";

export interface User {
  id: string;
  name: string;
  rollNumber: string;
  role: UserRole;
  phone: string;
  email?: string;
  hostelNumber?: string;
  semester?: number;
}

export interface AttendanceRecord {
  date: string;
  status: "present" | "absent" | "leave";
}

export interface MessBill {
  month: number;
  year: number;
  totalDaysPresent: number;
  costPerDay: number;
  totalAmount: number;
  paidAmount: number;
  balance: number;
}

export interface Notification {
  id: string;
  message: string;
  sentBy: string;
  createdAt: string;
}


const API_URL = "https://mess-management-backend-wyd2.onrender.com/api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (rollNumber: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (rollNumber, password, role) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rollNumber, password, role }),
      });

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        console.error("Login failed:", data.error);
        return false;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);

      console.log("TOKEN SAVED:", data.token);

      set({
        user: data.user,
        isAuthenticated: true,
      });

      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));

export async function fetchStudentsOnly(token: string) {
  const res = await fetch(`${API_URL}/users/students`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return res.json();
}

export async function fetchStudents(token: string) {
  const res = await fetch(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}


export async function sendNotification(message: string, token: string) {
  const res = await fetch(`${API_URL}/notifications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });

  return res.json();
}

export async function fetchNotifications(token: string) {
  const res = await fetch(`${API_URL}/notifications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}


export async function assignLeave(
  userId: string,
  fromDate: string,
  toDate: string,
  token: string
) {
  const res = await fetch(`${API_URL}/leave`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userId,
      fromDate,
      toDate,
    }),
  });

  return res.json();
}

export async function deleteLeave(id: string, token: string) {
  const res = await fetch(`${API_URL}/leave/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}



export async function fetchBills(studentId: string, token: string) {
  const res = await fetch(`${API_URL}/bills/student/${studentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}