import { MultiLine, PaymentMethods, capsClass, formatDate, formatMoney } from './shared';
import type { InvoicePreviewProps } from './shared';

export function MinimalTemplate({
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
      className="invoice-sheet bg-surface-container-lowest w-full max-w-[800px] min-h-[842px] p-12 flex flex-col shadow-sm rounded-xl border border-border-subtle overflow-hidden print:max-w-none print:rounded-none print:shadow-none print:border-0 print:overflow-visible"
    >
      <div className="flex flex-col md:flex-row justify-between items-start mb-24 gap-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-4 uppercase text-primary">{companyInfo.name}</h1>
          <div className="text-xs text-on-surface-variant space-y-1">
            <p>
              <MultiLine text={companyInfo.address} />
            </p>
            <p>{companyInfo.email}</p>
          </div>
        </div>
        <div className="text-left md:text-right">
          <div className={`${capsClass} mb-2`}>Invoice No.</div>
          <div className="text-lg font-semibold text-primary mb-6">{invoiceNumber}</div>
          <div className="flex gap-8 md:justify-end">
            <div>
              <div className={`${capsClass} mb-1`}>Date Issued</div>
              <div className="text-sm text-primary">{date}</div>
            </div>
            {ref && (
              <div>
                <div className={`${capsClass} mb-1`}>Reference</div>
                <div className="text-sm text-primary">{ref}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-16 border-t border-border-subtle pt-8">
        <div className={`${capsClass} mb-4`}>Billed To</div>
        <h2 className="text-lg font-semibold text-primary mb-2">{clientInfo.company || clientInfo.name}</h2>
        <div className="text-xs text-on-surface-variant space-y-1">
          <p>{clientInfo.name}</p>
          <p>
            <MultiLine text={clientInfo.address} />
          </p>
        </div>
      </div>

      <div className="mb-16 flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className={`py-3 ${capsClass} w-1/2`}>Description</th>
              <th className={`py-3 ${capsClass} text-right`}>Qty / Hrs</th>
              <th className={`py-3 ${capsClass} text-right`}>Rate</th>
              <th className={`py-3 ${capsClass} text-right`}>Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {items.map((item, index) => (
              <tr key={index} className="border-b border-border-subtle/50">
                <td className="py-4 pr-4">
                  <div className="font-medium text-primary">{item.name || 'Item'}</div>
                  {item.description && <div className="text-xs text-on-surface-variant mt-1">{item.description}</div>}
                </td>
                <td className="py-4 text-right align-top text-primary">{item.quantity}</td>
                <td className="py-4 text-right align-top text-primary">{formatMoney(symbol, item.unitPrice)}</td>
                <td className="py-4 text-right align-top text-primary">
                  {formatMoney(symbol, item.quantity * item.unitPrice - item.discount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end pt-8 border-t border-border-subtle">
        <div className="w-full md:w-1/2 lg:w-1/3 space-y-3">
          <div className="flex justify-between text-sm text-on-surface-variant">
            <span>Subtotal</span>
            <span className="text-primary">{formatMoney(symbol, subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-on-surface-variant">
              <span>Discount</span>
              <span className="text-primary">-{formatMoney(symbol, discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-on-surface-variant">
            <span>
              {taxName} ({taxRate}%)
            </span>
            <span className="text-primary">{formatMoney(symbol, tax)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold text-primary pt-3 border-t border-border-subtle">
            <span>Total Due</span>
            <span>{formatMoney(symbol, total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-24 pt-8 border-t border-border-subtle">
        <div className={`${capsClass} mb-2`}>Payment Notes</div>
        {notes && <p className="text-xs text-on-surface-variant mb-3">{notes}</p>}
        <p className="text-xs text-on-surface-variant mb-3">
          <span className="font-semibold text-primary">Payment Terms:</span> {paymentTerms}
        </p>
        <PaymentMethods details={paymentDetails} className="text-xs text-on-surface-variant" />
      </div>
    </div>
  );
}
