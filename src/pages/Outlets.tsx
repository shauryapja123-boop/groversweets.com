import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, Button, Input, Modal, EmptyState } from '../components/UI';
import { Building2, Plus, Edit, Trash2, MapPin, Users, Search } from 'lucide-react';
import { Outlet } from '../types';
import { users } from '../data/mockData';

export const Outlets: React.FC = () => {
  const { outlets, addOutlet, updateOutlet, deleteOutlet } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState<Outlet | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    managerId: '',
    employeeCount: 0,
  });

  const managers = users.filter(u => u.role === 'manager');

  const filteredOutlets = outlets.filter(outlet =>
    outlet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    outlet.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (outlet?: Outlet) => {
    if (outlet) {
      setEditingOutlet(outlet);
      setFormData({
        name: outlet.name,
        address: outlet.address,
        city: outlet.city,
        managerId: outlet.managerId,
        employeeCount: outlet.employeeCount,
      });
    } else {
      setEditingOutlet(null);
      setFormData({ name: '', address: '', city: '', managerId: '', employeeCount: 0 });
    }
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.address || !formData.city) return;

    if (editingOutlet) {
      updateOutlet(editingOutlet.id, formData);
    } else {
      addOutlet(formData);
    }
    setModalOpen(false);
    setFormData({ name: '', address: '', city: '', managerId: '', employeeCount: 0 });
  };

  const handleDelete = (id: string) => {
    deleteOutlet(id);
    setDeleteConfirm(null);
  };

  const getManagerName = (managerId: string) => {
    const manager = managers.find(m => m.id === managerId);
    return manager?.name || 'Not Assigned';
  };

  // State for editing manager name
  const [managerModalOpen, setManagerModalOpen] = useState(false);
  const [managerEditOutlet, setManagerEditOutlet] = useState<Outlet | null>(null);
  const [customManagerName, setCustomManagerName] = useState('');
  const [managerSaveMsg, setManagerSaveMsg] = useState('');

  // Open manager name modal
  const handleOpenManagerModal = (outlet: Outlet) => {
    setManagerEditOutlet(outlet);
    setCustomManagerName(outlet.managerName || '');
    setManagerModalOpen(true);
  };

  // Save manager name to backend
  const handleSaveManagerName = async () => {
    if (!managerEditOutlet) return;
    setManagerSaveMsg('');
    try {
      const res = await fetch('/api/outlets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: managerEditOutlet.id, managerName: customManagerName })
      });
      if (!res.ok) throw new Error('Failed to update');
      setManagerSaveMsg('Manager name updated!');
      updateOutlet(managerEditOutlet.id, { managerName: customManagerName });
      setTimeout(() => setManagerModalOpen(false), 1000);
    } catch {
      setManagerSaveMsg('Error updating manager name');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-maroon">Outlet Management</h1>
          <p className="text-gray-600">Manage all Grover Sweets outlets</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Outlet
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="py-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search outlets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Outlets Grid */}
      {filteredOutlets.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Building2 size={32} />}
            title="No outlets found"
            description={outlets.length === 0 ? "Add your first outlet to get started" : "No outlets match your search"}
            action={<Button onClick={() => handleOpenModal()}>Add Outlet</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOutlets.map(outlet => (
            <Card key={outlet.id} hover>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-maroon to-maroon-light flex items-center justify-center">
                    <Building2 className="text-cream" size={24} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(outlet)}
                      className="p-2 text-gray-500 hover:text-maroon hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(outlet.id)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-lg text-maroon mb-1">
                  {outlet.name.replace('Grover Sweets - ', '')}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gold" />
                    <span>{outlet.address}, {outlet.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-gold" />
                    <span>{outlet.employeeCount} employees</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Manager</p>
                  <p className="font-medium text-gray-800">{outlet.managerName || getManagerName(outlet.managerId)}</p>
                  <Button size="sm" className="mt-2" onClick={() => handleOpenManagerModal(outlet)}>
                    Edit Manager Name
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingOutlet ? 'Edit Outlet' : 'Add New Outlet'}
      >
        <div className="space-y-4">
          <Input
            label="Outlet Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Grover Sweets - Sector 18"
          />
          <Input
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Street address"
          />
          <Input
            label="City"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="City name"
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Assign Manager</label>
            <select
              value={formData.managerId}
              onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
            >
              <option value="">Select Manager</option>
              {managers.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <Input
            label="Employee Count"
            type="number"
            value={formData.employeeCount}
            onChange={(e) => setFormData({ ...formData, employeeCount: parseInt(e.target.value) || 0 })}
            placeholder="0"
          />

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="flex-1">
              {editingOutlet ? 'Save Changes' : 'Add Outlet'}
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
        title="Delete Outlet"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to delete this outlet? This action cannot be undone.</p>
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

      {/* Manager Name Edit Modal */}
      <Modal
        open={managerModalOpen}
        onClose={() => setManagerModalOpen(false)}
        title="Edit Manager Name"
      >
        <div className="space-y-4">
          <input
            type="text"
            className="border rounded p-2 w-full"
            placeholder="Enter manager name"
            value={customManagerName}
            onChange={e => setCustomManagerName(e.target.value)}
          />
          <div className="flex gap-3">
            <Button onClick={handleSaveManagerName} className="flex-1">Save</Button>
            <Button variant="outline" onClick={() => setManagerModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
          {managerSaveMsg && <div className="text-green-700">{managerSaveMsg}</div>}
        </div>
      </Modal>
    </div>
  );
};
