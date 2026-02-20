export type UserRole = 'employee' | 'manager' | 'admin';

export type LeaveType = 'casual' | 'sick' | 'paid' | 'emergency';

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  employeeId: string;
  mobile: string;
  outletId: string;
  avatar?: string;
  active?: boolean;
}

export interface Outlet {
  id: string;
  name: string;
  address: string;
  city: string;
  managerId: string;
  employeeCount: number;
}

export interface LeaveBalance {
  casual: number;
  sick: number;
  paid: number;
  emergency: number;
}

export interface Leave {
  id: string;
  employeeId: string;
  employeeName: string;
  outletId: string;
  outletName: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  document?: string;
  remarks?: string;
  reviewedBy?: string;
  reviewedOn?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalEmployees: number;
  pendingLeaves: number;
  approvedLeaves: number;
  rejectedLeaves: number;
  totalOutlets: number;
}
export interface SignupRequest {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  outletId: string;
  department: string;
  designation: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: string;
  remarks?: string;
}