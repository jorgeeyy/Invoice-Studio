import { useState } from 'react';
import { Save, Upload, Building2, FileText, Palette, User, Shield } from 'lucide-react';
import { businessSettingsSchema } from '@/lib/validations';
import type { Currency, PaymentTerms } from '@/types';

interface SettingsFormData {
  // Business Information
  name: string;
  email: string;
  phone: string;
  website: string;
  taxId: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  // Invoice Defaults
  defaultCurrency: Currency;
  defaultTaxRate: number;
  defaultTaxName: string;
  invoicePrefix: string;
  defaultPaymentTerms: PaymentTerms;
  // Payment Details
  bankDetails: string;
  mobileMoneyDetails: string;
  paymentInstructions: string;
}

const defaultFormData: SettingsFormData = {
  name: 'Your Company',
  email: 'hello@yourcompany.com',
  phone: '+1 (555) 123-4567',
  website: 'https://yourcompany.com',
  taxId: '',
  address: {
    street: '123 Business Ave',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'USA',
  },
  defaultCurrency: 'USD',
  defaultTaxRate: 10,
  defaultTaxName: 'Tax',
  invoicePrefix: 'INV',
  defaultPaymentTerms: 'net_30',
  bankDetails: '',
  mobileMoneyDetails: '',
  paymentInstructions: '',
};

export function BusinessSettings() {
  const [formData, setFormData] = useState<SettingsFormData>(defaultFormData);
  const [activeTab, setActiveTab] = useState<'business' | 'invoices' | 'branding' | 'profile' | 'security'>('business');
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = businessSettingsSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        fieldErrors[err.path.join('.')] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    console.log('Save settings:', result.data);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'business' as const, label: 'Business', icon: Building2 },
    { id: 'invoices' as const, label: 'Invoices', icon: FileText },
    { id: 'branding' as const, label: 'Branding', icon: Palette },
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'security' as const, label: 'Security', icon: Shield },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-bold text-primary">Settings</h1>
          <p className="text-on-surface-variant mt-1">Manage your business profile and preferences</p>
        </div>
        {saved && (
          <span className="text-status-paid text-sm font-semibold">Settings saved successfully!</span>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-border-subtle">
        <nav className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-secondary text-secondary'
                  : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Tab */}
        {activeTab === 'business' && (
          <>
            <div className="bg-surface-container-lowest rounded-xl border border-border-subtle p-6">
              <h3 className="font-headline text-lg font-semibold text-primary mb-4">Company Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Company Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
                  />
                  {errors.name && <p className="text-status-error text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
                  />
                  {errors.email && <p className="text-status-error text-xs mt-1">{errors.email}</p>}
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
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Tax ID / VAT Number</label>
                  <input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
                  />
                </div>
              </div>
            </div>

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

            <div className="bg-surface-container-lowest rounded-xl border border-border-subtle p-6">
              <h3 className="font-headline text-lg font-semibold text-primary mb-4">Payment Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Bank Details</label>
                  <textarea
                    name="bankDetails"
                    value={formData.bankDetails}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Bank name, account number, routing number..."
                    className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Mobile Money Details</label>
                  <textarea
                    name="mobileMoneyDetails"
                    value={formData.mobileMoneyDetails}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Mobile money provider, account..."
                    className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Payment Instructions</label>
                  <textarea
                    name="paymentInstructions"
                    value={formData.paymentInstructions}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Additional payment instructions for your clients..."
                    className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="bg-surface-container-lowest rounded-xl border border-border-subtle p-6">
            <h3 className="font-headline text-lg font-semibold text-primary mb-4">Invoice Defaults</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Default Currency</label>
                <select
                  name="defaultCurrency"
                  value={formData.defaultCurrency}
                  onChange={handleChange}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="GHS">GHS - Ghanaian Cedi</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
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
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Default Tax Rate (%)</label>
                <input
                  type="number"
                  name="defaultTaxRate"
                  value={formData.defaultTaxRate}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Tax Name</label>
                <input
                  type="text"
                  name="defaultTaxName"
                  value={formData.defaultTaxName}
                  onChange={handleChange}
                  placeholder="VAT, GST, etc."
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Default Payment Terms</label>
                <select
                  name="defaultPaymentTerms"
                  value={formData.defaultPaymentTerms}
                  onChange={handleChange}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
                >
                  <option value="due_on_receipt">Due on Receipt</option>
                  <option value="net_15">Net 15</option>
                  <option value="net_30">Net 30</option>
                  <option value="net_60">Net 60</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Branding Tab */}
        {activeTab === 'branding' && (
          <div className="bg-surface-container-lowest rounded-xl border border-border-subtle p-6">
            <h3 className="font-headline text-lg font-semibold text-primary mb-4">Branding</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-2">Company Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-surface-container-high rounded-lg flex items-center justify-center border-2 border-dashed border-border-subtle">
                    <span className="text-on-surface-variant text-xs">Logo</span>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 border border-border-subtle rounded-lg text-sm font-semibold hover:bg-surface-container transition-colors"
                  >
                    <Upload className="w-4 h-4" /> Upload Logo
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-2">Signature</label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-16 bg-surface-container-high rounded-lg flex items-center justify-center border-2 border-dashed border-border-subtle">
                    <span className="text-on-surface-variant text-xs">Signature</span>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 border border-border-subtle rounded-lg text-sm font-semibold hover:bg-surface-container transition-colors"
                  >
                    <Upload className="w-4 h-4" /> Upload Signature
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-2">Company Stamp (Optional)</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center border-2 border-dashed border-border-subtle">
                    <span className="text-on-surface-variant text-xs">Stamp</span>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 border border-border-subtle rounded-lg text-sm font-semibold hover:bg-surface-container transition-colors"
                  >
                    <Upload className="w-4 h-4" /> Upload Stamp
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-surface-container-lowest rounded-xl border border-border-subtle p-6">
            <h3 className="font-headline text-lg font-semibold text-primary mb-4">User Profile</h3>
            <p className="text-on-surface-variant text-sm">Profile management will be available after backend integration.</p>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-surface-container-lowest rounded-xl border border-border-subtle p-6">
            <h3 className="font-headline text-lg font-semibold text-primary mb-4">Security</h3>
            <p className="text-on-surface-variant text-sm">Security settings will be available after backend integration.</p>
          </div>
        )}

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
