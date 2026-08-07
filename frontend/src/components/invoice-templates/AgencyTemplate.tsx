import { Wallet } from 'lucide-react';
import { MultiLine, PaymentMethods, capsClass, formatDate, formatMoney, hasPaymentDetails } from './shared';
import type { InvoicePreviewProps } from './shared';

export function AgencyTemplate({
  currencySymbol,
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
}: InvoicePreviewProps) {
  const symbol = currencySymbol[currency] || '$';
  const date = formatDate(issueDate);
  const ref = reference && reference !== invoiceNumber ? reference : undefined;

  return (
    <div
      className="bg-surface-container-lowest w-full max-w-[800px] min-h-[842px] flex flex-col shadow-sm rounded-xl border border-border-subtle overflow-hidden"
      style={{ aspectRatio: '1 / 1.4142' }}
    >
      <div className="p-8 lg:p-10 border-b border-border-subtle flex flex-col md:flex-row justify-between items-start gap-8 bg-surface-bright">
        <div className="flex flex-col gap-6">
          <div className="w-24 h-24 bg-primary rounded-lg flex items-center justify-center">
            <Wallet className="w-12 h-12 text-on-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary mb-1 uppercase">{companyInfo.name}</h2>
            <p className="text-sm text-on-surface-variant max-w-xs">
              <MultiLine text={companyInfo.address} />
              <br />
              {companyInfo.email}
            </p>
          </div>
        </div>
        <div className="flex flex-col md:items-end text-left md:text-right gap-6 w-full md:w-auto">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-on-surface-variant mb-1">Invoice</div>
            <div className="text-2xl font-bold text-primary">{invoiceNumber}</div>
          </div>
          <div className="flex flex-col gap-2 bg-surface-container-low p-4 rounded-lg border border-border-subtle w-full md:w-64">
            <div className="flex justify-between">
              <span className="text-xs text-on-surface-variant">Date Issued:</span>
              <span className="text-sm text-primary">{date}</span>
            </div>
            {ref && (
              <div className="flex justify-between">
                <span className="text-xs text-on-surface-variant">Reference:</span>
                <span className="text-sm text-primary">{ref}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-xs text-on-surface-variant">Payment Terms:</span>
              <span className="text-sm text-primary">{paymentTerms}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 lg:p-10 flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          <div className={`${capsClass} mb-3 uppercase tracking-widest border-b border-border-subtle pb-2`}>Billed To</div>
          <h3 className="text-xl font-semibold text-primary mb-1">{clientInfo.company || clientInfo.name}</h3>
          <p className="text-sm text-on-surface-variant">
            {clientInfo.name}
            <br />
            <MultiLine text={clientInfo.address} />
          </p>
        </div>
      </div>

      <div className="px-8 lg:px-10 pb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50 border-b border-border-subtle">
              <th className={`py-3 px-4 ${capsClass} uppercase tracking-widest`}>Description</th>
              <th className={`py-3 px-4 ${capsClass} uppercase tracking-widest text-right`}>Rate</th>
              <th className={`py-3 px-4 ${capsClass} uppercase tracking-widest text-right`}>Qty</th>
              <th className={`py-3 px-4 ${capsClass} uppercase tracking-widest text-right`}>Total</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {items.map((item, index) => (
              <tr key={index} className="border-b border-border-subtle">
                <td className="py-4 px-4 text-primary">
                  <div className="font-semibold">{item.name || 'Item'}</div>
                  {item.description && <div className="text-xs text-on-surface-variant mt-1">{item.description}</div>}
                </td>
                <td className="py-4 px-4 text-right text-primary whitespace-nowrap">{formatMoney(symbol, item.unitPrice)}</td>
                <td className="py-4 px-4 text-right text-primary">{item.quantity}</td>
                <td className="py-4 px-4 text-right text-primary font-semibold whitespace-nowrap">
                  {formatMoney(symbol, item.quantity * item.unitPrice - item.discount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-8 lg:px-10 py-8 bg-neutral-900 text-neutral-50 flex flex-col md:flex-row justify-between items-end md:items-start gap-8 rounded-b-xl mt-auto">
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-neutral-400 mb-1">Payment Info</div>
            {hasPaymentDetails(paymentDetails) ? (
              <PaymentMethods details={paymentDetails} className="text-xs text-neutral-300" />
            ) : (
              <p className="text-xs text-neutral-300 leading-relaxed">
                Bank Transfer: {companyInfo.name}
                <br />
                Please include invoice number {invoiceNumber} in the reference.
              </p>
            )}
          </div>
          {notes && (
            <div>
              <div className="text-[11px] uppercase tracking-widest text-neutral-400 mb-1">Notes</div>
              <p className="text-xs text-neutral-300">{notes}</p>
            </div>
          )}
        </div>
        <div className="w-full md:w-1/3 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-300">Subtotal</span>
            <span className="text-sm">{formatMoney(symbol, subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-300">Discount</span>
              <span className="text-sm">-{formatMoney(symbol, discount)}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-300">
              {taxName} ({taxRate}%)
            </span>
            <span className="text-sm">{formatMoney(symbol, tax)}</span>
          </div>
          <div className="w-full h-px bg-neutral-50/30 my-2"></div>
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Amount Due</span>
            <span className="text-2xl font-bold text-amber-500">{formatMoney(symbol, total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
