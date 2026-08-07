import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Send, HelpCircle, Bell, X, Landmark, Smartphone, Bitcoin, Sparkles, Check, Package, Search } from 'lucide-react';
import { useClients, useCreateClient } from '@/hooks/useClients';
import { useProducts } from '@/hooks/useProducts';
import { useCreateInvoice } from '@/hooks/useInvoices';
import { useBusiness } from '@/hooks/useBusiness';
import { createInvoiceSchema, clientSchema } from '@/lib/validations';
import { InvoicePreview } from '@/components/InvoicePreview';
import type { Currency, DiscountType, InvoiceTemplate, PaymentTerms } from '@/types';

const PAYMENT_TERMS_OPTIONS: Array<{ value: PaymentTerms; label: string }> = [
  { value: 'due_on_receipt', label: 'Due on Receipt' },
  { value: 'net_15', label: 'Net 15' },
  { value: 'net_30', label: 'Net 30' },
  { value: 'net_60', label: 'Net 60' },
  { value: 'custom', label: 'Custom terms' },
];

const paymentTermsLabel = (terms: string): string =>
  PAYMENT_TERMS_OPTIONS.find((opt) => opt.value === terms)?.label || terms.replace(/_/g, ' ');

interface ClientFormData {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  company: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const defaultClientFormData: ClientFormData = {
  name: '',
  contactPerson: '',
  email: '',
  phone: '',
  company: '',
  address: { street: '', city: '', state: '', zipCode: '', country: '' },
};

interface LineItem {
  productId?: string;
  name: string;
  description: string;
  quantity: string;
  unitPrice: string;
  discount: string;
  taxRate: string;
}

function parseNumber(value: string): number {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
}

export function CreateInvoice() {
  const navigate = useNavigate();
  const { data: clients, refetch: refetchClients } = useClients();
  const { data: products, isLoading: productsLoading } = useProducts();
  const createInvoice = useCreateInvoice();
  const createClient = useCreateClient();
  const { data: business } = useBusiness();

  const [clientId, setClientId] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerms>('net_30');
  const [activePaymentMethods, setActivePaymentMethods] = useState<Set<string>>(new Set());
  const [paymentData, setPaymentData] = useState({
    bank: { name: '', accountName: '', accountNumber: '', routingNumber: '', iban: '', swift: '' },
    momo: { provider: '', number: '', name: '' },
    crypto: { network: '', address: '', label: '' },
    custom1: { label: '', value: '' },
    custom2: { label: '', value: '' },
  });
  const [discount, setDiscount] = useState('0');
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [taxRate, setTaxRate] = useState('10');
  const [taxName, setTaxName] = useState('Tax');
  const [template, setTemplate] = useState<InvoiceTemplate>('minimal');
  const [items, setItems] = useState<LineItem[]>([
    { name: '', description: '', quantity: '1', unitPrice: '0', discount: '0', taxRate: '0' },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  // Client modal state
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientFormData, setClientFormData] = useState<ClientFormData>(defaultClientFormData);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  // Product picker state
  const [showProductModal, setShowProductModal] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());

  const addItem = () => {
    setItems([...items, { name: '', description: '', quantity: '1', unitPrice: '0', discount: '0', taxRate: '0' }]);
  };

  const addItemsFromProducts = () => {
    const productsToAdd = products?.filter((p) => selectedProductIds.has(p.id)) ?? [];
    if (productsToAdd.length === 0) return;
    const newItems: LineItem[] = productsToAdd.map((product) => ({
      productId: product.id,
      name: product.name,
      description: product.description || '',
      quantity: String(product.quantity > 0 ? product.quantity : 1),
      unitPrice: String(product.unitPrice),
      discount: '0',
      taxRate: String(product.taxRate),
    }));
    setItems((prev) => [...prev, ...newItems]);
    setSelectedProductIds(new Set());
    setProductSearch('');
    setShowProductModal(false);
  };

  const toggleSelectedProduct = (id: string) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof LineItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const togglePaymentMethod = (method: string) => {
    setActivePaymentMethods((prev) => {
      const next = new Set(prev);
      if (next.has(method)) {
        next.delete(method);
      } else {
        next.add(method);
      }
      return next;
    });
  };

  const updatePaymentData = (method: string, field: string, value: string) => {
    setPaymentData((prev) => ({
      ...prev,
      [method]: { ...prev[method as keyof typeof prev], [field]: value },
    }));
  };

  const subtotal = items.reduce((sum, item) => {
    const qty = parseNumber(item.quantity);
    const price = parseNumber(item.unitPrice);
    const itemDiscount = parseNumber(item.discount);
    return sum + qty * price - itemDiscount;
  }, 0);

  const parsedDiscount = parseNumber(discount);
  const parsedTaxRate = parseNumber(taxRate);
  const discountAmount = discountType === 'percentage' ? (subtotal * parsedDiscount) / 100 : parsedDiscount;
  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * (parsedTaxRate / 100);
  const total = taxableAmount + tax;

  const selectedClient = clients?.find((c) => c.id === clientId);

  const availableProducts = products?.filter((p) => p.currency === currency) ?? [];
  const filteredProducts = availableProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.description?.toLowerCase().includes(productSearch.toLowerCase())
  );
  const noProductsAtAll = !productsLoading && products && products.length === 0;

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientErrors({});
    try {
      const validated = clientSchema.parse(clientFormData);
      const newClient = await createClient.mutateAsync(validated as any);
      await refetchClients();
      setClientId(newClient.id);
      setShowClientModal(false);
      setClientFormData(defaultClientFormData);
    } catch (err: any) {
      if (err.errors) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((e: any) => {
          fieldErrors[e.path.join('.')] = e.message;
        });
        setClientErrors(fieldErrors);
      }
    }
  };

  const currencySymbol: Record<Currency, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    GHS: 'GH₵',
    CAD: 'CA$',
    AUD: 'A$',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData = {
      clientId,
      issueDate,
      currency,
      reference: reference || undefined,
      items: items.map((item) => ({
        productId: item.productId,
        description: item.name || item.description,
        quantity: parseNumber(item.quantity),
        unitPrice: parseNumber(item.unitPrice),
        discount: parseNumber(item.discount),
        taxRate: parseNumber(item.taxRate),
      })),
      discount: parsedDiscount,
      discountType,
      taxRate: parsedTaxRate,
      taxName,
      notes: notes || undefined,
      internalNotes: internalNotes || undefined,
      paymentTerms,
      template,
    };

    const result = createInvoiceSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    try {
      const invoice = await createInvoice.mutateAsync(result.data);
      navigate(`/invoices/${invoice.id}`);
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : 'Failed to create invoice' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top App Bar */}
      <header className="h-14 bg-surface-bright border-b border-border-subtle flex items-center justify-between px-8 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="text-on-surface-variant hover:text-primary transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-headline text-sm font-semibold text-primary">New Invoice</h2>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={template}
            onChange={(e) => setTemplate(e.target.value as InvoiceTemplate)}
            className="h-8 border border-border-subtle rounded px-2 text-xs bg-surface-container-lowest"
          >
            <option value="minimal">Minimal</option>
            <option value="corporate">Corporate</option>
            <option value="modern">Modern</option>
            <option value="agency">Agency</option>
            <option value="elegant">Elegant</option>
          </select>
          <button className="text-on-surface-variant hover:text-primary transition-all p-1">
            <Bell className="w-5 h-5" />
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-all p-1">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Editor/Preview Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Editor Panel */}
        <section className="w-[480px] bg-surface-container-lowest border-r border-border-subtle overflow-y-auto flex flex-col">
          <div className="p-8 space-y-8 flex-1">
            {/* Client Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Client</label>
              <div className="relative">
                <select 
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full h-10 border border-border-subtle rounded px-3 text-sm appearance-none bg-surface-container-lowest"
                >
                  <option value="">Select a client...</option>
                  {clients?.map((client) => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-2.5 text-on-surface-variant pointer-events-none">▼</span>
              </div>
              {errors.clientId && <p className="text-status-error text-xs">{errors.clientId}</p>}
              <button 
                onClick={() => setShowClientModal(true)}
                className="text-secondary text-xs font-semibold flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3 h-3" /> Create new client
              </button>
            </div>

            {/* Dates & Currency Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Issue Date</label>
                <input 
                  type="date" 
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full h-10 border border-border-subtle rounded px-3 text-sm bg-surface-container-lowest"
                />
                {errors.issueDate && <p className="text-status-error text-xs">{errors.issueDate}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Currency</label>
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="w-full h-10 border border-border-subtle rounded px-3 text-sm bg-surface-container-lowest"
                >
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — British Pound</option>
                  <option value="GHS">GHS — Ghanaian Cedi</option>
                  <option value="CAD">CAD — Canadian Dollar</option>
                  <option value="AUD">AUD — Australian Dollar</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Reference</label>
                <input 
                  type="text" 
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="PO #"
                  className="w-full h-10 border border-border-subtle rounded px-3 text-sm bg-surface-container-lowest"
                />
              </div>
            </div>

            {/* Line Items Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Items</label>
              </div>
              {errors.items && <p className="text-status-error text-xs">{errors.items}</p>}
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div 
                    key={index} 
                    className={`border border-border-subtle rounded bg-surface-container-lowest relative ${expandedItem === index ? 'p-4' : 'px-4 py-3'}`}
                  >
                    {expandedItem === index ? (
                      // Expanded view
                      <>
                        <button 
                          onClick={() => setExpandedItem(null)}
                          className="absolute top-3 right-3 text-on-surface-variant hover:text-primary text-xs font-semibold"
                        >
                          Collapse
                        </button>
                        <button 
                          onClick={() => removeItem(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <div className="grid grid-cols-12 gap-3">
                          <div className="col-span-12">
                            <input 
                              className="w-full h-9 border border-border-subtle rounded px-3 text-sm font-semibold" 
                              placeholder="Item name" 
                              type="text" 
                              value={item.name}
                              onChange={(e) => updateItem(index, 'name', e.target.value)}
                            />
                          </div>
                          <div className="col-span-12">
                            <textarea 
                              className="w-full border border-border-subtle rounded px-3 py-2 text-sm resize-none" 
                              placeholder="Description" 
                              rows={2}
                              value={item.description}
                              onChange={(e) => updateItem(index, 'description', e.target.value)}
                            />
                          </div>
                          <div className="col-span-3">
                            <label className="text-[10px] text-on-surface-variant block mb-1">Qty</label>
                            <input 
                              className="w-full h-9 border border-border-subtle rounded px-3 text-sm" 
                              type="text" 
                              inputMode="numeric"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', e.target.value.replace(/[^0-9]/g, ''))}
                            />
                          </div>
                          <div className="col-span-3">
                            <label className="text-[10px] text-on-surface-variant block mb-1">Price</label>
                            <input 
                              className="w-full h-9 border border-border-subtle rounded px-3 text-sm" 
                              type="text" 
                              inputMode="decimal"
                              value={item.unitPrice}
                              onChange={(e) => updateItem(index, 'unitPrice', e.target.value.replace(/[^0-9.]/g, ''))}
                            />
                          </div>
                          <div className="col-span-3">
                            <label className="text-[10px] text-on-surface-variant block mb-1">Discount</label>
                            <input 
                              className="w-full h-9 border border-border-subtle rounded px-3 text-sm" 
                              type="text" 
                              inputMode="decimal"
                              value={item.discount}
                              onChange={(e) => updateItem(index, 'discount', e.target.value.replace(/[^0-9.]/g, ''))}
                            />
                          </div>
                          <div className="col-span-3 flex items-end justify-end">
                            <span className="font-semibold text-sm mb-2">{currencySymbol[currency]}{(parseNumber(item.quantity) * parseNumber(item.unitPrice) - parseNumber(item.discount)).toLocaleString()}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      // Collapsed view - single row
                      <div 
                        className="flex items-center gap-4 cursor-pointer"
                        onClick={() => setExpandedItem(index)}
                      >
                        <span className="font-semibold text-sm flex-1 truncate">{item.name || 'Untitled Item'}</span>
                        <span className="text-xs text-on-surface-variant">{item.quantity} × {currencySymbol[currency]}{parseNumber(item.unitPrice).toLocaleString()}</span>
                        <span className="font-semibold text-sm">{currencySymbol[currency]}{(parseNumber(item.quantity) * parseNumber(item.unitPrice) - parseNumber(item.discount)).toLocaleString()}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeItem(index); }}
                          className="p-1 hover:bg-error/10 rounded text-on-surface-variant hover:text-error transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={addItem}
                  className="flex-1 h-10 border border-dashed border-outline-variant rounded text-on-surface-variant hover:bg-surface-container transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" /> Add item
                </button>
                <button 
                  onClick={() => { setProductSearch(''); setSelectedProductIds(new Set()); setShowProductModal(true); }}
                  className="h-10 px-4 border border-dashed border-outline-variant rounded text-on-surface-variant hover:bg-surface-container transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  <Package className="w-4 h-4" /> Add from Products
                </button>
              </div>
            </div>

            {/* Discount, Tax & Terms */}
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Discount</label>
                  <div className="flex gap-2">
                    <input 
                      className="flex-1 h-10 border border-border-subtle rounded px-3 text-sm bg-surface-container-lowest" 
                      type="text" 
                      inputMode="decimal"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value.replace(/[^0-9.]/g, ''))}
                    />
                    <select 
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                      className="w-20 h-10 border border-border-subtle rounded px-2 text-sm bg-surface-container-lowest"
                    >
                      <option value="percentage">%</option>
                      <option value="fixed">{currencySymbol[currency]}</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tax Rate (%)</label>
                  <input 
                    className="w-full h-10 border border-border-subtle rounded px-3 text-sm bg-surface-container-lowest" 
                    type="text" 
                    inputMode="decimal"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value.replace(/[^0-9.]/g, ''))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tax Name</label>
                <input 
                  className="w-full h-10 border border-border-subtle rounded px-3 text-sm bg-surface-container-lowest" 
                  type="text" 
                  value={taxName}
                  onChange={(e) => setTaxName(e.target.value)}
                  placeholder="VAT, GST, etc."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Payment Terms</label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value as PaymentTerms)}
                  className="w-full h-10 border border-border-subtle rounded px-3 text-sm bg-surface-container-lowest appearance-none"
                >
                  {PAYMENT_TERMS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Notes</label>
                <textarea 
                  className="w-full border border-border-subtle rounded px-3 py-3 text-sm resize-none" 
                  placeholder="Visible to your client..." 
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Internal Notes</label>
                <textarea 
                  className="w-full border border-border-subtle rounded px-3 py-3 text-sm resize-none" 
                  placeholder="Not visible on the invoice..." 
                  rows={2}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="p-6 border-t border-border-subtle">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">How should clients pay you?</h3>
            
            {/* Payment Method Selector */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: 'bank', label: 'Bank Transfer', icon: Landmark },
                { id: 'momo', label: 'Mobile Money', icon: Smartphone },
                { id: 'crypto', label: 'Crypto', icon: Bitcoin },
                { id: 'custom1', label: 'Custom', icon: Sparkles },
                { id: 'custom2', label: 'Custom 2', icon: Sparkles },
              ].map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => togglePaymentMethod(method.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    activePaymentMethods.has(method.id)
                      ? 'bg-secondary text-on-secondary shadow-md scale-105'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-border-subtle'
                  }`}
                >
                  <method.icon className="w-4 h-4" />
                  {method.label}
                  {activePaymentMethods.has(method.id) && (
                    <Check className="w-4 h-4 ml-1" />
                  )}
                </button>
              ))}
            </div>

            {/* Bank Transfer Fields */}
            {activePaymentMethods.has('bank') && (
              <div className="bg-surface-container-low rounded-xl p-4 mb-4 border border-border-subtle animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2 mb-4">
                  <Landmark className="w-5 h-5 text-secondary" />
                  <span className="font-semibold text-sm">Bank Transfer Details</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={paymentData.bank.name} onChange={(e) => updatePaymentData('bank', 'name', e.target.value)} className="h-10 border border-border-subtle rounded-lg px-3 text-sm bg-surface-container-lowest" placeholder="Bank name" />
                  <input type="text" value={paymentData.bank.accountName} onChange={(e) => updatePaymentData('bank', 'accountName', e.target.value)} className="h-10 border border-border-subtle rounded-lg px-3 text-sm bg-surface-container-lowest" placeholder="Account name" />
                  <input type="text" value={paymentData.bank.accountNumber} onChange={(e) => updatePaymentData('bank', 'accountNumber', e.target.value)} className="h-10 border border-border-subtle rounded-lg px-3 text-sm bg-surface-container-lowest" placeholder="Account number" />
                  <input type="text" value={paymentData.bank.routingNumber} onChange={(e) => updatePaymentData('bank', 'routingNumber', e.target.value)} className="h-10 border border-border-subtle rounded-lg px-3 text-sm bg-surface-container-lowest" placeholder="Routing / Sort code" />
                  <input type="text" value={paymentData.bank.iban} onChange={(e) => updatePaymentData('bank', 'iban', e.target.value)} className="h-10 border border-border-subtle rounded-lg px-3 text-sm bg-surface-container-lowest" placeholder="IBAN (optional)" />
                  <input type="text" value={paymentData.bank.swift} onChange={(e) => updatePaymentData('bank', 'swift', e.target.value)} className="h-10 border border-border-subtle rounded-lg px-3 text-sm bg-surface-container-lowest" placeholder="SWIFT / BIC (optional)" />
                </div>
              </div>
            )}

            {/* Mobile Money Fields */}
            {activePaymentMethods.has('momo') && (
              <div className="bg-surface-container-low rounded-xl p-4 mb-4 border border-border-subtle animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2 mb-4">
                  <Smartphone className="w-5 h-5 text-secondary" />
                  <span className="font-semibold text-sm">Mobile Money Details</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <input type="text" value={paymentData.momo.provider} onChange={(e) => updatePaymentData('momo', 'provider', e.target.value)} className="h-10 border border-border-subtle rounded-lg px-3 text-sm bg-surface-container-lowest" placeholder="MTN, M-Pesa..." />
                  <input type="text" value={paymentData.momo.number} onChange={(e) => updatePaymentData('momo', 'number', e.target.value)} className="h-10 border border-border-subtle rounded-lg px-3 text-sm bg-surface-container-lowest" placeholder="+233 XX XXX XXXX" />
                  <input type="text" value={paymentData.momo.name} onChange={(e) => updatePaymentData('momo', 'name', e.target.value)} className="h-10 border border-border-subtle rounded-lg px-3 text-sm bg-surface-container-lowest" placeholder="Account name" />
                </div>
              </div>
            )}

            {/* Crypto Fields */}
            {activePaymentMethods.has('crypto') && (
              <div className="bg-surface-container-low rounded-xl p-4 mb-4 border border-border-subtle animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2 mb-4">
                  <Bitcoin className="w-5 h-5 text-secondary" />
                  <span className="font-semibold text-sm">Crypto Wallet Details</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <input type="text" value={paymentData.crypto.network} onChange={(e) => updatePaymentData('crypto', 'network', e.target.value)} className="h-10 border border-border-subtle rounded-lg px-3 text-sm bg-surface-container-lowest" placeholder="BTC, ETH, USDT..." />
                  <input type="text" value={paymentData.crypto.address} onChange={(e) => updatePaymentData('crypto', 'address', e.target.value)} className="h-10 border border-border-subtle rounded-lg px-3 text-sm bg-surface-container-lowest col-span-2" placeholder="Wallet address" />
                  <input type="text" value={paymentData.crypto.label} onChange={(e) => updatePaymentData('crypto', 'label', e.target.value)} className="h-10 border border-border-subtle rounded-lg px-3 text-sm bg-surface-container-lowest" placeholder="Label (optional)" />
                </div>
              </div>
            )}

            {/* Custom 1 Fields */}
            {activePaymentMethods.has('custom1') && (
              <div className="bg-surface-container-low rounded-xl p-4 mb-4 border border-border-subtle animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  <span className="font-semibold text-sm">Custom Payment Method</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={paymentData.custom1.label} onChange={(e) => updatePaymentData('custom1', 'label', e.target.value)} className="h-10 border border-border-subtle rounded-lg px-3 text-sm bg-surface-container-lowest" placeholder="e.g. PayPal, Venmo, Wise" />
                  <input type="text" value={paymentData.custom1.value} onChange={(e) => updatePaymentData('custom1', 'value', e.target.value)} className="h-10 border border-border-subtle rounded-lg px-3 text-sm bg-surface-container-lowest" placeholder="Email, link, or ID" />
                </div>
              </div>
            )}

            {/* Custom 2 Fields */}
            {activePaymentMethods.has('custom2') && (
              <div className="bg-surface-container-low rounded-xl p-4 mb-4 border border-border-subtle animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  <span className="font-semibold text-sm">Another Payment Method</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={paymentData.custom2.label} onChange={(e) => updatePaymentData('custom2', 'label', e.target.value)} className="h-10 border border-border-subtle rounded-lg px-3 text-sm bg-surface-container-lowest" placeholder="e.g. Stripe, Cash App" />
                  <input type="text" value={paymentData.custom2.value} onChange={(e) => updatePaymentData('custom2', 'value', e.target.value)} className="h-10 border border-border-subtle rounded-lg px-3 text-sm bg-surface-container-lowest" placeholder="Payment link or ID" />
                </div>
              </div>
            )}

            {activePaymentMethods.size === 0 && (
              <p className="text-on-surface-variant text-xs text-center py-4">Select a payment method above to add details</p>
            )}
          </div>

          {/* Sticky Actions */}
          <div className="p-6 border-t border-border-subtle bg-surface-container-lowest mt-auto flex flex-col gap-3">
            {errors.form && (
              <p className="text-status-error text-xs bg-status-error/5 border border-status-error/20 rounded-lg px-3 py-2">
                {errors.form}
              </p>
            )}
            <div className="flex gap-3">
              <button className="flex-1 h-11 border border-border-subtle rounded font-semibold text-sm hover:bg-surface-container transition-colors">
                Save Draft
              </button>
              <button 
                onClick={handleSubmit}
                disabled={createInvoice.isPending}
                className="flex-1 h-11 bg-secondary text-white rounded font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                {createInvoice.isPending ? 'Sending...' : 'Send Invoice'}
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Right: Live Preview Panel */}
        <section className="flex-1 bg-surface-container-low overflow-y-auto p-12 flex justify-center">
          <InvoicePreview
            template={template}
            currency={currency}
            companyInfo={{
              name: business?.name || 'Your Company',
              address: business?.address
                ? [business.address.street, business.address.city, business.address.state, business.address.country]
                    .filter(Boolean)
                    .join(', ')
                : 'Your Address, City, State ZIP',
              email: business?.email || 'email@company.com',
            }}
            clientInfo={{
              name: selectedClient?.name || 'Client Name',
              company: selectedClient?.company || 'Company',
              address: selectedClient?.address ? `${selectedClient.address.street}, ${selectedClient.address.city}, ${selectedClient.address.state}` : 'Address',
            }}
            invoiceNumber={reference || 'INV-XXXX'}
            issueDate={issueDate}
            reference={reference}
            items={items.map(item => ({ name: item.name, description: item.description, quantity: parseNumber(item.quantity), unitPrice: parseNumber(item.unitPrice), discount: parseNumber(item.discount) }))}
            subtotal={subtotal}
            discount={parsedDiscount}
            taxRate={parsedTaxRate}
            taxName={taxName}
            tax={tax}
            total={total}
            notes={notes}
            paymentTerms={paymentTermsLabel(paymentTerms)}
            paymentDetails={{
              bank: paymentData.bank,
              momo: paymentData.momo,
              crypto: paymentData.crypto,
              custom1: paymentData.custom1,
              custom2: paymentData.custom2,
            }}
            currencySymbol={currencySymbol}
          />
        </section>
      </div>

      {/* Client Modal */}
      {showClientModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border-subtle sticky top-0 bg-surface-container-lowest">
              <h3 className="font-headline text-lg font-semibold">Add Client</h3>
              <button onClick={() => setShowClientModal(false)} className="text-on-surface-variant hover:text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateClient} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Name *</label>
                  <input
                    type="text"
                    value={clientFormData.name}
                    onChange={(e) => setClientFormData({ ...clientFormData, name: e.target.value })}
                    className="w-full h-10 border border-border-subtle rounded px-3 text-sm"
                    placeholder="Company name"
                  />
                  {clientErrors.name && <p className="text-status-error text-xs">{clientErrors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Contact Person</label>
                  <input
                    type="text"
                    value={clientFormData.contactPerson}
                    onChange={(e) => setClientFormData({ ...clientFormData, contactPerson: e.target.value })}
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
                    value={clientFormData.email}
                    onChange={(e) => setClientFormData({ ...clientFormData, email: e.target.value })}
                    className="w-full h-10 border border-border-subtle rounded px-3 text-sm"
                    placeholder="email@example.com"
                  />
                  {clientErrors.email && <p className="text-status-error text-xs">{clientErrors.email}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Phone</label>
                  <input
                    type="tel"
                    value={clientFormData.phone}
                    onChange={(e) => setClientFormData({ ...clientFormData, phone: e.target.value })}
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
                    value={clientFormData.company}
                    onChange={(e) => setClientFormData({ ...clientFormData, company: e.target.value })}
                    className="w-full h-10 border border-border-subtle rounded px-3 text-sm"
                    placeholder="Company name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Address</label>
                  <input
                    type="text"
                    value={clientFormData.address.street}
                    onChange={(e) => setClientFormData({ ...clientFormData, address: { ...clientFormData.address, street: e.target.value } })}
                    className="w-full h-10 border border-border-subtle rounded px-3 text-sm"
                    placeholder="123 Main St"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">City</label>
                  <input
                    type="text"
                    value={clientFormData.address.city}
                    onChange={(e) => setClientFormData({ ...clientFormData, address: { ...clientFormData.address, city: e.target.value } })}
                    className="w-full h-10 border border-border-subtle rounded px-3 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">State</label>
                  <input
                    type="text"
                    value={clientFormData.address.state}
                    onChange={(e) => setClientFormData({ ...clientFormData, address: { ...clientFormData.address, state: e.target.value } })}
                    className="w-full h-10 border border-border-subtle rounded px-3 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">ZIP Code</label>
                  <input
                    type="text"
                    value={clientFormData.address.zipCode}
                    onChange={(e) => setClientFormData({ ...clientFormData, address: { ...clientFormData.address, zipCode: e.target.value } })}
                    className="w-full h-10 border border-border-subtle rounded px-3 text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowClientModal(false)}
                  className="flex-1 h-11 border border-border-subtle rounded font-semibold text-sm hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createClient.isPending}
                  className="flex-1 h-11 bg-secondary text-white rounded font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  {createClient.isPending ? 'Creating...' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Picker Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border-subtle">
              <div>
                <h3 className="font-headline text-lg font-semibold">Add from Products</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Showing products in {currency} — the invoice's currency
                </p>
              </div>
              <button onClick={() => setShowProductModal(false)} className="text-on-surface-variant hover:text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-border-subtle">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full h-10 bg-surface-container-low border border-border-subtle rounded-lg pl-10 pr-4 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {productsLoading ? (
                <div className="p-12 text-center">
                  <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                  <p className="text-on-surface-variant mt-4 text-sm">Loading products...</p>
                </div>
              ) : noProductsAtAll ? (
                <div className="p-12 text-center">
                  <Package className="w-10 h-10 text-on-surface-variant mx-auto mb-3" />
                  <p className="text-on-surface-variant text-sm">No products yet.</p>
                  <p className="text-on-surface-variant text-xs mt-1">
                    Add them in{' '}
                    <a href="/products" className="text-secondary font-semibold hover:underline">
                      Products &amp; Services
                    </a>
                  </p>
                </div>
              ) : availableProducts.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-on-surface-variant text-sm">
                    No products in {currency}. Switch the invoice currency or add a product in {currency}.
                  </p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-on-surface-variant text-sm">No products match your search.</p>
                </div>
              ) : (
                <div className="divide-y divide-border-subtle">
                  {filteredProducts.map((product) => {
                    const selected = selectedProductIds.has(product.id);
                    return (
                      <button
                        key={product.id}
                        onClick={() => toggleSelectedProduct(product.id)}
                        className="w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-surface-container/40 transition-colors"
                      >
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            selected
                              ? 'bg-secondary border-secondary text-white'
                              : 'border-outline-variant bg-surface-container-lowest'
                          }`}
                        >
                          {selected && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4 text-secondary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{product.name}</p>
                          {product.description && (
                            <p className="text-xs text-on-surface-variant truncate">{product.description}</p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-semibold text-sm">{currencySymbol[currency]}{product.unitPrice.toLocaleString()}</p>
                          <p className="text-xs text-on-surface-variant">{product.category || '—'}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border-subtle flex gap-3">
              <button
                onClick={() => setShowProductModal(false)}
                className="flex-1 h-11 border border-border-subtle rounded font-semibold text-sm hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addItemsFromProducts}
                disabled={selectedProductIds.size === 0}
                className="flex-1 h-11 bg-secondary text-white rounded font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Add selected ({selectedProductIds.size})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
