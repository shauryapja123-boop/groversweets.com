import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Card, CardContent, Badge, Button, Select, Modal, Textarea, EmptyState } from '../components/UI';
import { FileText, Filter, Calendar, CheckCircle, XCircle, User, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Leave, LeaveStatus, LeaveType } from '../types';

export const LeaveRequests: React.FC = () => {
  const { user } = useAuth();
  const { leaves, outlets, updateLeaveStatus } = useApp();

  const [statusFilter, setStatusFilter] = useState<LeaveStatus | 'all'>('pending');
  const [typeFilter, setTypeFilter] = useState<LeaveType | 'all'>('all');
  const [outletFilter, setOutletFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [remarks, setRemarks] = useState('');
  const [processing, setProcessing] = useState(false);

  // Get leaves based on user role
  const accessibleLeaves = user?.role === 'admin' 
    ? leaves 
    : leaves.filter(l => l.outletId === user?.outletId);

  const filteredLeaves = accessibleLeaves.filter(leave => {
    if (statusFilter !== 'all' && leave.status !== statusFilter) return false;
    if (typeFilter !== 'all' && leave.type !== typeFilter) return false;
    if (outletFilter !== 'all' && leave.outletId !== outletFilter) return false;
    if (searchQuery && !leave.employeeName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleAction = async (action: 'approve' | 'reject') => {
    if (!selectedLeave) return;
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    updateLeaveStatus(selectedLeave.id, action === 'approve' ? 'approved' : 'rejected', remarks, user?.name || '');
    setProcessing(false);
    setSelectedLeave(null);
    setActionType(null);
    setRemarks('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge variant="success">Approved</Badge>;
      case 'rejected': return <Badge variant="danger">Rejected</Badge>;
      default: return <Badge variant="warning">Pending</Badge>;
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'casual': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'sick': return 'bg-red-100 text-red-700 border-red-200';
      case 'paid': return 'bg-green-100 text-green-700 border-green-200';
      case 'emergency': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const calculateDays = (start: string, end: string) => {
    return Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-maroon">Leave Requests</h1>
        <p className="text-gray-600">Review and manage employee leave applications</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-maroon font-serif">{accessibleLeaves.length}</p>
            <p className="text-sm text-gray-600">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-amber-500 font-serif">
              {accessibleLeaves.filter(l => l.status === 'pending').length}
            </p>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-green-500 font-serif">
              {accessibleLeaves.filter(l => l.status === 'approved').length}
            </p>
            <p className="text-sm text-gray-600">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-red-500 font-serif">
              {accessibleLeaves.filter(l => l.status === 'rejected').length}
            </p>
            <p className="text-sm text-gray-600">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-maroon">
              <Filter size={18} />
              <span className="font-medium">Filters</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                />
              </div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as LeaveStatus | 'all')}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'approved', label: 'Approved' },
                  { value: 'rejected', label: 'Rejected' },
                ]}
              />
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as LeaveType | 'all')}
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'casual', label: 'Casual' },
                  { value: 'sick', label: 'Sick' },
                  { value: 'paid', label: 'Paid' },
                  { value: 'emergency', label: 'Emergency' },
                ]}
              />
              {user?.role === 'admin' && (
                <Select
                  value={outletFilter}
                  onChange={(e) => setOutletFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Outlets' },
                    ...outlets.map(o => ({ value: o.id, label: o.name.replace('Grover Sweets - ', '') }))
                  ]}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leave Requests List */}
      <Card>
        {filteredLeaves.length === 0 ? (
          <EmptyState
            icon={<FileText size={32} />}
            title="No leave requests found"
            description="No requests match your current filters"
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredLeaves.map(leave => (
              <div key={leave.id} className="p-4 md:p-6 hover:bg-cream/30 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Employee Info */}
                  <div className="flex items-center gap-3 lg:w-48">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-maroon to-maroon-light flex items-center justify-center text-cream font-bold text-lg">
                      {leave.employeeName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{leave.employeeName}</p>
                      <p className="text-xs text-gray-500">{leave.outletName}</p>
                    </div>
                  </div>

                  {/* Leave Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getLeaveTypeColor(leave.type)}`}>
                        {leave.type}
                      </span>
                      {getStatusBadge(leave.status)}
                      <span className="text-sm text-gray-500">
                        {calculateDays(leave.startDate, leave.endDate)} day(s)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={14} />
                      {format(new Date(leave.startDate), 'MMM d')} - {format(new Date(leave.endDate), 'MMM d, yyyy')}
                    </div>
                    <p className="text-sm text-gray-600">{leave.reason}</p>
                    {leave.document && (
                      <p className="text-xs text-maroon">📎 {leave.document}</p>
                    )}
                    {leave.remarks && (
                      <p className={`text-sm italic p-2 rounded ${leave.status === 'approved' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        "{leave.remarks}" - {leave.reviewedBy}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  {leave.status === 'pending' && (
                    <div className="flex gap-2 lg:flex-col">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => { setSelectedLeave(leave); setActionType('approve'); }}
                        className="flex-1 lg:flex-none"
                      >
                        <CheckCircle size={16} /> Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => { setSelectedLeave(leave); setActionType('reject'); }}
                        className="flex-1 lg:flex-none"
                      >
                        <XCircle size={16} /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Action Modal */}
      <Modal
        open={!!actionType && !!selectedLeave}
        onClose={() => { setActionType(null); setSelectedLeave(null); setRemarks(''); }}
        title={actionType === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
      >
        {selectedLeave && (
          <div className="space-y-4">
            <div className="bg-cream rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <User size={16} className="text-maroon" />
                <span className="font-medium">{selectedLeave.employeeName}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Leave Type:</span>
                  <span className="ml-2 capitalize font-medium">{selectedLeave.type}</span>
                </div>
                <div>
                  <span className="text-gray-500">Duration:</span>
                  <span className="ml-2 font-medium">{calculateDays(selectedLeave.startDate, selectedLeave.endDate)} days</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Dates:</span>
                  <span className="ml-2">{format(new Date(selectedLeave.startDate), 'MMM d')} - {format(new Date(selectedLeave.endDate), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </div>

            <Textarea
              label="Remarks (Optional)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder={actionType === 'approve' 
                ? "Add a message for the employee..." 
                : "Please provide a reason for rejection..."
              }
              rows={3}
            />

            <div className="flex gap-3 pt-2">
              <Button
                variant={actionType === 'approve' ? 'secondary' : 'danger'}
                className="flex-1"
                onClick={() => handleAction(actionType!)}
                loading={processing}
              >
                {actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
              </Button>
              <Button
                variant="outline"
                onClick={() => { setActionType(null); setSelectedLeave(null); setRemarks(''); }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
