import { Wallet } from 'lucide-react';
import type { Currency, InvoiceTemplate } from '@/types';

interface InvoicePreviewProps {
  template: InvoiceTemplate;
  currency: Currency;
  companyInfo: {
    name: string;
    address: string;
    email: string;
  };
  clientInfo: {
    name: string;
    company: string;
    address: string;
  };
  invoiceNumber: string;
  issueDate: string;
  reference?: string;
  items: Array<{
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    discount: number;
  }>;
  subtotal: number;
  discount: number;
  taxRate: number;
  taxName: string;
  tax: number;
  total: number;
  notes?: string;
  paymentTerms: string;
  paymentDetails?: {
    bank?: {
      name?: string;
      accountName?: string;
      accountNumber?: string;
      routingNumber?: string;
      iban?: string;
      swift?: string;
    };
    momo?: {
      provider?: string;
      number?: string;
      name?: string;
    };
    crypto?: {
      network?: string;
      address?: string;
      label?: string;
    };
    custom1?: { label?: string; value?: string };
    custom2?: { label?: string; value?: string };
  };
  currencySymbol: Record<Currency, string>;
}

export function InvoicePreview({
  template,
  currency,
  companyInfo,
  clientInfo,
  invoiceNumber,
  issueDate,
  reference,
  items,
  subtotal,
  discount,
  taxRate,
  taxName,
  tax,
  total,
  notes,
  paymentTerms,
  paymentDetails,
  currencySymbol,
}: InvoicePreviewProps) {
  const symbol = currencySymbol[currency] || '$';
  const formattedDate = issueDate
    ? new Date(issueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '-';

  const hasPaymentDetails = paymentDetails && (
    (paymentDetails.bank?.name || paymentDetails.bank?.accountName || paymentDetails.bank?.accountNumber) ||
    (paymentDetails.momo?.provider || paymentDetails.momo?.number) ||
    (paymentDetails.crypto?.network || paymentDetails.crypto?.address) ||
    (paymentDetails.custom1?.label && paymentDetails.custom1?.value) ||
    (paymentDetails.custom2?.label && paymentDetails.custom2?.value)
  );

  if (template === 'minimal') {
    return (
      <div className="bg-surface-container-lowest w-full max-w-2xl min-h-[842px] p-16 flex flex-col shadow-sm" style={{ aspectRatio: '1 / 1.4142' }}>
        {/* Minimal Header */}
        <div className="flex justify-between items-start mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded">
              <Wallet className="w-6 h-6 text-on-primary" />
            </div>
            <div>
              <h3 className="font-headline text-lg font-semibold">{companyInfo.name}</h3>
              <p className="text-on-surface-variant text-xs mt-1">{companyInfo.address}<br />{companyInfo.email}</p>
            </div>
          </div>
          <div className="text-right">
            <h4 className="font-headline text-2xl font-bold text-primary mb-1">INVOICE</h4>
            <p className="text-on-surface-variant text-xs">#{invoiceNumber}</p>
          </div>
        </div>

        {/* Client & Info */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div>
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">Bill To</label>
            <p className="font-semibold text-sm">{clientInfo.name}</p>
            <p className="text-on-surface-variant text-xs mt-1">{clientInfo.company}<br />{clientInfo.address}</p>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Date Issued</label>
              <p className="text-sm">{formattedDate}</p>
            </div>
            {reference && (
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Reference</label>
                <p className="text-sm">{reference}</p>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <table className="w-full mb-12">
          <thead>
            <tr className="border-b-2 border-primary">
              <th className="py-3 text-xs font-bold uppercase text-left text-primary">Description</th>
              <th className="py-3 text-xs font-bold uppercase text-right text-primary">Qty</th>
              <th className="py-3 text-xs font-bold uppercase text-right text-primary">Price</th>
              <th className="py-3 text-xs font-bold uppercase text-right text-primary">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {items.map((item, index) => (
              <tr key={index}>
                <td className="py-4">
                  <p className="font-semibold text-sm">{item.name || 'Item'}</p>
                  {item.description && <p className="text-on-surface-variant text-xs mt-1">{item.description}</p>}
                </td>
                <td className="py-4 text-right text-sm">{item.quantity}</td>
                <td className="py-4 text-right text-sm">{symbol}{item.unitPrice.toLocaleString()}</td>
                <td className="py-4 text-right font-semibold text-sm">{symbol}{(item.quantity * item.unitPrice - item.discount).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mt-auto">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Subtotal</span>
              <span>{symbol}{subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Discount</span>
                <span>-{symbol}{discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">{taxName} ({taxRate}%)</span>
              <span>{symbol}{tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t-2 border-primary">
              <span className="font-headline text-lg font-semibold">Total Due</span>
              <span className="font-headline text-xl font-bold text-primary">{symbol}{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border-subtle text-xs text-on-surface-variant">
          {notes && <p className="mb-3"><span className="font-semibold">Notes:</span> {notes}</p>}
          <p className="mb-3"><span className="font-semibold">Payment Terms:</span> {paymentTerms}</p>
          {hasPaymentDetails && (
            <div className="mt-4 pt-4 border-t border-border-subtle">
              <p className="font-semibold mb-2">Payment Methods:</p>
              {paymentDetails.bank?.name && (
                <div className="mb-2">
                  <p className="font-semibold">Bank Transfer</p>
                  <p>{paymentDetails.bank.name}</p>
                  {paymentDetails.bank.accountName && <p>Account Name: {paymentDetails.bank.accountName}</p>}
                  {paymentDetails.bank.accountNumber && <p>Account Number: {paymentDetails.bank.accountNumber}</p>}
                  {paymentDetails.bank.routingNumber && <p>Routing: {paymentDetails.bank.routingNumber}</p>}
                  {paymentDetails.bank.iban && <p>IBAN: {paymentDetails.bank.iban}</p>}
                  {paymentDetails.bank.swift && <p>SWIFT: {paymentDetails.bank.swift}</p>}
                </div>
              )}
              {paymentDetails.momo?.provider && (
                <div className="mb-2">
                  <p className="font-semibold">Mobile Money</p>
                  <p>{paymentDetails.momo.provider}: {paymentDetails.momo.number}</p>
                  {paymentDetails.momo.name && <p>Name: {paymentDetails.momo.name}</p>}
                </div>
              )}
              {paymentDetails.crypto?.network && (
                <div className="mb-2">
                  <p className="font-semibold">Crypto ({paymentDetails.crypto.network})</p>
                  <p className="break-all">{paymentDetails.crypto.address}</p>
                  {paymentDetails.crypto.label && <p>{paymentDetails.crypto.label}</p>}
                </div>
              )}
              {paymentDetails.custom1?.label && paymentDetails.custom1?.value && (
                <div className="mb-2">
                  <p className="font-semibold">{paymentDetails.custom1.label}</p>
                  <p>{paymentDetails.custom1.value}</p>
                </div>
              )}
              {paymentDetails.custom2?.label && paymentDetails.custom2?.value && (
                <div className="mb-2">
                  <p className="font-semibold">{paymentDetails.custom2.label}</p>
                  <p>{paymentDetails.custom2.value}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (template === 'corporate') {
    return (
      <div className="bg-surface-container-lowest w-full max-w-2xl min-h-[842px] flex flex-col shadow-sm" style={{ aspectRatio: '1 / 1.4142' }}>
        {/* Corporate Header with blue background */}
        <div className="bg-secondary text-on-secondary p-8 -mx-16 -mt-16 mb-8 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 flex items-center justify-center rounded">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-headline text-lg font-semibold">{companyInfo.name}</h3>
              <p className="text-white/80 text-xs mt-1">{companyInfo.address}<br />{companyInfo.email}</p>
            </div>
          </div>
          <div className="text-right">
            <h4 className="font-headline text-2xl font-bold mb-1">INVOICE</h4>
            <p className="text-white/80 text-xs">#{invoiceNumber}</p>
          </div>
        </div>

        <div className="px-16 flex-1 flex flex-col">
          {/* Client & Info */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider mb-2 block text-secondary">Bill To</label>
              <p className="font-semibold text-sm">{clientInfo.name}</p>
              <p className="text-on-surface-variant text-xs mt-1">{clientInfo.company}<br />{clientInfo.address}</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider mb-1 block text-secondary">Date Issued</label>
                <p className="text-sm">{formattedDate}</p>
              </div>
              {reference && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider mb-1 block text-secondary">Reference</label>
                  <p className="text-sm">{reference}</p>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <table className="w-full mb-12">
            <thead>
              <tr className="bg-secondary text-on-secondary">
                <th className="py-3 px-4 text-xs font-bold uppercase text-left">Description</th>
                <th className="py-3 px-4 text-xs font-bold uppercase text-right">Qty</th>
                <th className="py-3 px-4 text-xs font-bold uppercase text-right">Price</th>
                <th className="py-3 px-4 text-xs font-bold uppercase text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="py-4 px-4">
                    <p className="font-semibold text-sm">{item.name || 'Item'}</p>
                    {item.description && <p className="text-on-surface-variant text-xs mt-1">{item.description}</p>}
                  </td>
                  <td className="py-4 px-4 text-right text-sm">{item.quantity}</td>
                  <td className="py-4 px-4 text-right text-sm">{symbol}{item.unitPrice.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right font-semibold text-sm">{symbol}{(item.quantity * item.unitPrice - item.discount).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mt-auto">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Subtotal</span>
                <span>{symbol}{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Discount</span>
                  <span>-{symbol}{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">{taxName} ({taxRate}%)</span>
                <span>{symbol}{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t-2 border-secondary">
                <span className="font-headline text-lg font-semibold">Total Due</span>
                <span className="font-headline text-xl font-bold text-secondary">{symbol}{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-border-subtle text-xs text-on-surface-variant">
            {notes && <p className="mb-3"><span className="font-semibold text-secondary">Notes:</span> {notes}</p>}
            <p><span className="font-semibold text-secondary">Payment Terms:</span> {paymentTerms}</p>
          </div>
        </div>
      </div>
    );
  }

  if (template === 'modern') {
    return (
      <div className="bg-surface-container-lowest w-full max-w-2xl min-h-[842px] p-16 flex flex-col shadow-sm" style={{ aspectRatio: '1 / 1.4142' }}>
        {/* Modern Header with accent */}
        <div className="border-l-4 border-secondary pl-6 mb-12 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary flex items-center justify-center rounded-lg">
              <Wallet className="w-6 h-6 text-on-secondary" />
            </div>
            <div>
              <h3 className="font-headline text-lg font-semibold">{companyInfo.name}</h3>
              <p className="text-on-surface-variant text-xs mt-1">{companyInfo.address}<br />{companyInfo.email}</p>
            </div>
          </div>
          <div className="text-right">
            <h4 className="font-headline text-2xl font-bold text-secondary mb-1">INVOICE</h4>
            <p className="text-on-surface-variant text-xs">#{invoiceNumber}</p>
          </div>
        </div>

        {/* Client & Info */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div>
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">Bill To</label>
            <p className="font-semibold text-sm">{clientInfo.name}</p>
            <p className="text-on-surface-variant text-xs mt-1">{clientInfo.company}<br />{clientInfo.address}</p>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Date Issued</label>
              <p className="text-sm">{formattedDate}</p>
            </div>
            {reference && (
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Reference</label>
                <p className="text-sm">{reference}</p>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <table className="w-full mb-12">
          <thead>
            <tr className="bg-secondary text-on-secondary">
              <th className="py-3 px-4 text-xs font-bold uppercase text-left">Description</th>
              <th className="py-3 px-4 text-xs font-bold uppercase text-right">Qty</th>
              <th className="py-3 px-4 text-xs font-bold uppercase text-right">Price</th>
              <th className="py-3 px-4 text-xs font-bold uppercase text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {items.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? '' : 'bg-surface-container-low'}>
                <td className="py-4 px-4">
                  <p className="font-semibold text-sm">{item.name || 'Item'}</p>
                  {item.description && <p className="text-on-surface-variant text-xs mt-1">{item.description}</p>}
                </td>
                <td className="py-4 px-4 text-right text-sm">{item.quantity}</td>
                <td className="py-4 px-4 text-right text-sm">{symbol}{item.unitPrice.toLocaleString()}</td>
                <td className="py-4 px-4 text-right font-semibold text-sm">{symbol}{(item.quantity * item.unitPrice - item.discount).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mt-auto">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Subtotal</span>
              <span>{symbol}{subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Discount</span>
                <span>-{symbol}{discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">{taxName} ({taxRate}%)</span>
              <span>{symbol}{tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t-2 border-secondary">
              <span className="font-headline text-lg font-semibold">Total Due</span>
              <span className="font-headline text-xl font-bold text-secondary">{symbol}{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

          <div className="mt-12 pt-6 border-t border-border-subtle text-xs text-on-surface-variant">
            {notes && <p className="mb-3"><span className="font-semibold text-secondary">Notes:</span> {notes}</p>}
            <p className="mb-3"><span className="font-semibold text-secondary">Payment Terms:</span> {paymentTerms}</p>
            {hasPaymentDetails && (
              <div className="mt-4 pt-4 border-t border-border-subtle">
                <p className="font-semibold mb-2 text-secondary">Payment Methods:</p>
                {paymentDetails.bank?.name && (
                  <div className="mb-2">
                    <p className="font-semibold">Bank Transfer</p>
                    <p>{paymentDetails.bank.name}</p>
                    {paymentDetails.bank.accountName && <p>Account Name: {paymentDetails.bank.accountName}</p>}
                    {paymentDetails.bank.accountNumber && <p>Account Number: {paymentDetails.bank.accountNumber}</p>}
                    {paymentDetails.bank.routingNumber && <p>Routing: {paymentDetails.bank.routingNumber}</p>}
                    {paymentDetails.bank.iban && <p>IBAN: {paymentDetails.bank.iban}</p>}
                    {paymentDetails.bank.swift && <p>SWIFT: {paymentDetails.bank.swift}</p>}
                  </div>
                )}
                {paymentDetails.momo?.provider && (
                  <div className="mb-2">
                    <p className="font-semibold">Mobile Money</p>
                    <p>{paymentDetails.momo.provider}: {paymentDetails.momo.number}</p>
                    {paymentDetails.momo.name && <p>Name: {paymentDetails.momo.name}</p>}
                  </div>
                )}
                {paymentDetails.crypto?.network && (
                  <div className="mb-2">
                    <p className="font-semibold">Crypto ({paymentDetails.crypto.network})</p>
                    <p className="break-all">{paymentDetails.crypto.address}</p>
                    {paymentDetails.crypto.label && <p>{paymentDetails.crypto.label}</p>}
                  </div>
                )}
                {paymentDetails.custom1?.label && paymentDetails.custom1?.value && (
                  <div className="mb-2">
                    <p className="font-semibold">{paymentDetails.custom1.label}</p>
                    <p>{paymentDetails.custom1.value}</p>
                  </div>
                )}
                {paymentDetails.custom2?.label && paymentDetails.custom2?.value && (
                  <div className="mb-2">
                    <p className="font-semibold">{paymentDetails.custom2.label}</p>
                    <p>{paymentDetails.custom2.value}</p>
                  </div>
                )}
              </div>
            )}
          </div>
      </div>
    );
  }

  if (template === 'agency') {
    return (
      <div className="bg-surface-container-lowest w-full max-w-2xl min-h-[842px] flex flex-col shadow-sm" style={{ aspectRatio: '1 / 1.4142' }}>
        {/* Agency Header with gradient */}
        <div className="bg-gradient-to-r from-secondary to-secondary text-on-secondary p-8 -mx-16 -mt-16 mb-8 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 flex items-center justify-center rounded-lg">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-headline text-lg font-semibold">{companyInfo.name}</h3>
              <p className="text-white/80 text-xs mt-1">{companyInfo.address}<br />{companyInfo.email}</p>
            </div>
          </div>
          <div className="text-right">
            <h4 className="font-headline text-2xl font-bold mb-1">INVOICE</h4>
            <p className="text-white/80 text-xs">#{invoiceNumber}</p>
          </div>
        </div>

        <div className="px-16 flex-1 flex flex-col">
          {/* Client & Info */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider mb-2 block text-secondary">Bill To</label>
              <p className="font-semibold text-sm">{clientInfo.name}</p>
              <p className="text-on-surface-variant text-xs mt-1">{clientInfo.company}<br />{clientInfo.address}</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider mb-1 block text-secondary">Date Issued</label>
                <p className="text-sm">{formattedDate}</p>
              </div>
              {reference && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider mb-1 block text-secondary">Reference</label>
                  <p className="text-sm">{reference}</p>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <table className="w-full mb-12">
            <thead>
              <tr className="bg-secondary text-on-secondary">
                <th className="py-3 px-4 text-xs font-bold uppercase text-left">Description</th>
                <th className="py-3 px-4 text-xs font-bold uppercase text-right">Qty</th>
                <th className="py-3 px-4 text-xs font-bold uppercase text-right">Price</th>
                <th className="py-3 px-4 text-xs font-bold uppercase text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="py-4 px-4">
                    <p className="font-semibold text-sm">{item.name || 'Item'}</p>
                    {item.description && <p className="text-on-surface-variant text-xs mt-1">{item.description}</p>}
                  </td>
                  <td className="py-4 px-4 text-right text-sm">{item.quantity}</td>
                  <td className="py-4 px-4 text-right text-sm">{symbol}{item.unitPrice.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right font-semibold text-sm">{symbol}{(item.quantity * item.unitPrice - item.discount).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mt-auto">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Subtotal</span>
                <span>{symbol}{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Discount</span>
                  <span>-{symbol}{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">{taxName} ({taxRate}%)</span>
                <span>{symbol}{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t-2 border-secondary">
                <span className="font-headline text-lg font-semibold">Total Due</span>
                <span className="font-headline text-xl font-bold text-secondary">{symbol}{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-border-subtle text-xs text-on-surface-variant">
            {notes && <p className="mb-3"><span className="font-semibold text-secondary">Notes:</span> {notes}</p>}
            <p className="mb-3"><span className="font-semibold text-secondary">Payment Terms:</span> {paymentTerms}</p>
            {hasPaymentDetails && (
              <div className="mt-4 pt-4 border-t border-border-subtle">
                <p className="font-semibold mb-2 text-secondary">Payment Methods:</p>
                {paymentDetails.bank?.name && (
                  <div className="mb-2">
                    <p className="font-semibold">Bank Transfer</p>
                    <p>{paymentDetails.bank.name}</p>
                    {paymentDetails.bank.accountName && <p>Account Name: {paymentDetails.bank.accountName}</p>}
                    {paymentDetails.bank.accountNumber && <p>Account Number: {paymentDetails.bank.accountNumber}</p>}
                    {paymentDetails.bank.routingNumber && <p>Routing: {paymentDetails.bank.routingNumber}</p>}
                    {paymentDetails.bank.iban && <p>IBAN: {paymentDetails.bank.iban}</p>}
                    {paymentDetails.bank.swift && <p>SWIFT: {paymentDetails.bank.swift}</p>}
                  </div>
                )}
                {paymentDetails.momo?.provider && (
                  <div className="mb-2">
                    <p className="font-semibold">Mobile Money</p>
                    <p>{paymentDetails.momo.provider}: {paymentDetails.momo.number}</p>
                    {paymentDetails.momo.name && <p>Name: {paymentDetails.momo.name}</p>}
                  </div>
                )}
                {paymentDetails.crypto?.network && (
                  <div className="mb-2">
                    <p className="font-semibold">Crypto ({paymentDetails.crypto.network})</p>
                    <p className="break-all">{paymentDetails.crypto.address}</p>
                    {paymentDetails.crypto.label && <p>{paymentDetails.crypto.label}</p>}
                  </div>
                )}
                {paymentDetails.custom1?.label && paymentDetails.custom1?.value && (
                  <div className="mb-2">
                    <p className="font-semibold">{paymentDetails.custom1.label}</p>
                    <p>{paymentDetails.custom1.value}</p>
                  </div>
                )}
                {paymentDetails.custom2?.label && paymentDetails.custom2?.value && (
                  <div className="mb-2">
                    <p className="font-semibold">{paymentDetails.custom2.label}</p>
                    <p>{paymentDetails.custom2.value}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Elegant template
  return (
    <div className="bg-surface-container-lowest w-full max-w-2xl min-h-[842px] p-16 flex flex-col shadow-sm" style={{ aspectRatio: '1 / 1.4142' }}>
      {/* Elegant Header - centered */}
      <div className="text-center border-b border-border-subtle pb-8 mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-surface-container-high flex items-center justify-center rounded-full">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
        </div>
        <h3 className="font-headline text-xl font-semibold text-primary">{companyInfo.name}</h3>
        <p className="text-on-surface-variant text-xs mt-1">{companyInfo.address}<br />{companyInfo.email}</p>
      </div>

      {/* Invoice title - centered */}
      <div className="text-center mb-12">
        <h4 className="font-headline text-3xl font-light text-primary tracking-wide">INVOICE</h4>
        <p className="text-on-surface-variant text-sm mt-2">#{invoiceNumber}</p>
      </div>

      {/* Client & Info - centered */}
      <div className="grid grid-cols-2 gap-8 mb-12 text-center">
        <div>
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">Bill To</label>
          <p className="font-semibold text-sm">{clientInfo.name}</p>
          <p className="text-on-surface-variant text-xs mt-1">{clientInfo.company}<br />{clientInfo.address}</p>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Date Issued</label>
            <p className="text-sm">{formattedDate}</p>
          </div>
          {reference && (
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Reference</label>
              <p className="text-sm">{reference}</p>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <table className="w-full mb-12">
        <thead>
          <tr className="border-b border-border-subtle">
            <th className="py-3 text-xs font-bold uppercase text-left text-on-surface-variant">Description</th>
            <th className="py-3 text-xs font-bold uppercase text-right text-on-surface-variant">Qty</th>
            <th className="py-3 text-xs font-bold uppercase text-right text-on-surface-variant">Price</th>
            <th className="py-3 text-xs font-bold uppercase text-right text-on-surface-variant">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {items.map((item, index) => (
            <tr key={index}>
              <td className="py-4">
                <p className="font-semibold text-sm">{item.name || 'Item'}</p>
                {item.description && <p className="text-on-surface-variant text-xs mt-1">{item.description}</p>}
              </td>
              <td className="py-4 text-right text-sm">{item.quantity}</td>
              <td className="py-4 text-right text-sm">{symbol}{item.unitPrice.toLocaleString()}</td>
              <td className="py-4 text-right font-semibold text-sm">{symbol}{(item.quantity * item.unitPrice - item.discount).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mt-auto">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Subtotal</span>
            <span>{symbol}{subtotal.toLocaleString()}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Discount</span>
              <span>-{symbol}{discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">{taxName} ({taxRate}%)</span>
            <span>{symbol}{tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-border-subtle">
            <span className="font-headline text-lg font-semibold">Total Due</span>
            <span className="font-headline text-xl font-bold text-primary">{symbol}{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-border-subtle text-xs text-on-surface-variant text-center">
        {notes && <p className="mb-3"><span className="font-semibold text-on-surface-variant">Notes:</span> {notes}</p>}
        <p className="mb-3"><span className="font-semibold text-on-surface-variant">Payment Terms:</span> {paymentTerms}</p>
        {hasPaymentDetails && (
          <div className="mt-4 pt-4 border-t border-border-subtle text-left">
            <p className="font-semibold mb-2 text-on-surface-variant text-center">Payment Methods:</p>
            {paymentDetails.bank?.name && (
              <div className="mb-2">
                <p className="font-semibold">Bank Transfer</p>
                <p>{paymentDetails.bank.name}</p>
                {paymentDetails.bank.accountName && <p>Account Name: {paymentDetails.bank.accountName}</p>}
                {paymentDetails.bank.accountNumber && <p>Account Number: {paymentDetails.bank.accountNumber}</p>}
                {paymentDetails.bank.routingNumber && <p>Routing: {paymentDetails.bank.routingNumber}</p>}
                {paymentDetails.bank.iban && <p>IBAN: {paymentDetails.bank.iban}</p>}
                {paymentDetails.bank.swift && <p>SWIFT: {paymentDetails.bank.swift}</p>}
              </div>
            )}
            {paymentDetails.momo?.provider && (
              <div className="mb-2">
                <p className="font-semibold">Mobile Money</p>
                <p>{paymentDetails.momo.provider}: {paymentDetails.momo.number}</p>
                {paymentDetails.momo.name && <p>Name: {paymentDetails.momo.name}</p>}
              </div>
            )}
            {paymentDetails.crypto?.network && (
              <div className="mb-2">
                <p className="font-semibold">Crypto ({paymentDetails.crypto.network})</p>
                <p className="break-all">{paymentDetails.crypto.address}</p>
                {paymentDetails.crypto.label && <p>{paymentDetails.crypto.label}</p>}
              </div>
            )}
            {paymentDetails.custom1?.label && paymentDetails.custom1?.value && (
              <div className="mb-2">
                <p className="font-semibold">{paymentDetails.custom1.label}</p>
                <p>{paymentDetails.custom1.value}</p>
              </div>
            )}
            {paymentDetails.custom2?.label && paymentDetails.custom2?.value && (
              <div className="mb-2">
                <p className="font-semibold">{paymentDetails.custom2.label}</p>
                <p>{paymentDetails.custom2.value}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
