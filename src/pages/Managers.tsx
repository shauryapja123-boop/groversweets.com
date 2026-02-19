import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, Button, Input, Modal, Select, Badge, EmptyState, Table } from '../components/UI';
import { Users, Plus, Edit, Trash2, Search, Mail, Phone, Building2 } from 'lucide-react';
import { User } from '../types';

export const Managers: React.FC = () => {
  const { managers, outlets, addManager, updateManager, deleteManager } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [outletFilter, setOutletFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingManager, setEditingManager] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    employeeId: '',
    outletId: '',
    password: 'mgr123',
    role: 'manager' as const,
  });

  const filteredManagers = managers.filter(mgr => {
    if (outletFilter !== 'all' && mgr.outletId !== outletFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return mgr.name.toLowerCase().includes(query) ||
             mgr.email.toLowerCase().includes(query) ||
             mgr.employeeId.toLowerCase().includes(query);
    }
    return true;
  });

  const handleOpenModal = (mgr?: User) => {
    if (mgr) {
      setEditingManager(mgr);
      setFormData({
        name: mgr.name,
        email: mgr.email,
        mobile: mgr.mobile,
        employeeId: mgr.employeeId,
        outletId: mgr.outletId,
        password: mgr.password,
        role: 'manager',
      });
    } else {
      setEditingManager(null);
      // Generate unique manager ID by finding highest existing number
      const existingIds = managers
        .map(m => {
          const match = m.employeeId.match(/GS-MGR-(\d+)/);
          return match ? parseInt(match[1]) : 0;
        })
        .sort((a, b) => b - a);
      
      const nextNumber = (existingIds[0] || 0) + 1;
      const nextId = `GS-MGR-${String(nextNumber).padStart(3, '0')}`;
      
      setFormData({
        name: '',
        email: '',
        mobile: '',
        employeeId: nextId,
        outletId: outlets[0]?.id || '',
        password: 'mgr123',
        role: 'manager',
      });
    }
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.outletId) return;

    if (editingManager) {
      updateManager(editingManager.id, formData);
    } else {
      addManager(formData);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteManager(id);
    setDeleteConfirm(null);
  };

  const getOutletName = (outletId: string) => {
    const outlet = outlets.find(o => o.id === outletId);
    return outlet?.name.replace('Grover Sweets - ', '') || 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-maroon">Manager Management</h1>
          <p className="text-gray-600">Manage all managers across outlets</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Manager
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-maroon font-serif">{managers.length}</p>
            <p className="text-sm text-gray-600">Total Managers</p>
          </CardContent>
        </Card>
        {outlets.slice(0, 3).map(outlet => (
          <Card key={outlet.id}>
            <CardContent className="py-4 text-center">
              <p className="text-3xl font-bold text-gold font-serif">
                {managers.filter(m => m.outletId === outlet.id).length}
              </p>
              <p className="text-sm text-gray-600 truncate">{outlet.name.replace('Grover Sweets - ', '')}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
              />
            </div>
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

      {/* Managers Table */}
      <Card>
        {filteredManagers.length === 0 ? (
          <EmptyState
            icon={<Users size={32} />}
            title="No managers found"
            description={managers.length === 0 ? "Add your first manager to get started" : "No managers match your filters"}
            action={<Button onClick={() => handleOpenModal()}>Add Manager</Button>}
          />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <Table headers={['Manager', 'Contact', 'Outlet', 'Actions']}>
                {filteredManagers.map(mgr => (
                  <tr key={mgr.id} className="hover:bg-cream/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-maroon to-maroon-light flex items-center justify-center text-cream font-medium">
                          {mgr.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{mgr.name}</p>
                          <p className="text-xs text-gray-500">{mgr.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={12} /> {mgr.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={12} /> {mgr.mobile}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="info">{getOutletName(mgr.outletId)}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(mgr)}
                          className="p-2 text-gray-500 hover:text-maroon hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(mgr.id)}
                          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-100">
              {filteredManagers.map(mgr => (
                <div key={mgr.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-maroon to-maroon-light flex items-center justify-center text-cream font-bold">
                        {mgr.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{mgr.name}</p>
                        <p className="text-xs text-gray-500">{mgr.employeeId}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleOpenModal(mgr)}
                        className="p-2 text-gray-500 hover:text-maroon rounded-lg"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(mgr.id)}
                        className="p-2 text-gray-500 hover:text-red-500 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 size={14} />
                    <span>{getOutletName(mgr.outletId)}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingManager ? 'Edit Manager' : 'Add New Manager'}
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Manager name"
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="manager@groversweets.com"
          />
          <Input
            label="Mobile"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            placeholder="9876543210"
          />
          <Input
            label="Manager ID"
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            placeholder="GS-MGR-XXX"
          />
          <Select
            label="Assigned Outlet"
            value={formData.outletId}
            onChange={(e) => setFormData({ ...formData, outletId: e.target.value })}
            options={outlets.map(o => ({ value: o.id, label: o.name.replace('Grover Sweets - ', '') }))}
          />
          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Enter password"
          />

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="flex-1">
              {editingManager ? 'Save Changes' : 'Add Manager'}
            </Button>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Manager"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to delete this manager? This action cannot be undone.</p>
          <div className="flex gap-3">
            <Button variant="danger" onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="flex-1">
              Yes, Delete
            </Button>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
