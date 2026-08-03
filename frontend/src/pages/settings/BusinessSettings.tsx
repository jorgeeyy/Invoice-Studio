import { useState } from 'react';
import { Save } from 'lucide-react';

export function BusinessSettings() {
  const [formData, setFormData] = useState({
    companyName: 'Your Company',
    email: 'hello@yourcompany.com',
    phone: '+1 (555) 123-4567',
    website: 'https://yourcompany.com',
    address: {
      street: '123 Business Ave',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA',
    },
    taxRate: 10,
    currency: 'USD',
    invoicePrefix: 'INV',
    quotePrefix: 'QUO',
    defaultPaymentTerms: 30,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, string>),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Save settings:', formData);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="font-headline text-2xl font-bold text-primary tracking-tight">Business Settings</h2>
        <p className="text-on-surface-variant mt-1">Manage your business information and preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Information */}
        <div className="bg-surface-container-lowest rounded-xl border border-border-subtle p-6">
          <h3 className="font-headline text-lg font-semibold text-primary mb-4">Business Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-surface-container-lowest rounded-xl border border-border-subtle p-6">
          <h3 className="font-headline text-lg font-semibold text-primary mb-4">Address</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Street Address</label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">City</label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">State</label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">ZIP Code</label>
              <input
                type="text"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Country</label>
              <input
                type="text"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Invoice Settings */}
        <div className="bg-surface-container-lowest rounded-xl border border-border-subtle p-6">
          <h3 className="font-headline text-lg font-semibold text-primary mb-4">Invoice Settings</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Currency</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Tax Rate (%)</label>
              <input
                type="number"
                name="taxRate"
                value={formData.taxRate}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Invoice Prefix</label>
              <input
                type="text"
                name="invoicePrefix"
                value={formData.invoicePrefix}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Quote Prefix</label>
              <input
                type="text"
                name="quotePrefix"
                value={formData.quotePrefix}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Default Payment Terms (days)</label>
              <input
                type="number"
                name="defaultPaymentTerms"
                value={formData.defaultPaymentTerms}
                onChange={handleChange}
                min="0"
                className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white font-semibold hover:opacity-90 transition-all shadow-sm"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
