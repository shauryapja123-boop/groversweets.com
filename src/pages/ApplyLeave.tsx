import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, Button, Select, Textarea } from '../components/UI';
import { Calendar, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { LeaveType } from '../types';

export const ApplyLeave: React.FC = () => {
  const { user } = useAuth();
  const { addLeave, leaveBalances, outlets } = useApp();
  const navigate = useNavigate();

  const [leaveType, setLeaveType] = useState<LeaveType>('casual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [document, setDocument] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const balance = leaveBalances[user?.id || ''] || { casual: 12, sick: 12, paid: 20, emergency: 5 };
  const outlet = outlets.find(o => o.id === user?.outletId);

  const leaveTypeOptions = [
    { value: 'casual', label: `Casual Leave (${balance.casual} days left)` },
    { value: 'sick', label: `Sick Leave (${balance.sick} days left)` },
    { value: 'paid', label: `Paid Leave (${balance.paid} days left)` },
    { value: 'emergency', label: `Emergency Leave (${balance.emergency} days left)` },
  ];

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!startDate) newErrors.startDate = 'Start date is required';
    if (!endDate) newErrors.endDate = 'End date is required';
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (!reason.trim()) newErrors.reason = 'Reason is required';
    if (reason.trim().length < 10) newErrors.reason = 'Please provide a detailed reason (min 10 characters)';

    const days = calculateDays();
    if (days > balance[leaveType]) {
      newErrors.leaveType = `Insufficient balance. You have only ${balance[leaveType]} ${leaveType} leave days`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call

    addLeave({
      employeeId: user?.id || '',
      employeeName: user?.name || '',
      outletId: user?.outletId || '',
      outletName: outlet?.name || '',
      type: leaveType,
      startDate,
      endDate,
      reason,
      status: 'pending',
      document: document?.name,
    });

    setLoading(false);
    navigate('/leave-history');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocument(e.target.files[0]);
    }
  };

  const days = calculateDays();

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-serif font-semibold text-maroon">Apply for Leave</h2>
          <p className="text-sm text-gray-600 mt-1">Fill in the details below to submit your leave application</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Leave Type */}
            <Select
              label="Leave Type"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as LeaveType)}
              options={leaveTypeOptions}
              error={errors.leaveType}
            />

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-2.5 rounded-xl border ${errors.startDate ? 'border-red-500' : 'border-gray-200'} focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
                {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-2.5 rounded-xl border ${errors.endDate ? 'border-red-500' : 'border-gray-200'} focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
                {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
              </div>
            </div>

            {/* Days Summary */}
            {days > 0 && (
              <div className={`p-4 rounded-xl ${days <= balance[leaveType] ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center gap-2">
                  {days <= balance[leaveType] ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <AlertCircle className="text-red-500" size={20} />
                  )}
                  <span className={`font-medium ${days <= balance[leaveType] ? 'text-green-700' : 'text-red-700'}`}>
                    {days} day{days > 1 ? 's' : ''} of leave requested
                  </span>
                </div>
                <p className={`text-sm mt-1 ${days <= balance[leaveType] ? 'text-green-600' : 'text-red-600'}`}>
                  {days <= balance[leaveType] 
                    ? `You have ${balance[leaveType]} ${leaveType} leave days available`
                    : `You only have ${balance[leaveType]} ${leaveType} leave days available`
                  }
                </p>
              </div>
            )}

            {/* Reason */}
            <Textarea
              label="Reason for Leave"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a detailed reason for your leave request..."
              rows={4}
              error={errors.reason}
            />

            {/* Document Upload */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Supporting Document (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-gold transition-colors">
                <input
                  type="file"
                  id="document"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <label htmlFor="document" className="cursor-pointer">
                  {document ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle size={24} />
                      <span className="font-medium">{document.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                      <p className="text-gray-600">Click to upload medical certificate or other documents</p>
                      <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG, DOC (Max 5MB)</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="submit" className="flex-1" loading={loading}>
                Submit Application
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1 sm:flex-none">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Leave Policy Info */}
      <Card className="mt-6 bg-gradient-to-r from-gold/5 to-orange/5 border-gold/20">
        <CardContent>
          <h3 className="font-semibold text-maroon mb-3">📋 Leave Policy Guidelines</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• <strong>Casual Leave:</strong> For personal work, requires 1 day advance notice</li>
            <li>• <strong>Sick Leave:</strong> Medical certificate required for 3+ days</li>
            <li>• <strong>Paid Leave:</strong> Annual vacation, apply at least 7 days in advance</li>
            <li>• <strong>Emergency Leave:</strong> Can be applied on same day, limited quota</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
