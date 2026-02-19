import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Card, CardContent, StatCard, Badge, Button } from '../components/UI';
import { Users, Clock, CheckCircle, XCircle, FileText, Building2 } from 'lucide-react';
import { format } from 'date-fns';

export const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { leaves, employees, outlets } = useApp();

  const outlet = outlets.find(o => o.id === user?.outletId);
  const outletEmployees = employees.filter(e => e.outletId === user?.outletId);
  const outletLeaves = leaves.filter(l => l.outletId === user?.outletId);
  
  const pendingLeaves = outletLeaves.filter(l => l.status === 'pending');
  const approvedLeaves = outletLeaves.filter(l => l.status === 'approved');
  const rejectedLeaves = outletLeaves.filter(l => l.status === 'rejected');
  const recentLeaves = pendingLeaves.slice(0, 5);

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

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-maroon to-maroon-light rounded-2xl p-6 text-cream shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold mb-1">Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
            <div className="flex items-center gap-2 text-cream/80">
              <Building2 size={16} />
              <span>{outlet?.name}</span>
            </div>
          </div>
          <Link to="/leave-requests">
            <Button variant="secondary" size="lg">
              <FileText size={18} /> View All Requests
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Team Members"
          value={outletEmployees.length}
          icon={<Users size={24} />}
          color="maroon"
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
          color="gold"
        />
      </div>

      {/* Leave Type Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="px-6 py-4 border-b border-gold/10 bg-gradient-to-r from-cream to-cream-light">
            <h2 className="text-lg font-semibold text-maroon font-serif">Leave Type Summary</h2>
          </div>
          <CardContent>
            <div className="space-y-4">
              {['casual', 'sick', 'paid', 'emergency'].map(type => {
                const typeLeaves = outletLeaves.filter(l => l.type === type);
                const pending = typeLeaves.filter(l => l.status === 'pending').length;
                const approved = typeLeaves.filter(l => l.status === 'approved').length;
                
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${getLeaveTypeColor(type).replace('text', 'bg').split(' ')[0]}`} />
                      <span className="capitalize font-medium text-gray-700">{type}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-amber-600">{pending} pending</span>
                      <span className="text-green-600">{approved} approved</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <div className="px-6 py-4 border-b border-gold/10 bg-gradient-to-r from-cream to-cream-light">
            <h2 className="text-lg font-semibold text-maroon font-serif">Team Members</h2>
          </div>
          <CardContent className="p-0 max-h-64 overflow-y-auto">
            {outletEmployees.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No team members</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {outletEmployees.map(emp => {
                  const empLeaves = outletLeaves.filter(l => l.employeeId === emp.id);
                  const empPending = empLeaves.filter(l => l.status === 'pending').length;
                  
                  return (
                    <div key={emp.id} className="p-4 flex items-center justify-between hover:bg-cream/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-maroon to-maroon-light flex items-center justify-center text-cream font-medium">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{emp.name}</p>
                          <p className="text-xs text-gray-500">{emp.employeeId}</p>
                        </div>
                      </div>
                      {empPending > 0 && (
                        <Badge variant="warning">{empPending} pending</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pending Leave Requests */}
      <Card>
        <div className="px-6 py-4 border-b border-gold/10 flex items-center justify-between bg-gradient-to-r from-cream to-cream-light">
          <div>
            <h2 className="text-lg font-semibold text-maroon font-serif">Pending Leave Requests</h2>
            <p className="text-sm text-gray-600">Requires your attention</p>
          </div>
          <Link to="/leave-requests" className="text-sm text-gold hover:text-gold-dark font-medium">
            View All →
          </Link>
        </div>
        <CardContent className="p-0">
          {recentLeaves.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle size={48} className="mx-auto mb-4 text-green-300" />
              <p className="font-medium text-green-600">All caught up!</p>
              <p className="text-sm">No pending leave requests</p>
            </div>
          ) : (
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
                        <p className="text-sm text-gray-500">
                          {format(new Date(leave.startDate), 'MMM d')} - {format(new Date(leave.endDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getLeaveTypeColor(leave.type)}`}>
                        {leave.type}
                      </span>
                      {getStatusBadge(leave.status)}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 ml-13 pl-13">{leave.reason}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/leave-requests" className="block">
          <Card hover className="h-full">
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center">
                <Clock className="text-orange" size={24} />
              </div>
              <div>
                <p className="font-semibold text-maroon">Review Requests</p>
                <p className="text-sm text-gray-500">{pendingLeaves.length} pending</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/team" className="block">
          <Card hover className="h-full">
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-maroon/10 flex items-center justify-center">
                <Users className="text-maroon" size={24} />
              </div>
              <div>
                <p className="font-semibold text-maroon">Team Overview</p>
                <p className="text-sm text-gray-500">{outletEmployees.length} members</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card hover className="h-full">
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Building2 className="text-green-600" size={24} />
            </div>
            <div>
              <p className="font-semibold text-maroon">Outlet Info</p>
              <p className="text-sm text-gray-500">{outlet?.city}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
