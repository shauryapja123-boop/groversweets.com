import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, Button, Modal, Badge, EmptyState } from '../components/UI';
import { Mail, Phone, CheckCircle, XCircle, Building2, User } from 'lucide-react';

export const SignupRequests: React.FC = () => {
  const { signupRequests, outlets, approveSignupRequest, rejectSignupRequest } = useApp();
  const [rejectionRemarks, setRejectionRemarks] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const pendingRequests = signupRequests.filter(r => r.status === 'pending');
  const approvedRequests = signupRequests.filter(r => r.status === 'approved');
  const rejectedRequests = signupRequests.filter(r => r.status === 'rejected');

  const getOutletName = (outletId: string) => {
    const outlet = outlets.find(o => o.id === outletId);
    return outlet?.name.replace('Grover Sweets - ', '') || 'Unknown';
  };

  const handleReject = () => {
    if (rejectingId && rejectionRemarks.trim()) {
      rejectSignupRequest(rejectingId, rejectionRemarks);
      setRejectingId(null);
      setRejectionRemarks('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-maroon">Signup Requests</h1>
        <p className="text-gray-600">Review and approve new employee signup requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-orange font-serif">{pendingRequests.length}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-green-600 font-serif">{approvedRequests.length}</p>
            <p className="text-sm text-gray-600">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-red-600 font-serif">{rejectedRequests.length}</p>
            <p className="text-sm text-gray-600">Rejected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-maroon font-serif">{signupRequests.length}</p>
            <p className="text-sm text-gray-600">Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <div className="px-6 py-4 border-b border-gold/10 bg-gradient-to-r from-cream to-cream-light">
            <h2 className="text-lg font-semibold text-maroon font-serif">Pending Approval ({pendingRequests.length})</h2>
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {pendingRequests.map(request => (
                <div key={request.id} className="p-4 hover:bg-cream/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-maroon to-maroon-light flex items-center justify-center text-cream font-bold">
                        {request.fullName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{request.fullName}</p>
                        <p className="text-xs text-gray-500">Applied on {request.appliedOn}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => approveSignupRequest(request.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle size={16} /> Approve
                      </Button>
                      <Button
                        onClick={() => setRejectingId(request.id)}
                        size="sm"
                        variant="danger"
                      >
                        <XCircle size={16} /> Reject
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="flex items-center gap-2 text-gray-800 truncate">
                        <Mail size={14} /> {request.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Mobile</p>
                      <p className="flex items-center gap-2 text-gray-800">
                        <Phone size={14} /> {request.mobile}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Outlet</p>
                      <p className="flex items-center gap-2 text-gray-800">
                        <Building2 size={14} /> {getOutletName(request.outletId)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Designation</p>
                      <p className="text-gray-800">{request.designation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approved Requests */}
      {approvedRequests.length > 0 && (
        <Card>
          <div className="px-6 py-4 border-b border-gold/10 bg-gradient-to-r from-green-50 to-emerald-50">
            <h2 className="text-lg font-semibold text-green-800 font-serif">Approved ({approvedRequests.length})</h2>
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {approvedRequests.map(request => (
                <div key={request.id} className="p-4 flex items-center justify-between hover:bg-green-50/50">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold flex-shrink-0">
                      {request.fullName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{request.fullName}</p>
                      <p className="text-xs text-gray-500">{request.email}</p>
                    </div>
                  </div>
                  <Badge variant="success">Approved</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rejected Requests */}
      {rejectedRequests.length > 0 && (
        <Card>
          <div className="px-6 py-4 border-b border-gold/10 bg-gradient-to-r from-red-50 to-rose-50">
            <h2 className="text-lg font-semibold text-red-800 font-serif">Rejected ({rejectedRequests.length})</h2>
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {rejectedRequests.map(request => (
                <div key={request.id} className="p-4 flex items-center justify-between hover:bg-red-50/50">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold flex-shrink-0">
                      {request.fullName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{request.fullName}</p>
                      {request.remarks && <p className="text-xs text-red-600">{request.remarks}</p>}
                    </div>
                  </div>
                  <Badge variant="danger">Rejected</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {signupRequests.length === 0 && (
        <Card>
          <EmptyState
            icon={<User size={32} />}
            title="No signup requests"
            description="All new employee requests will appear here for your review and approval."
          />
        </Card>
      )}

      {/* Rejection Modal */}
      <Modal
        open={!!rejectingId}
        onClose={() => {
          setRejectingId(null);
          setRejectionRemarks('');
        }}
        title="Reject Signup Request"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Please provide a reason for rejection:</p>
          <textarea
            value={rejectionRemarks}
            onChange={(e) => setRejectionRemarks(e.target.value)}
            placeholder="Reason for rejection..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
            rows={4}
          />
          <div className="flex gap-3">
            <Button onClick={handleReject} variant="danger" className="flex-1">
              Reject
            </Button>
            <Button
              onClick={() => {
                setRejectingId(null);
                setRejectionRemarks('');
              }}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
