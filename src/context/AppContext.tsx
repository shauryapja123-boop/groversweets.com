import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Leave, Outlet, User, Notification, LeaveBalance, SignupRequest } from '../types';
import { leaves as initialLeaves, outlets as initialOutlets, users as initialUsers, notifications as initialNotifications, leaveBalances as initialLeaveBalances } from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  leaves: Leave[];
  outlets: Outlet[];
  employees: User[];
  managers: User[];
  signupRequests: SignupRequest[];
  notifications: Notification[];
  leaveBalances: Record<string, LeaveBalance>;
  toasts: Toast[];
  addLeave: (leave: Omit<Leave, 'id' | 'appliedOn'>) => void;
  updateLeaveStatus: (leaveId: string, status: 'approved' | 'rejected', remarks: string, reviewerName: string) => void;
  addOutlet: (outlet: Omit<Outlet, 'id'>) => void;
  updateOutlet: (id: string, outlet: Partial<Outlet>) => void;
  deleteOutlet: (id: string) => void;
  addEmployee: (employee: Omit<User, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<User>) => void;
  deleteEmployee: (id: string) => void;
  addManager: (manager: Omit<User, 'id'>) => void;
  updateManager: (id: string, manager: Partial<User>) => void;
  deleteManager: (id: string) => void;
  addSignupRequest: (request: Omit<SignupRequest, 'id' | 'appliedOn' | 'status'>) => void;
  approveSignupRequest: (requestId: string) => void;
  rejectSignupRequest: (requestId: string, remarks: string) => void;
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
  markNotificationRead: (id: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from localStorage or mock data
  const [leaves, setLeaves] = useState<Leave[]>(initialLeaves);
  const [outlets, setOutlets] = useState<Outlet[]>(initialOutlets);
  const [employees, setEmployees] = useState<User[]>(() => {
    const stored = localStorage.getItem('grover_employees');
    return stored ? JSON.parse(stored) : initialUsers.filter(u => u.role === 'employee');
  });
  const [managers, setManagers] = useState<User[]>(() => {
    const stored = localStorage.getItem('grover_managers');
    return stored ? JSON.parse(stored) : initialUsers.filter(u => u.role === 'manager');
  });
  const [signupRequests, setSignupRequests] = useState<SignupRequest[]>(() => {
    const stored = localStorage.getItem('grover_signup_requests');
    return stored ? JSON.parse(stored) : [];
  });
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [leaveBalances, setLeaveBalances] = useState<Record<string, LeaveBalance>>(() => {
    const stored = localStorage.getItem('grover_leave_balances');
    return stored ? JSON.parse(stored) : initialLeaveBalances;
  });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  // Persist employees to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('grover_employees', JSON.stringify(employees));
  }, [employees]);

  // Persist managers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('grover_managers', JSON.stringify(managers));
  }, [managers]);

  // Persist signup requests to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('grover_signup_requests', JSON.stringify(signupRequests));
  }, [signupRequests]);

  // Persist leave balances to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('grover_leave_balances', JSON.stringify(leaveBalances));
  }, [leaveBalances]);

  const addLeave = (leave: Omit<Leave, 'id' | 'appliedOn'>) => {
    const newLeave: Leave = {
      ...leave,
      id: `l${Date.now()}`,
      appliedOn: new Date().toISOString().split('T')[0],
    };
    setLeaves(prev => [newLeave, ...prev]);
    addToast('Leave application submitted successfully!', 'success');
  };

  const updateLeaveStatus = (leaveId: string, status: 'approved' | 'rejected', remarks: string, reviewerName: string) => {
    setLeaves(prev => prev.map(leave => {
      if (leave.id === leaveId) {
        // Update leave balance if approved
        if (status === 'approved') {
          const balance = leaveBalances[leave.employeeId];
          if (balance) {
            const days = Math.ceil((new Date(leave.endDate).getTime() - new Date(leave.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
            setLeaveBalances(prev => ({
              ...prev,
              [leave.employeeId]: {
                ...balance,
                [leave.type]: Math.max(0, balance[leave.type] - days)
              }
            }));
          }
        }
        return {
          ...leave,
          status,
          remarks,
          reviewedBy: reviewerName,
          reviewedOn: new Date().toISOString().split('T')[0]
        };
      }
      return leave;
    }));
    addToast(`Leave ${status} successfully!`, status === 'approved' ? 'success' : 'info');
  };

  const addOutlet = (outlet: Omit<Outlet, 'id'>) => {
    const newOutlet: Outlet = { ...outlet, id: `o${Date.now()}` };
    setOutlets(prev => [...prev, newOutlet]);
    addToast('Outlet added successfully!', 'success');
  };

  const updateOutlet = (id: string, outlet: Partial<Outlet>) => {
    setOutlets(prev => prev.map(o => o.id === id ? { ...o, ...outlet } : o));
    addToast('Outlet updated successfully!', 'success');
  };

  const deleteOutlet = (id: string) => {
    setOutlets(prev => prev.filter(o => o.id !== id));
    addToast('Outlet deleted successfully!', 'info');
  };

  const addEmployee = (employee: Omit<User, 'id'>) => {
    const newEmployee: User = { ...employee, id: `e${Date.now()}` };
    setEmployees(prev => [...prev, newEmployee]);
    setLeaveBalances(prev => ({
      ...prev,
      [newEmployee.id]: { casual: 12, sick: 12, paid: 20, emergency: 5 }
    }));
    addToast('Employee added successfully!', 'success');
  };

  const updateEmployee = (id: string, employee: Partial<User>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...employee } : e));
    addToast('Employee updated successfully!', 'success');
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    addToast('Employee deleted successfully!', 'info');
  };

  const addManager = (manager: Omit<User, 'id'>) => {
    const newManager: User = { ...manager, id: `m${Date.now()}` };
    setManagers(prev => [...prev, newManager]);
    addToast('Manager added successfully!', 'success');
  };

  const updateManager = (id: string, manager: Partial<User>) => {
    setManagers(prev => prev.map(m => m.id === id ? { ...m, ...manager } : m));
    addToast('Manager updated successfully!', 'success');
  };

  const deleteManager = (id: string) => {
    setManagers(prev => prev.filter(m => m.id !== id));
    addToast('Manager deleted successfully!', 'info');
  };

  const addSignupRequest = (request: Omit<SignupRequest, 'id' | 'appliedOn' | 'status'>) => {
    const newRequest: SignupRequest = {
      ...request,
      id: `sr${Date.now()}`,
      appliedOn: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setSignupRequests(prev => [newRequest, ...prev]);
    addToast('Signup request submitted! Awaiting admin approval.', 'info');
  };

  const approveSignupRequest = (requestId: string) => {
    const request = signupRequests.find(r => r.id === requestId);
    if (!request) return;

    // Create new employee from the request
    const newEmployee: User = {
      id: `e${Date.now()}`,
      email: request.email,
      password: request.password,
      name: request.fullName,
      role: 'employee',
      employeeId: `GS-EMP-${String(employees.length + 1).padStart(3, '0')}`,
      mobile: request.mobile,
      outletId: request.outletId,
    };

    // Add employee and update request
    setEmployees(prev => [...prev, newEmployee]);
    setLeaveBalances(prev => ({
      ...prev,
      [newEmployee.id]: { casual: 12, sick: 12, paid: 20, emergency: 5 }
    }));
    setSignupRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'approved' } : r));
    addToast(`${request.fullName}'s signup request approved!`, 'success');
  };

  const rejectSignupRequest = (requestId: string, remarks: string) => {
    setSignupRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected', remarks } : r));
    addToast('Signup request rejected!', 'info');
  };

  const addToast = (message: string, type: Toast['type']) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <AppContext.Provider value={{
      leaves, outlets, employees, managers, signupRequests, notifications, leaveBalances, toasts,
      addLeave, updateLeaveStatus, addOutlet, updateOutlet, deleteOutlet,
      addEmployee, updateEmployee, deleteEmployee,
      addManager, updateManager, deleteManager,
      addSignupRequest, approveSignupRequest, rejectSignupRequest,
      addToast, removeToast,
      markNotificationRead, darkMode, toggleDarkMode
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
