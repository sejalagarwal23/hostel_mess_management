// src\pages\AdminDashboard.tsx

import { useState } from 'react';
import { useAuth } from '@/lib/store';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import AdminProfile from '@/components/admin/AdminProfile';
import AdminManageUsers from '@/components/admin/AdminManageUsers';
import AdminAttendance from '@/components/admin/AdminAttendance';
import AdminLeave from '@/components/admin/AdminLeave';
import AdminMessBills from '@/components/admin/AdminMessBills';
import AdminNotifications from '@/components/admin/AdminNotifications';
import { User, Users, CalendarDays, TreePalm, Receipt, Bell } from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'users', label: 'Manage Users', icon: Users },
  { id: 'attendance', label: 'Attendance', icon: CalendarDays },
  { id: 'leave', label: 'Leave', icon: TreePalm },
  { id: 'bills', label: 'Mess Bills', icon: Receipt },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const AdminDashboard = () => {
  const user = useAuth(s => s.user);
  const [activeTab, setActiveTab] = useState('profile');

  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;

  return (
    <DashboardLayout tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="animate-fade-in">
        {activeTab === 'profile' && <AdminProfile user={user} />}
        {activeTab === 'users' && <AdminManageUsers />}
        {activeTab === 'attendance' && <AdminAttendance />}
        {activeTab === 'leave' && <AdminLeave />}
        {activeTab === 'bills' && <AdminMessBills />}
        {activeTab === 'notifications' && <AdminNotifications />}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
