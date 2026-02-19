import { User, Outlet, Leave, LeaveBalance, Notification } from '../types';

export const outlets: Outlet[] = [
  { id: 'o1', name: 'Grover Sweets - Connaught Place', address: 'Block A, CP', city: 'New Delhi', managerId: 'm1', employeeCount: 12 },
  { id: 'o2', name: 'Grover Sweets - Lajpat Nagar', address: 'Main Market', city: 'New Delhi', managerId: 'm2', employeeCount: 8 },
  { id: 'o3', name: 'Grover Sweets - Chandni Chowk', address: 'Dariba Kalan', city: 'New Delhi', managerId: 'm3', employeeCount: 15 },
  { id: 'o4', name: 'Grover Sweets - Karol Bagh', address: 'Ajmal Khan Road', city: 'New Delhi', managerId: 'm4', employeeCount: 10 },
  { id: 'o5', name: 'Grover Sweets - Noida', address: 'Sector 18', city: 'Noida', managerId: 'm5', employeeCount: 7 },
];

export const users: User[] = [
  // Admin
  { id: 'a1', email: 'admin@groversweets.com', password: 'admin123', name: 'Rajesh Grover', role: 'admin', employeeId: 'GS-ADMIN-001', mobile: '9876543210', outletId: 'o1' },
  
  // Managers
  { id: 'm1', email: 'manager1@groversweets.com', password: 'manager123', name: 'Vikram Singh', role: 'manager', employeeId: 'GS-MGR-001', mobile: '9876543211', outletId: 'o1' },
  { id: 'm2', email: 'manager2@groversweets.com', password: 'manager123', name: 'Priya Sharma', role: 'manager', employeeId: 'GS-MGR-002', mobile: '9876543212', outletId: 'o2' },
  { id: 'm3', email: 'manager3@groversweets.com', password: 'manager123', name: 'Amit Kumar', role: 'manager', employeeId: 'GS-MGR-003', mobile: '9876543213', outletId: 'o3' },
  { id: 'm4', email: 'manager4@groversweets.com', password: 'manager123', name: 'Sunita Devi', role: 'manager', employeeId: 'GS-MGR-004', mobile: '9876543214', outletId: 'o4' },
  { id: 'm5', email: 'manager5@groversweets.com', password: 'manager123', name: 'Ravi Verma', role: 'manager', employeeId: 'GS-MGR-005', mobile: '9876543215', outletId: 'o5' },
  
  // Employees
  { id: 'e1', email: 'emp1@groversweets.com', password: 'emp123', name: 'Rahul Gupta', role: 'employee', employeeId: 'GS-EMP-001', mobile: '9876543220', outletId: 'o1' },
  { id: 'e2', email: 'emp2@groversweets.com', password: 'emp123', name: 'Neha Agarwal', role: 'employee', employeeId: 'GS-EMP-002', mobile: '9876543221', outletId: 'o1' },
  { id: 'e3', email: 'emp3@groversweets.com', password: 'emp123', name: 'Suresh Yadav', role: 'employee', employeeId: 'GS-EMP-003', mobile: '9876543222', outletId: 'o2' },
  { id: 'e4', email: 'emp4@groversweets.com', password: 'emp123', name: 'Meera Joshi', role: 'employee', employeeId: 'GS-EMP-004', mobile: '9876543223', outletId: 'o2' },
  { id: 'e5', email: 'emp5@groversweets.com', password: 'emp123', name: 'Deepak Chauhan', role: 'employee', employeeId: 'GS-EMP-005', mobile: '9876543224', outletId: 'o3' },
  { id: 'e6', email: 'emp6@groversweets.com', password: 'emp123', name: 'Anjali Mishra', role: 'employee', employeeId: 'GS-EMP-006', mobile: '9876543225', outletId: 'o3' },
  { id: 'e7', email: 'emp7@groversweets.com', password: 'emp123', name: 'Karan Malhotra', role: 'employee', employeeId: 'GS-EMP-007', mobile: '9876543226', outletId: 'o4' },
  { id: 'e8', email: 'emp8@groversweets.com', password: 'emp123', name: 'Pooja Saxena', role: 'employee', employeeId: 'GS-EMP-008', mobile: '9876543227', outletId: 'o5' },
];

export const leaveBalances: Record<string, LeaveBalance> = {
  'e1': { casual: 8, sick: 10, paid: 15, emergency: 3 },
  'e2': { casual: 10, sick: 12, paid: 12, emergency: 2 },
  'e3': { casual: 6, sick: 8, paid: 18, emergency: 4 },
  'e4': { casual: 9, sick: 11, paid: 14, emergency: 3 },
  'e5': { casual: 7, sick: 9, paid: 16, emergency: 2 },
  'e6': { casual: 10, sick: 12, paid: 12, emergency: 3 },
  'e7': { casual: 5, sick: 10, paid: 20, emergency: 4 },
  'e8': { casual: 8, sick: 8, paid: 15, emergency: 2 },
};

