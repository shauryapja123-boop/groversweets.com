import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, Button, Input, Modal, Select, Badge, EmptyState, Table } from '../components/UI';
import { Users, Plus, Edit, Trash2, Search, Mail, Phone, Building2 } from 'lucide-react';
import { User } from '../types';

export const Employees: React.FC = () => {
  const { employees, outlets, addEmployee, updateEmployee, deleteEmployee, leaveBalances } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [outletFilter, setOutletFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    employeeId: '',
    outletId: '',
    password: 'emp123',
    role: 'employee' as const,
  });

  const filteredEmployees = employees.filter(emp => {
    if (outletFilter !== 'all' && emp.outletId !== outletFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return emp.name.toLowerCase().includes(query) ||
             emp.email.toLowerCase().includes(query) ||
             emp.employeeId.toLowerCase().includes(query);
    }
    return true;
  });

  const handleOpenModal = (emp?: User) => {
    if (emp) {
      setEditingEmployee(emp);
      setFormData({
        name: emp.name,
        email: emp.email,
        mobile: emp.mobile,
        employeeId: emp.employeeId,
        outletId: emp.outletId,
        password: emp.password,
        role: 'employee',
      });
    } else {
      setEditingEmployee(null);
      const nextId = `GS-EMP-${String(employees.length + 1).padStart(3, '0')}`;
      setFormData({
        name: '',
        email: '',
        mobile: '',
        employeeId: nextId,
        outletId: outlets[0]?.id || '',
        password: 'emp123',
        role: 'employee',
      });
    }
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.outletId) return;

    if (editingEmployee) {
      updateEmployee(editingEmployee.id, formData);
    } else {
      addEmployee(formData);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteEmployee(id);
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
          <h1 className="text-2xl font-serif font-bold text-maroon">Employee Management</h1>
          <p className="text-gray-600">Manage all employees across outlets</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Employee
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-maroon font-serif">{employees.length}</p>
            <p className="text-sm text-gray-600">Total Employees</p>
          </CardContent>
        </Card>
        {outlets.slice(0, 3).map(outlet => (
          <Card key={outlet.id}>
            <CardContent className="py-4 text-center">
              <p className="text-3xl font-bold text-gold font-serif">
                {employees.filter(e => e.outletId === outlet.id).length}
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

      {/* Employees Table */}
      <Card>
        {filteredEmployees.length === 0 ? (
          <EmptyState
            icon={<Users size={32} />}
            title="No employees found"
            description={employees.length === 0 ? "Add your first employee to get started" : "No employees match your filters"}
            action={<Button onClick={() => handleOpenModal()}>Add Employee</Button>}
          />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <Table headers={['Employee', 'Contact', 'Outlet', 'Leave Balance', 'Actions']}>
                {filteredEmployees.map(emp => {
                  const balance = leaveBalances[emp.id] || { casual: 0, sick: 0, paid: 0, emergency: 0 };
                  return (
                    <tr key={emp.id} className="hover:bg-cream/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-maroon to-maroon-light flex items-center justify-center text-cream font-medium">
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{emp.name}</p>
                            <p className="text-xs text-gray-500">{emp.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={12} /> {emp.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={12} /> {emp.mobile}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="info">{getOutletName(emp.outletId)}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 text-xs">
                          <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded">C: {balance.casual}</span>
                          <span className="px-2 py-1 bg-red-50 text-red-600 rounded">S: {balance.sick}</span>
                          <span className="px-2 py-1 bg-green-50 text-green-600 rounded">P: {balance.paid}</span>
                          <span className="px-2 py-1 bg-orange-50 text-orange-600 rounded">E: {balance.emergency}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenModal(emp)}
                            className="p-2 text-gray-500 hover:text-maroon hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(emp.id)}
                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-100">
              {filteredEmployees.map(emp => {
                const balance = leaveBalances[emp.id] || { casual: 0, sick: 0, paid: 0, emergency: 0 };
                return (
                  <div key={emp.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-maroon to-maroon-light flex items-center justify-center text-cream font-bold">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{emp.name}</p>
                          <p className="text-xs text-gray-500">{emp.employeeId}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleOpenModal(emp)}
                          className="p-2 text-gray-500 hover:text-maroon rounded-lg"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(emp.id)}
                          className="p-2 text-gray-500 hover:text-red-500 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 size={14} />
                      <span>{getOutletName(emp.outletId)}</span>
                    </div>

                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded">Casual: {balance.casual}</span>
                      <span className="px-2 py-1 bg-red-50 text-red-600 rounded">Sick: {balance.sick}</span>
                      <span className="px-2 py-1 bg-green-50 text-green-600 rounded">Paid: {balance.paid}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Employee name"
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="employee@groversweets.com"
          />
          <Input
            label="Mobile"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            placeholder="9876543210"
          />
          <Input
            label="Employee ID"
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            placeholder="GS-EMP-XXX"
          />
          <Select
            label="Outlet"
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
              {editingEmployee ? 'Save Changes' : 'Add Employee'}
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
        title="Delete Employee"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to delete this employee? This action cannot be undone and will remove all associated leave records.</p>
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
