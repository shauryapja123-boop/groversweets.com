import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Card, CardContent, StatCard, Badge } from '../components/UI';
import { Users, Building2, Clock, CheckCircle, XCircle, BarChart3, FileText, TrendingUp, UserPlus } from 'lucide-react';
import { format } from 'date-fns';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { leaves, employees, outlets, signupRequests, updateEmployee, addToast } = useApp();

  const pendingLeaves = leaves.filter(l => l.status === 'pending');
  const approvedLeaves = leaves.filter(l => l.status === 'approved');
  const rejectedLeaves = leaves.filter(l => l.status === 'rejected');
  const pendingSignups = signupRequests.filter(r => r.status === 'pending');
  const recentLeaves = leaves.slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge variant="success">Approved</Badge>;
      case 'rejected': return <Badge variant="danger">Rejected</Badge>;
      default: return <Badge variant="warning">Pending</Badge>;
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'casual': return 'bg-blue-100 text-blue-700';
      case 'sick': return 'bg-red-100 text-red-700';
      case 'paid': return 'bg-green-100 text-green-700';
      case 'emergency': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const leavesByOutlet = outlets.map(outlet => ({
    outlet,
    total: leaves.filter(l => l.outletId === outlet.id).length,
    pending: leaves.filter(l => l.outletId === outlet.id && l.status === 'pending').length,
  }));

  const handleToggleActive = (id: string, current?: boolean) => {
    const newStatus = !current;
    updateEmployee(id, { active: newStatus });
    addToast(`Employee ${newStatus ? 'activated' : 'deactivated'}`, newStatus ? 'success' : 'info');
  };

  // Admin-only: Allocate leave balances
  const [selectedUser, setSelectedUser] = React.useState('');
  const [balance, setBalance] = React.useState({ casual: 0, sick: 0, paid: 0, emergency: 0 });
  const [allocMsg, setAllocMsg] = React.useState('');

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBalance({ ...balance, [e.target.name]: Number(e.target.value) });
  };

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAllocMsg('');
    try {
      const res = await fetch('/api/leaveBalances', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser, balance })
      });
      if (!res.ok) throw new Error('Failed to update');
      setAllocMsg('Leave balance updated!');
    } catch {
      setAllocMsg('Error updating leave balance');
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-maroon via-maroon-light to-maroon rounded-2xl p-6 text-cream shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
        <div className="relative">
          <h1 className="text-2xl font-serif font-bold mb-1">Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-cream/80">Admin Dashboard - Complete overview of all outlets</p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Outlets"
          value={outlets.length}
          icon={<Building2 size={24} />}
          color="maroon"
        />
        <StatCard
          title="Total Employees"
          value={employees.length}
          icon={<Users size={24} />}
          color="gold"
        />
        <StatCard
          title="Pending Leaves"
          value={pendingLeaves.length}
          icon={<Clock size={24} />}
          color="orange"
        />
        <StatCard
          title="Approved"
          value={approvedLeaves.length}
          icon={<CheckCircle size={24} />}
          color="green"
        />
        <StatCard
          title="Rejected"
          value={rejectedLeaves.length}
          icon={<XCircle size={24} />}
          color="maroon"
        />
        <StatCard
          title="Signup Requests"
          value={pendingSignups.length}
          icon={<UserPlus size={24} />}
          color="gold"
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Link to="/outlets" className="block">
          <Card hover className="h-full">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="w-12 h-12 rounded-xl bg-maroon/10 flex items-center justify-center">
                <Building2 className="text-maroon" size={24} />
              </div>
              <div>
                <p className="font-semibold text-maroon">Outlets</p>
                <p className="text-sm text-gray-500">Manage</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/employees" className="block">
          <Card hover className="h-full">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                <Users className="text-gold" size={24} />
              </div>
              <div>
                <p className="font-semibold text-maroon">Employees</p>
                <p className="text-sm text-gray-500">Manage</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/managers" className="block">
          <Card hover className="h-full">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center">
                <Users className="text-orange" size={24} />
              </div>
              <div>
                <p className="font-semibold text-maroon">Managers</p>
                <p className="text-sm text-gray-500">Manage</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/leave-requests" className="block">
          <Card hover className="h-full">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center">
                <FileText className="text-orange" size={24} />
              </div>
              <div>
                <p className="font-semibold text-maroon">Leave Requests</p>
                <p className="text-sm text-gray-500">{pendingLeaves.length} pending</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/signup-requests" className="block">
          <Card hover className="h-full">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <UserPlus className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="font-semibold text-maroon">Signup Requests</p>
                <p className="text-sm text-gray-500">{pendingSignups.length} pending</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/reports" className="block">
          <Card hover className="h-full">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <BarChart3 className="text-green-600" size={24} />
              </div>
              <div>
                <p className="font-semibold text-maroon">Reports</p>
                <p className="text-sm text-gray-500">View & Export</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outlets Overview */}
        <Card>
          <div className="px-6 py-4 border-b border-gold/10 flex items-center justify-between bg-gradient-to-r from-cream to-cream-light">
            <h2 className="text-lg font-semibold text-maroon font-serif">Outlets Overview</h2>
            <Link to="/outlets" className="text-sm text-gold hover:text-gold-dark font-medium">
              View All →
            </Link>
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {leavesByOutlet.map(({ outlet, total, pending }) => (
                <div key={outlet.id} className="p-4 flex items-center justify-between hover:bg-cream/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-maroon to-maroon-light flex items-center justify-center">
                      <Building2 size={18} className="text-cream" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{outlet.name.replace('Grover Sweets - ', '')}</p>
                      <p className="text-xs text-gray-500">{outlet.employeeCount} employees</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-maroon">{total} leaves</p>
                    {pending > 0 && (
                      <p className="text-xs text-amber-600">{pending} pending</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leave Type Distribution */}
        <Card>
          <div className="px-6 py-4 border-b border-gold/10 bg-gradient-to-r from-cream to-cream-light">
            <h2 className="text-lg font-semibold text-maroon font-serif">Leave Distribution</h2>
          </div>
          <CardContent>
            <div className="space-y-4">
              {['casual', 'sick', 'paid', 'emergency'].map(type => {
                const typeLeaves = leaves.filter(l => l.type === type);
                const percentage = leaves.length > 0 ? (typeLeaves.length / leaves.length) * 100 : 0;
                
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="capitalize font-medium text-gray-700">{type}</span>
                      <span className="text-sm text-gray-500">{typeLeaves.length} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          type === 'casual' ? 'bg-blue-500' :
                          type === 'sick' ? 'bg-red-500' :
                          type === 'paid' ? 'bg-green-500' : 'bg-orange'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leave Requests */}
      <Card>
        <div className="px-6 py-4 border-b border-gold/10 flex items-center justify-between bg-gradient-to-r from-cream to-cream-light">
          <h2 className="text-lg font-semibold text-maroon font-serif">Recent Leave Requests</h2>
          <Link to="/leave-requests" className="text-sm text-gold hover:text-gold-dark font-medium">
            View All →
          </Link>
        </div>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {recentLeaves.map(leave => (
              <div key={leave.id} className="p-4 hover:bg-cream/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-maroon font-bold">
                      {leave.employeeName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{leave.employeeName}</p>
                      <p className="text-xs text-gray-500">{leave.outletName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getLeaveTypeColor(leave.type)}`}>
                      {leave.type}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(leave.startDate), 'MMM d')} - {format(new Date(leave.endDate), 'MMM d')}
                    </span>
                    {getStatusBadge(leave.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Employees (Active / Inactive) */}
      <Card>
        <div className="px-6 py-4 border-b border-gold/10 flex items-center justify-between bg-gradient-to-r from-cream to-cream-light">
          <h2 className="text-lg font-semibold text-maroon font-serif">Employees (Active / Inactive)</h2>
          <Link to="/employees" className="text-sm text-gold hover:text-gold-dark font-medium">Manage →</Link>
        </div>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {employees.map(emp => {
              const isActive = emp.active ?? true;
              return (
                <div key={emp.id} className="p-4 flex items-center justify-between hover:bg-cream/50">
                  <div>
                    <p className="font-medium text-gray-800">{emp.name} <span className="text-xs text-gray-500">{`(${emp.employeeId})`}</span></p>
                    <p className="text-xs text-gray-500">{emp.mobile}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{isActive ? 'Active' : 'Inactive'}</span>
                    <button onClick={() => handleToggleActive(emp.id, emp.active)} className={`px-3 py-1 rounded text-sm ${isActive ? 'bg-red-500 text-white' : 'bg-green-600 text-white'}`}>
                      {isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
            <TrendingUp className="text-white" size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-green-800">System Status: All Good!</h3>
            <p className="text-sm text-green-600">All services are running smoothly. Last updated: {format(new Date(), 'MMM d, yyyy HH:mm')}</p>
          </div>
        </CardContent>
      </Card>

      {/* Admin: Allocate Leave Balances */}
      <div className="bg-white rounded-xl shadow p-6 mt-8">
        <h2 className="text-lg font-bold mb-2">Allocate Leave Balances (Admin Only)</h2>
        <form className="flex flex-col gap-2 md:flex-row md:items-end" onSubmit={handleAllocate}>
          <select
            className="border rounded p-2 mr-2"
            value={selectedUser}
            onChange={e => setSelectedUser(e.target.value)}
            required
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name} ({emp.employeeId})</option>
            ))}
          </select>
          <input type="number" name="casual" min="0" placeholder="Casual" className="border rounded p-2 w-20" value={balance.casual} onChange={handleBalanceChange} required />
          <input type="number" name="sick" min="0" placeholder="Sick" className="border rounded p-2 w-20" value={balance.sick} onChange={handleBalanceChange} required />
          <input type="number" name="paid" min="0" placeholder="Paid" className="border rounded p-2 w-20" value={balance.paid} onChange={handleBalanceChange} required />
          <input type="number" name="emergency" min="0" placeholder="Emergency" className="border rounded p-2 w-24" value={balance.emergency} onChange={handleBalanceChange} required />
          <button type="submit" className="bg-maroon text-white px-4 py-2 rounded ml-2">Allocate</button>
        </form>
        {allocMsg && <div className="mt-2 text-green-700">{allocMsg}</div>}
      </div>
    </div>
  );
};