export const leaves: Leave[] = [
  { id: 'l1', employeeId: 'e1', employeeName: 'Rahul Gupta', outletId: 'o1', outletName: 'Connaught Place', type: 'casual', startDate: '2024-01-15', endDate: '2024-01-16', reason: 'Family function', status: 'approved', appliedOn: '2024-01-10', remarks: 'Approved. Enjoy!', reviewedBy: 'Vikram Singh', reviewedOn: '2024-01-11' },
  { id: 'l2', employeeId: 'e1', employeeName: 'Rahul Gupta', outletId: 'o1', outletName: 'Connaught Place', type: 'sick', startDate: '2024-02-05', endDate: '2024-02-07', reason: 'Fever and cold', status: 'approved', appliedOn: '2024-02-05', document: 'medical-certificate.pdf', remarks: 'Get well soon!', reviewedBy: 'Vikram Singh', reviewedOn: '2024-02-05' },
  { id: 'l3', employeeId: 'e2', employeeName: 'Neha Agarwal', outletId: 'o1', outletName: 'Connaught Place', type: 'paid', startDate: '2024-02-20', endDate: '2024-02-25', reason: 'Annual vacation', status: 'pending', appliedOn: '2024-02-10' },
  { id: 'l4', employeeId: 'e3', employeeName: 'Suresh Yadav', outletId: 'o2', outletName: 'Lajpat Nagar', type: 'emergency', startDate: '2024-01-28', endDate: '2024-01-29', reason: 'Medical emergency at home', status: 'approved', appliedOn: '2024-01-28', remarks: 'Take care', reviewedBy: 'Priya Sharma', reviewedOn: '2024-01-28' },
  { id: 'l5', employeeId: 'e4', employeeName: 'Meera Joshi', outletId: 'o2', outletName: 'Lajpat Nagar', type: 'casual', startDate: '2024-02-14', endDate: '2024-02-14', reason: 'Personal work', status: 'rejected', appliedOn: '2024-02-12', remarks: 'High workload on this day. Please reschedule.', reviewedBy: 'Priya Sharma', reviewedOn: '2024-02-12' },
  { id: 'l6', employeeId: 'e5', employeeName: 'Deepak Chauhan', outletId: 'o3', outletName: 'Chandni Chowk', type: 'sick', startDate: '2024-02-01', endDate: '2024-02-03', reason: 'Back pain', status: 'approved', appliedOn: '2024-02-01', remarks: 'Rest well', reviewedBy: 'Amit Kumar', reviewedOn: '2024-02-01' },
  { id: 'l7', employeeId: 'e6', employeeName: 'Anjali Mishra', outletId: 'o3', outletName: 'Chandni Chowk', type: 'paid', startDate: '2024-03-01', endDate: '2024-03-05', reason: 'Wedding in family', status: 'pending', appliedOn: '2024-02-15' },
  { id: 'l8', employeeId: 'e7', employeeName: 'Karan Malhotra', outletId: 'o4', outletName: 'Karol Bagh', type: 'casual', startDate: '2024-02-18', endDate: '2024-02-19', reason: 'Attending seminar', status: 'pending', appliedOn: '2024-02-14' },
  { id: 'l9', employeeId: 'e8', employeeName: 'Pooja Saxena', outletId: 'o5', outletName: 'Noida', type: 'emergency', startDate: '2024-02-10', endDate: '2024-02-11', reason: 'Child unwell', status: 'approved', appliedOn: '2024-02-10', remarks: 'Hope your child recovers soon', reviewedBy: 'Ravi Verma', reviewedOn: '2024-02-10' },
  { id: 'l10', employeeId: 'e1', employeeName: 'Rahul Gupta', outletId: 'o1', outletName: 'Connaught Place', type: 'casual', startDate: '2024-03-10', endDate: '2024-03-12', reason: 'Holi celebration with family', status: 'pending', appliedOn: '2024-02-28' },
];

export const notifications: Notification[] = [
  { id: 'n1', userId: 'e1', title: 'Leave Approved', message: 'Your casual leave from Jan 15-16 has been approved.', type: 'success', read: true, createdAt: '2024-01-11' },
  { id: 'n2', userId: 'e1', title: 'Leave Approved', message: 'Your sick leave from Feb 5-7 has been approved.', type: 'success', read: true, createdAt: '2024-02-05' },
  { id: 'n3', userId: 'm1', title: 'New Leave Request', message: 'Neha Agarwal has applied for paid leave.', type: 'info', read: false, createdAt: '2024-02-10' },
  { id: 'n4', userId: 'm1', title: 'New Leave Request', message: 'Rahul Gupta has applied for casual leave.', type: 'info', read: false, createdAt: '2024-02-28' },
  { id: 'n5', userId: 'e4', title: 'Leave Rejected', message: 'Your casual leave request has been rejected.', type: 'error', read: false, createdAt: '2024-02-12' },
];

export const getOutletById = (id: string): Outlet | undefined => outlets.find(o => o.id === id);
export const getUserById = (id: string): User | undefined => users.find(u => u.id === id);
export const getLeavesByEmployee = (employeeId: string): Leave[] => leaves.filter(l => l.employeeId === employeeId);
export const getLeavesByOutlet = (outletId: string): Leave[] => leaves.filter(l => l.outletId === outletId);
export const getPendingLeaves = (): Leave[] => leaves.filter(l => l.status === 'pending');
export const getLeaveBalance = (employeeId: string): LeaveBalance => leaveBalances[employeeId] || { casual: 12, sick: 12, paid: 20, emergency: 5 };
