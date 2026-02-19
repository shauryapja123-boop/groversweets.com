import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Card, CardContent, StatCard, Badge, Button } from '../components/UI';
import { Calendar, Clock, CheckCircle, XCircle, Plus, FileText } from 'lucide-react';
import { format } from 'date-fns';

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const { leaves, leaveBalances, outlets } = useApp();

  const employeeLeaves = leaves.filter(l => l.employeeId === user?.id);
  const balance = leaveBalances[user?.id || ''] || { casual: 0, sick: 0, paid: 0, emergency: 0 };
  const outlet = outlets.find(o => o.id === user?.outletId);
  const recentLeaves = employeeLeaves.slice(0, 5);
  const pendingCount = employeeLeaves.filter(l => l.status === 'pending').length;

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
            <h1 className="text-2xl font-serif font-bold mb-1">Hello, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-cream/80">
              {outlet?.name} • Employee ID: {user?.employeeId}
            </p>
          </div>
          <Link to="/apply-leave">
            <Button variant="secondary" size="lg">
              <Plus size={18} /> Apply Leave
            </Button>
          </Link>
        </div>
      </div>

      {/* Leave Balance Cards */}
      <div>
        <h2 className="text-lg font-semibold text-maroon mb-4 font-serif">Leave Balance</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Casual Leave"
            value={balance.casual}
            icon={<Calendar size={24} />}
            color="maroon"
          />
          <StatCard
            title="Sick Leave"
            value={balance.sick}
            icon={<Clock size={24} />}
            color="orange"
          />
          <StatCard
            title="Paid Leave"
            value={balance.paid}
            icon={<CheckCircle size={24} />}
            color="green"
          />
          <StatCard
            title="Emergency"
            value={balance.emergency}
            icon={<XCircle size={24} />}
            color="gold"
          />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="text-center py-4">
            <div className="text-3xl font-bold text-maroon font-serif">{employeeLeaves.length}</div>
            <p className="text-sm text-gray-600">Total Applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-4">
            <div className="text-3xl font-bold text-amber-500 font-serif">{pendingCount}</div>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-4">
            <div className="text-3xl font-bold text-green-500 font-serif">
              {employeeLeaves.filter(l => l.status === 'approved').length}
            </div>
            <p className="text-sm text-gray-600">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-4">
            <div className="text-3xl font-bold text-red-500 font-serif">
              {employeeLeaves.filter(l => l.status === 'rejected').length}
            </div>
            <p className="text-sm text-gray-600">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leave Applications */}
      <Card>
        <div className="px-6 py-4 border-b border-gold/10 flex items-center justify-between bg-gradient-to-r from-cream to-cream-light">
          <h2 className="text-lg font-semibold text-maroon font-serif">Recent Leave Applications</h2>
          <Link to="/leave-history" className="text-sm text-gold hover:text-gold-dark font-medium">
            View All →
          </Link>
        </div>
        <CardContent className="p-0">
          {recentLeaves.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No leave applications yet</p>
              <Link to="/apply-leave">
                <Button variant="outline" className="mt-4" size="sm">
                  Apply for Leave
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentLeaves.map(leave => (
                <div key={leave.id} className="p-4 hover:bg-cream/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getLeaveTypeColor(leave.type)}`}>
                        {leave.type}
                      </span>
                      <div>
                        <p className="font-medium text-gray-800">
                          {format(new Date(leave.startDate), 'MMM d')} - {format(new Date(leave.endDate), 'MMM d, yyyy')}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-1">{leave.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(leave.status)}
                      <span className="text-xs text-gray-400">
                        Applied: {format(new Date(leave.appliedOn), 'MMM d')}
                      </span>
                    </div>
                  </div>
                  {leave.remarks && (
                    <p className="mt-2 text-sm text-gray-600 italic bg-gray-50 p-2 rounded-lg">
                      "{leave.remarks}" - {leave.reviewedBy}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="bg-gradient-to-r from-gold/10 to-orange/10 border-gold/30">
        <CardContent>
          <h3 className="font-semibold text-maroon mb-3">💡 Quick Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Apply for planned leaves at least 3 days in advance</li>
            <li>• Upload medical documents for sick leaves exceeding 2 days</li>
            <li>• Emergency leaves can be applied on the same day</li>
            <li>• Check your leave balance before applying</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
