import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Card, CardContent, Badge, Button, Select, Table, EmptyState } from '../components/UI';
import { FileText, Filter, Calendar, Plus, Eye, X } from 'lucide-react';
import { format } from 'date-fns';
import { Leave, LeaveStatus, LeaveType } from '../types';

export const LeaveHistory: React.FC = () => {
  const { user } = useAuth();
  const { leaves } = useApp();

  const [statusFilter, setStatusFilter] = useState<LeaveStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<LeaveType | 'all'>('all');
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);

  const employeeLeaves = leaves.filter(l => l.employeeId === user?.id);

  const filteredLeaves = employeeLeaves.filter(leave => {
    if (statusFilter !== 'all' && leave.status !== statusFilter) return false;
    if (typeFilter !== 'all' && leave.type !== typeFilter) return false;
    return true;
  });

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-maroon">Leave History</h1>
          <p className="text-gray-600">View and track all your leave applications</p>
        </div>
        <Link to="/apply-leave">
          <Button>
            <Plus size={18} /> Apply Leave
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex items-center gap-2 text-maroon">
              <Filter size={18} />
              <span className="font-medium">Filters:</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leave Table */}
      <Card>
        {filteredLeaves.length === 0 ? (
          <EmptyState
            icon={<FileText size={32} />}
            title="No leave applications found"
            description={employeeLeaves.length === 0 
              ? "You haven't applied for any leaves yet"
              : "No leaves match your current filters"
            }
            action={
              <Link to="/apply-leave">
                <Button>Apply for Leave</Button>
              </Link>
            }
          />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table headers={['Leave Type', 'Duration', 'Days', 'Reason', 'Applied On', 'Status', 'Action']}>
                {filteredLeaves.map(leave => (
                  <tr key={leave.id} className="hover:bg-cream/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getLeaveTypeColor(leave.type)}`}>
                        {leave.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        {format(new Date(leave.startDate), 'MMM d')} - {format(new Date(leave.endDate), 'MMM d, yyyy')}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {calculateDays(leave.startDate, leave.endDate)} day{calculateDays(leave.startDate, leave.endDate) > 1 ? 's' : ''}
                    </td>
                    <td className="px-4 py-3 text-sm max-w-xs truncate">{leave.reason}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {format(new Date(leave.appliedOn), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(leave.status)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedLeave(leave)}
                        className="text-maroon hover:text-gold transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {filteredLeaves.map(leave => (
                <div key={leave.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getLeaveTypeColor(leave.type)}`}>
                      {leave.type}
                    </span>
                    {getStatusBadge(leave.status)}
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-gray-800">
                      {format(new Date(leave.startDate), 'MMM d')} - {format(new Date(leave.endDate), 'MMM d, yyyy')}
                    </p>
                    <p className="text-sm text-gray-600">{calculateDays(leave.startDate, leave.endDate)} day(s)</p>
                    <p className="text-sm text-gray-500 line-clamp-2">{leave.reason}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Applied: {format(new Date(leave.appliedOn), 'MMM d, yyyy')}</span>
                    <button
                      onClick={() => setSelectedLeave(leave)}
                      className="text-maroon font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* Leave Detail Modal */}
      {selectedLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedLeave(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gold/10 bg-gradient-to-r from-cream to-cream-light flex items-center justify-between">
              <h2 className="text-xl font-serif font-semibold text-maroon">Leave Details</h2>
              <button onClick={() => setSelectedLeave(null)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize border ${getLeaveTypeColor(selectedLeave.type)}`}>
                  {selectedLeave.type} Leave
                </span>
                {getStatusBadge(selectedLeave.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Start Date</p>
                  <p className="font-medium">{format(new Date(selectedLeave.startDate), 'MMMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">End Date</p>
                  <p className="font-medium">{format(new Date(selectedLeave.endDate), 'MMMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Days</p>
                  <p className="font-medium">{calculateDays(selectedLeave.startDate, selectedLeave.endDate)} day(s)</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Applied On</p>
                  <p className="font-medium">{format(new Date(selectedLeave.appliedOn), 'MMMM d, yyyy')}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Reason</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedLeave.reason}</p>
              </div>

              {selectedLeave.document && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Attached Document</p>
                  <p className="text-maroon font-medium">{selectedLeave.document}</p>
                </div>
              )}

              {selectedLeave.remarks && (
                <div className={`p-4 rounded-lg ${selectedLeave.status === 'approved' ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className="text-xs text-gray-500 mb-1">Manager Remarks</p>
                  <p className={selectedLeave.status === 'approved' ? 'text-green-700' : 'text-red-700'}>
                    "{selectedLeave.remarks}"
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    By {selectedLeave.reviewedBy} on {selectedLeave.reviewedOn && format(new Date(selectedLeave.reviewedOn), 'MMM d, yyyy')}
                  </p>
                </div>
              )}

              <Button onClick={() => setSelectedLeave(null)} className="w-full" variant="outline">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
