import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Card, CardContent, Badge } from '../components/UI';
import { Users, Mail, Phone, Building2 } from 'lucide-react';

export const Team: React.FC = () => {
  const { user } = useAuth();
  const { employees, outlets, leaves, leaveBalances } = useApp();

  const outlet = outlets.find(o => o.id === user?.outletId);
  const teamMembers = employees.filter(e => e.outletId === user?.outletId);

  const getEmployeeLeaveStats = (empId: string) => {
    const empLeaves = leaves.filter(l => l.employeeId === empId);
    return {
      total: empLeaves.length,
      pending: empLeaves.filter(l => l.status === 'pending').length,
      approved: empLeaves.filter(l => l.status === 'approved').length,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-maroon">Team Overview</h1>
        <div className="flex items-center gap-2 text-gray-600 mt-1">
          <Building2 size={16} />
          <span>{outlet?.name}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-maroon font-serif">{teamMembers.length}</p>
            <p className="text-sm text-gray-600">Team Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-amber-500 font-serif">
              {leaves.filter(l => l.outletId === user?.outletId && l.status === 'pending').length}
            </p>
            <p className="text-sm text-gray-600">Pending Leaves</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-green-500 font-serif">
              {leaves.filter(l => l.outletId === user?.outletId && l.status === 'approved').length}
            </p>
            <p className="text-sm text-gray-600">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-red-500 font-serif">
              {leaves.filter(l => l.outletId === user?.outletId && l.status === 'rejected').length}
            </p>
            <p className="text-sm text-gray-600">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map(member => {
          const stats = getEmployeeLeaveStats(member.id);
          const balance = leaveBalances[member.id] || { casual: 0, sick: 0, paid: 0, emergency: 0 };
          
          return (
            <Card key={member.id} hover>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-maroon to-maroon-light flex items-center justify-center text-cream font-bold text-xl">
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{member.name}</h3>
                    <p className="text-xs text-gray-500">{member.employeeId}</p>
                    
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={12} className="text-gold shrink-0" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={12} className="text-gold shrink-0" />
                        <span>{member.mobile}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Leave Stats */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500 font-medium">Leave Applications</span>
                    <div className="flex gap-2">
                      {stats.pending > 0 && (
                        <Badge variant="warning">{stats.pending} pending</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-3 text-xs">
                    <div className="flex-1 text-center p-2 bg-gray-50 rounded-lg">
                      <p className="font-bold text-gray-800">{stats.total}</p>
                      <p className="text-gray-500">Total</p>
                    </div>
                    <div className="flex-1 text-center p-2 bg-green-50 rounded-lg">
                      <p className="font-bold text-green-600">{stats.approved}</p>
                      <p className="text-gray-500">Approved</p>
                    </div>
                  </div>
                </div>

                {/* Leave Balance */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 font-medium mb-2">Leave Balance</p>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="text-center p-1.5 bg-blue-50 rounded">
                      <p className="font-bold text-blue-600">{balance.casual}</p>
                      <p className="text-blue-500">CL</p>
                    </div>
                    <div className="text-center p-1.5 bg-red-50 rounded">
                      <p className="font-bold text-red-600">{balance.sick}</p>
                      <p className="text-red-500">SL</p>
                    </div>
                    <div className="text-center p-1.5 bg-green-50 rounded">
                      <p className="font-bold text-green-600">{balance.paid}</p>
                      <p className="text-green-500">PL</p>
                    </div>
                    <div className="text-center p-1.5 bg-orange-50 rounded">
                      <p className="font-bold text-orange-600">{balance.emergency}</p>
                      <p className="text-orange-500">EL</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {teamMembers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No team members found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
