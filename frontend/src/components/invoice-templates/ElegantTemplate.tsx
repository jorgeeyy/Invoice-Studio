import { MultiLine, PaymentMethods, capsClass, formatDate, formatMoney, hasPaymentDetails } from './shared';
import type { InvoicePreviewProps } from './shared';

export function ElegantTemplate({
  currencySymbol,
  currency,
  companyInfo,
  clientInfo,
  invoiceNumber,
  issueDate,
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
}: InvoicePreviewProps) {
  const symbol = currencySymbol[currency] || '$';
  const date = formatDate(issueDate);
  const bank = paymentDetails?.bank;

  return (
    <div
      className="invoice-sheet bg-surface-container-lowest w-full max-w-[800px] min-h-[842px] flex flex-col shadow-sm rounded-xl border border-border-subtle overflow-hidden relative print:max-w-none print:rounded-none print:shadow-none print:border-0 print:overflow-visible"
    >
      <div className="h-1 bg-primary w-full absolute top-0 left-0" />
      <div className="p-12 lg:p-14 flex-1 flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <h1 className="font-serif text-4xl text-primary tracking-tight mb-2">{companyInfo.name}</h1>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest">{companyInfo.email}</p>
          </div>
          <div className="text-left md:text-right">
            <h2 className="font-serif text-5xl text-on-surface-variant/30 mb-2">INVOICE</h2>
            <p className="text-sm text-on-surface-variant">
              No. <span className="text-sm text-primary">{invoiceNumber}</span>
            </p>
            <p className="text-sm text-on-surface-variant">
              Date: <span className="text-sm text-primary">{date}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className={`${capsClass} mb-4 uppercase tracking-widest border-b border-border-subtle pb-2`}>Billed To</h3>
            <p className="text-lg font-semibold text-primary mb-1">{clientInfo.company || clientInfo.name}</p>
            <p className="text-sm text-on-surface-variant">{clientInfo.name}</p>
            <p className="text-sm text-on-surface-variant">
              <MultiLine text={clientInfo.address} />
            </p>
          </div>
          <div className="text-left md:text-right">
            <h3 className={`${capsClass} mb-4 uppercase tracking-widest border-b border-border-subtle pb-2`}>From</h3>
            <p className="text-sm text-on-surface-variant">
              <MultiLine text={companyInfo.address} />
            </p>
            <p className="text-sm text-on-surface-variant mt-2">{companyInfo.email}</p>
          </div>
        </div>

        <div className="mb-16">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className={`${capsClass} uppercase tracking-widest pb-4 border-b border-primary/20 w-3/5`}>Description</th>
                <th className={`${capsClass} uppercase tracking-widest pb-4 border-b border-primary/20 text-center w-1/5`}>Rate</th>
                <th className={`${capsClass} uppercase tracking-widest pb-4 border-b border-primary/20 text-right w-1/5`}>Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="py-6">
                    <p className="text-lg font-semibold text-primary mb-1">{item.name || 'Item'}</p>
                    {item.description && <p className="text-sm text-on-surface-variant">{item.description}</p>}
                  </td>
                  <td className="py-6 text-center text-sm text-on-surface-variant">{formatMoney(symbol, item.unitPrice)}</td>
                  <td className="py-6 text-right text-sm text-primary">
                    {formatMoney(symbol, item.quantity * item.unitPrice - item.discount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          <div className="w-full md:w-1/2">
            <h3 className={`${capsClass} mb-4 uppercase tracking-widest`}>Payment Information</h3>
            <div className="bg-surface-container-low p-6 border border-border-subtle rounded">
              {bank?.name && (
                <p className="text-sm text-on-surface-variant mb-1">
                  <span className="text-sm text-primary font-semibold">Bank:</span> {bank.name}
                </p>
              )}
              {bank?.accountName && (
                <p className="text-sm text-on-surface-variant mb-1">
                  <span className="text-sm text-primary font-semibold">Account Name:</span> {bank.accountName}
                </p>
              )}
              {bank?.accountNumber && (
                <p className="text-sm text-on-surface-variant mb-1">
                  <span className="text-sm text-primary font-semibold">Account No:</span> {bank.accountNumber}
                </p>
              )}
              {bank?.routingNumber && (
                <p className="text-sm text-on-surface-variant mb-1">
                  <span className="text-sm text-primary font-semibold">Routing:</span> {bank.routingNumber}
                </p>
              )}
              {bank?.iban && (
                <p className="text-sm text-on-surface-variant mb-1">
                  <span className="text-sm text-primary font-semibold">IBAN:</span> {bank.iban}
                </p>
              )}
              {bank?.swift && (
                <p className="text-sm text-on-surface-variant mb-1">
                  <span className="text-sm text-primary font-semibold">SWIFT:</span> {bank.swift}
                </p>
              )}
              {!hasPaymentDetails(paymentDetails) && (
                <p className="text-sm text-on-surface-variant italic">Remit payment within {paymentTerms}.</p>
              )}
              <PaymentMethods details={paymentDetails} className="text-sm text-on-surface-variant mt-3" />
              {notes && <p className="text-xs text-on-surface-variant mt-4 italic">{notes}</p>}
              <p className="text-xs text-on-surface-variant mt-2 italic">Payment Terms: {paymentTerms}</p>
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <div className="flex justify-between py-2 border-b border-border-subtle">
              <span className="text-sm text-on-surface-variant">Subtotal</span>
              <span className="text-sm text-primary">{formatMoney(symbol, subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between py-2 border-b border-border-subtle">
                <span className="text-sm text-on-surface-variant">Discount</span>
                <span className="text-sm text-primary">-{formatMoney(symbol, discount)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b border-border-subtle">
              <span className="text-sm text-on-surface-variant">
                {taxName} ({taxRate}%)
              </span>
              <span className="text-sm text-primary">{formatMoney(symbol, tax)}</span>
            </div>
            <div className="flex justify-between py-4 mt-2">
              <span className="font-serif text-xl text-primary">Total Due</span>
              <span className="text-2xl font-semibold text-primary">{formatMoney(symbol, total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto flex justify-between items-end border-t border-border-subtle pt-8">
          <div className="w-1/3">
            <div className="border-b border-on-surface-variant/50 h-12 mb-2 relative">
              <span className="font-serif italic text-2xl text-on-surface-variant absolute bottom-1 left-2 opacity-60">
                {companyInfo.name}
              </span>
            </div>
            <p className={`${capsClass} uppercase tracking-widest text-center`}>Authorized Signature</p>
          </div>
          <div className="text-right">
            <p className="font-serif italic text-on-surface-variant">Thank you for your business.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
