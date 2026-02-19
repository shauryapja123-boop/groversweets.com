import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, Button, Select, Badge } from '../components/UI';
import { BarChart3, Download, FileText, Calendar, Users, Building2, TrendingUp } from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

export const Reports: React.FC = () => {
  const { leaves, employees, outlets } = useApp();

  const [dateRange, setDateRange] = useState('all');
  const [outletFilter, setOutletFilter] = useState('all');

  const getFilteredLeaves = () => {
    let filtered = leaves;
    
    if (outletFilter !== 'all') {
      filtered = filtered.filter(l => l.outletId === outletFilter);
    }
    
    if (dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;
      
      switch (dateRange) {
        case 'thisMonth':
          startDate = startOfMonth(now);
          break;
        case 'lastMonth':
          startDate = startOfMonth(subMonths(now, 1));
          filtered = filtered.filter(l => new Date(l.appliedOn) <= endOfMonth(subMonths(now, 1)));
          break;
        case 'last3Months':
          startDate = subMonths(now, 3);
          break;
        case 'last6Months':
          startDate = subMonths(now, 6);
          break;
        default:
          startDate = new Date(0);
      }
      
      filtered = filtered.filter(l => new Date(l.appliedOn) >= startDate);
    }
    
    return filtered;
  };

  const filteredLeaves = getFilteredLeaves();
  const pendingCount = filteredLeaves.filter(l => l.status === 'pending').length;
  const approvedCount = filteredLeaves.filter(l => l.status === 'approved').length;
  const rejectedCount = filteredLeaves.filter(l => l.status === 'rejected').length;

  const leaveTypeStats = {
    casual: filteredLeaves.filter(l => l.type === 'casual').length,
    sick: filteredLeaves.filter(l => l.type === 'sick').length,
    paid: filteredLeaves.filter(l => l.type === 'paid').length,
    emergency: filteredLeaves.filter(l => l.type === 'emergency').length,
  };

  const outletStats = outlets.map(outlet => ({
    outlet,
    total: filteredLeaves.filter(l => l.outletId === outlet.id).length,
    approved: filteredLeaves.filter(l => l.outletId === outlet.id && l.status === 'approved').length,
    pending: filteredLeaves.filter(l => l.outletId === outlet.id && l.status === 'pending').length,
  }));

  const handleExportExcel = () => {
    // Create CSV content
    const headers = ['Employee', 'Outlet', 'Leave Type', 'Start Date', 'End Date', 'Reason', 'Status', 'Applied On'];
    const rows = filteredLeaves.map(l => [
      l.employeeName,
      l.outletName,
      l.type,
      l.startDate,
      l.endDate,
      `"${l.reason.replace(/"/g, '""')}"`,
      l.status,
      l.appliedOn
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leave-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    // Simple text report for PDF-like export
    const report = `
GROVER SWEETS - LEAVE REPORT
Generated: ${format(new Date(), 'MMMM d, yyyy HH:mm')}

SUMMARY
=======
Total Leave Requests: ${filteredLeaves.length}
Approved: ${approvedCount}
Pending: ${pendingCount}
Rejected: ${rejectedCount}

BY LEAVE TYPE
=============
Casual: ${leaveTypeStats.casual}
Sick: ${leaveTypeStats.sick}
Paid: ${leaveTypeStats.paid}
Emergency: ${leaveTypeStats.emergency}

BY OUTLET
=========
${outletStats.map(s => `${s.outlet.name.replace('Grover Sweets - ', '')}: ${s.total} total (${s.approved} approved, ${s.pending} pending)`).join('\n')}

DETAILED RECORDS
================
${filteredLeaves.map(l => `
Employee: ${l.employeeName}
Outlet: ${l.outletName}
Type: ${l.type}
Dates: ${l.startDate} to ${l.endDate}
Status: ${l.status}
Reason: ${l.reason}
---`).join('\n')}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leave-report-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'casual': return 'bg-blue-500';
      case 'sick': return 'bg-red-500';
      case 'paid': return 'bg-green-500';
      case 'emergency': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-maroon">Reports & Analytics</h1>
          <p className="text-gray-600">View leave statistics and export data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleExportExcel}>
            <Download size={18} /> Export Excel
          </Button>
          <Button onClick={handleExportPDF}>
            <FileText size={18} /> Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              options={[
                { value: 'all', label: 'All Time' },
                { value: 'thisMonth', label: 'This Month' },
                { value: 'lastMonth', label: 'Last Month' },
                { value: 'last3Months', label: 'Last 3 Months' },
                { value: 'last6Months', label: 'Last 6 Months' },
              ]}
              className="sm:w-48"
            />
            <Select
              value={outletFilter}
              onChange={(e) => setOutletFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Outlets' },
                ...outlets.map(o => ({ value: o.id, label: o.name.replace('Grover Sweets - ', '') }))
              ]}
              className="sm:w-48"
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-maroon/10 flex items-center justify-center">
              <FileText className="text-maroon" size={24} />
            </div>
            <p className="text-3xl font-bold text-maroon font-serif">{filteredLeaves.length}</p>
            <p className="text-sm text-gray-600">Total Requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="text-green-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-green-500 font-serif">{approvedCount}</p>
            <p className="text-sm text-gray-600">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Calendar className="text-amber-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-amber-500 font-serif">{pendingCount}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Users className="text-red-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-red-500 font-serif">{rejectedCount}</p>
            <p className="text-sm text-gray-600">Rejected</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leave Type Distribution */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="text-gold" size={20} />
              <h3 className="font-semibold text-maroon font-serif">Leave Type Distribution</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(leaveTypeStats).map(([type, count]) => {
                const percentage = filteredLeaves.length > 0 ? (count / filteredLeaves.length) * 100 : 0;
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="capitalize font-medium text-gray-700">{type}</span>
                      <span className="text-sm font-semibold text-gray-600">{count} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getLeaveTypeColor(type)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Visual Legend */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-4">
                {Object.entries(leaveTypeStats).map(([type, count]) => (
                  <div key={type} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getLeaveTypeColor(type)}`} />
                    <span className="text-sm text-gray-600 capitalize">{type}: {count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Outlet-wise Stats */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="text-gold" size={20} />
              <h3 className="font-semibold text-maroon font-serif">Outlet-wise Statistics</h3>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {outletStats.map(({ outlet, total, approved, pending }) => (
                <div key={outlet.id} className="p-4 hover:bg-cream/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">{outlet.name.replace('Grover Sweets - ', '')}</span>
                    <Badge variant="default">{total} total</Badge>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-green-600">✓ {approved} approved</span>
                    <span className="text-amber-600">⏳ {pending} pending</span>
                  </div>
                  {/* Mini progress bar */}
                  {total > 0 && (
                    <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden flex">
                      <div 
                        className="bg-green-500 h-full"
                        style={{ width: `${(approved / total) * 100}%` }}
                      />
                      <div 
                        className="bg-amber-500 h-full"
                        style={{ width: `${(pending / total) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approval Rate */}
      <Card className="bg-gradient-to-r from-gold/5 to-orange/5 border-gold/30">
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-maroon mb-1">Overall Approval Rate</h3>
              <p className="text-sm text-gray-600">Based on filtered leave requests</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-green-500 font-serif">
                  {filteredLeaves.length > 0 
                    ? ((approvedCount / (approvedCount + rejectedCount || 1)) * 100).toFixed(0)
                    : 0}%
                </p>
                <p className="text-sm text-gray-500">Approval Rate</p>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <p className="text-4xl font-bold text-gold font-serif">
                  {filteredLeaves.length > 0 
                    ? (filteredLeaves.reduce((acc, l) => {
                        const days = Math.ceil((new Date(l.endDate).getTime() - new Date(l.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
                        return acc + days;
                      }, 0))
                    : 0}
                </p>
                <p className="text-sm text-gray-500">Total Days</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Leave Takers */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-maroon font-serif">Top Leave Applicants</h3>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {Array.from(new Set(filteredLeaves.map(l => l.employeeId)))
              .map(empId => {
                const empLeaves = filteredLeaves.filter(l => l.employeeId === empId);
                const emp = employees.find(e => e.id === empId);
                const totalDays = empLeaves.reduce((acc, l) => {
                  return acc + Math.ceil((new Date(l.endDate).getTime() - new Date(l.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
                }, 0);
                return {
                  name: empLeaves[0]?.employeeName || emp?.name || 'Unknown',
                  outlet: empLeaves[0]?.outletName || 'Unknown',
                  count: empLeaves.length,
                  days: totalDays
                };
              })
              .sort((a, b) => b.count - a.count)
              .slice(0, 5)
              .map((emp, index) => (
                <div key={index} className="p-4 flex items-center justify-between hover:bg-cream/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      index === 0 ? 'bg-gold' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange' : 'bg-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{emp.name}</p>
                      <p className="text-xs text-gray-500">{emp.outlet}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-maroon">{emp.count} applications</p>
                    <p className="text-xs text-gray-500">{emp.days} total days</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
