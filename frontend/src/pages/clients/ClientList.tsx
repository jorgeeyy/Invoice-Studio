import { useState } from 'react';
import { Plus, Search, Users, Edit2, Trash2, X } from 'lucide-react';
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from '@/hooks/useClients';
import { clientSchema } from '@/lib/validations';
import type { Client } from '@/types';

interface ClientFormData {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  company: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  taxId: string;
  notes: string;
}

const defaultFormData: ClientFormData = {
  name: '',
  contactPerson: '',
  email: '',
  phone: '',
  website: '',
  company: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
  taxId: '',
  notes: '',
};

export function ClientList() {
  const { data: clients, isLoading } = useClients();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<ClientFormData>(defaultFormData);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredClients = clients?.filter(
    (client) =>
      client.status === activeTab &&
      (client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        contactPerson: client.contactPerson || '',
        email: client.email,
        phone: client.phone || '',
        website: client.website || '',
        company: client.company || '',
        address: client.address || { street: '', city: '', state: '', zipCode: '', country: '' },
        taxId: client.taxId || '',
        notes: client.notes || '',
      });
    } else {
      setEditingClient(null);
      setFormData(defaultFormData);
    }
    setErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClient(null);
    setFormData(defaultFormData);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const inputData = {
      name: formData.name,
      contactPerson: formData.contactPerson || undefined,
      email: formData.email,
      phone: formData.phone || undefined,
      website: formData.website || undefined,
      company: formData.company || undefined,
      address: formData.address.street ? formData.address : undefined,
      taxId: formData.taxId || undefined,
      notes: formData.notes || undefined,
    };

    const result = clientSchema.safeParse(inputData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    try {
      if (editingClient) {
        await updateClient.mutateAsync({ id: editingClient.id, input: result.data });
      } else {
        await createClient.mutateAsync(result.data);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save client:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteClient.mutateAsync(id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete client:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-bold text-primary">Clients</h1>
          <p className="text-on-surface-variant mt-1">Manage your client relationships</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-secondary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 bg-surface-container-low rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'active' ? 'bg-surface-container-lowest shadow-sm text-secondary' : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'archived' ? 'bg-surface-container-lowest shadow-sm text-secondary' : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Archived
          </button>
        </div>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-surface-container-low border border-border-subtle rounded-lg pl-10 pr-4 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
            <p className="text-on-surface-variant mt-4 text-sm">Loading clients...</p>
          </div>
        ) : filteredClients && filteredClients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Website</th>
                  <th className="px-6 py-3 border-b border-border-subtle"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-surface-container/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary font-bold">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{client.name}</p>
                          {client.company && <p className="text-xs text-on-surface-variant">{client.company}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm">{client.contactPerson || '-'}</p>
                        <p className="text-xs text-on-surface-variant">{client.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      {client.phone || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      {client.website || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenModal(client)}
                          className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {deleteConfirm === client.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(client.id)}
                              className="px-2 py-1 bg-error text-white text-xs rounded font-semibold hover:opacity-90"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-1 border border-border-subtle text-xs rounded font-semibold hover:bg-surface-container"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(client.id)}
                            className="p-1.5 hover:bg-error/10 rounded-lg text-on-surface-variant hover:text-error transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-on-surface-variant mx-auto mb-4" />
            <p className="text-on-surface-variant">
              {searchQuery ? 'No clients found matching your search' : `No ${activeTab} clients yet.`}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border-subtle sticky top-0 bg-surface-container-lowest">
              <h3 className="font-headline text-lg font-semibold">
                {editingClient ? 'Edit Client' : 'Add Client'}
              </h3>
              <button onClick={handleCloseModal} className="text-on-surface-variant hover:text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-10 border border-border-subtle rounded px-3 text-sm"
                    placeholder="Company name"
                  />
                  {errors.name && <p className="text-status-error text-xs">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full h-10 border border-border-subtle rounded px-3 text-sm"
                    placeholder="Primary contact"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-10 border border-border-subtle rounded px-3 text-sm"
                    placeholder="email@example.com"
                  />
                  {errors.email && <p className="text-status-error text-xs">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-10 border border-border-subtle rounded px-3 text-sm"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full h-10 border border-border-subtle rounded px-3 text-sm"
                    placeholder="Company name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full h-10 border border-border-subtle rounded px-3 text-sm"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Street Address</label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                  className="w-full h-10 border border-border-subtle rounded px-3 text-sm"
                  placeholder="123 Main St"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">City</label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                    className="w-full h-10 border border-border-subtle rounded px-3 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">State</label>
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                    className="w-full h-10 border border-border-subtle rounded px-3 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">ZIP Code</label>
                  <input
                    type="text"
                    value={formData.address.zipCode}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })}
                    className="w-full h-10 border border-border-subtle rounded px-3 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Country</label>
                <input
                  type="text"
                  value={formData.address.country}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })}
                  className="w-full h-10 border border-border-subtle rounded px-3 text-sm"
                  placeholder="Country"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tax ID</label>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  className="w-full h-10 border border-border-subtle rounded px-3 text-sm"
                  placeholder="Tax registration number"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full border border-border-subtle rounded px-3 py-2 text-sm resize-none"
                  rows={3}
                  placeholder="Internal notes about this client..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 h-10 border border-border-subtle rounded font-semibold text-sm hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createClient.isPending || updateClient.isPending}
                  className="flex-1 h-10 bg-secondary text-white rounded font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {createClient.isPending || updateClient.isPending ? 'Saving...' : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
