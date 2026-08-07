import { Wallet } from 'lucide-react';
import { MultiLine, PaymentMethods, capsClass, formatDate, formatMoney } from './shared';
import type { InvoicePreviewProps } from './shared';

export function ModernTemplate({
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
      className="bg-surface-container-lowest w-full max-w-[800px] min-h-[842px] p-10 lg:p-12 flex flex-col lg:flex-row gap-12 shadow-sm rounded-xl border border-border-subtle overflow-hidden relative"
      style={{ aspectRatio: '1 / 1.4142' }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-secondary" />

      <div className="lg:w-1/3 flex flex-col gap-8 border-b lg:border-b-0 lg:border-r border-border-subtle pb-8 lg:pb-0 lg:pr-8">
        <div>
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-on-primary mb-4">
            <Wallet className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold text-primary">{companyInfo.name}</h3>
          <p className="text-sm text-on-surface-variant mt-1">
            <MultiLine text={companyInfo.address} />
            <br />
            {companyInfo.email}
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <p className={`${capsClass} mb-1`}>Invoice Number</p>
            <p className="text-sm text-primary">{invoiceNumber}</p>
          </div>
          <div>
            <p className={`${capsClass} mb-1`}>Date Issued</p>
            <p className="text-sm text-primary">{date}</p>
          </div>
          {ref && (
            <div>
              <p className={`${capsClass} mb-1`}>Reference</p>
              <p className="text-sm text-primary">{ref}</p>
            </div>
          )}
        </div>
      </div>

      <div className="lg:w-2/3 flex flex-col">
        <div className="mb-10">
          <p className={`${capsClass} mb-2`}>Billed To</p>
          <h4 className="text-lg font-semibold text-primary">{clientInfo.company || clientInfo.name}</h4>
          <p className="text-sm text-on-surface-variant mt-1">
            {clientInfo.name}
            <br />
            <MultiLine text={clientInfo.address} />
          </p>
        </div>

        <div className="flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-border-subtle">
                <th className={`py-3 px-4 ${capsClass}`}>Description</th>
                <th className={`py-3 px-4 ${capsClass} text-right`}>Qty</th>
                <th className={`py-3 px-4 ${capsClass} text-right`}>Rate</th>
                <th className={`py-3 px-4 ${capsClass} text-right`}>Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {items.map((item, index) => (
                <tr key={index} className="border-b border-border-subtle">
                  <td className="py-4 px-4 text-primary">
                    <p className="font-semibold">{item.name || 'Item'}</p>
                    {item.description && <p className="text-xs text-on-surface-variant mt-0.5">{item.description}</p>}
                  </td>
                  <td className="py-4 px-4 text-right text-on-surface-variant">{item.quantity}</td>
                  <td className="py-4 px-4 text-right text-on-surface-variant">{formatMoney(symbol, item.unitPrice)}</td>
                  <td className="py-4 px-4 text-right text-primary font-semibold">
                    {formatMoney(symbol, item.quantity * item.unitPrice - item.discount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-end">
          <div className="w-full max-w-sm">
            <div className="flex justify-between py-2 border-b border-border-subtle text-sm text-on-surface-variant">
              <span>Subtotal</span>
              <span>{formatMoney(symbol, subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between py-2 border-b border-border-subtle text-sm text-on-surface-variant">
                <span>Discount</span>
                <span>-{formatMoney(symbol, discount)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b border-border-subtle text-sm text-on-surface-variant">
              <span>
                {taxName} ({taxRate}%)
              </span>
              <span>{formatMoney(symbol, tax)}</span>
            </div>
            <div className="flex justify-between py-4 mt-2 text-xl font-bold text-secondary border-t-2 border-secondary">
              <span>Total Due</span>
              <span>{formatMoney(symbol, total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border-subtle">
          <p className={`${capsClass} mb-2`}>Notes</p>
          {notes && <p className="text-xs text-on-surface-variant mb-3">{notes}</p>}
          <p className="text-xs text-on-surface-variant mb-3">
            <span className="font-semibold text-primary">Payment Terms:</span> {paymentTerms}
          </p>
          <PaymentMethods details={paymentDetails} className="text-xs text-on-surface-variant" />
        </div>
      </div>
    </div>
  );
}
