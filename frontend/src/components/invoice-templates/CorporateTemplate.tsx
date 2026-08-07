import { MultiLine, capsClass, formatDate, formatMoney } from './shared';
import type { InvoicePreviewProps } from './shared';

export function CorporateTemplate({
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
  const bank = paymentDetails?.bank;
  const bankRows: Array<[string, string]> = [];
  if (bank?.name) bankRows.push(['Bank Name', bank.name]);
  if (bank?.accountName) bankRows.push(['Account Name', bank.accountName]);
  if (bank?.accountNumber) bankRows.push(['Account No', bank.accountNumber]);
  if (bank?.routingNumber) bankRows.push(['Routing No', bank.routingNumber]);
  if (bank?.iban) bankRows.push(['IBAN', bank.iban]);
  if (bank?.swift) bankRows.push(['SWIFT', bank.swift]);

  return (
    <div
      className="bg-surface-container-lowest w-full max-w-[800px] min-h-[842px] flex flex-col shadow-sm rounded-xl border border-border-subtle overflow-hidden"
      style={{ aspectRatio: '1 / 1.4142' }}
    >
      <div className="bg-neutral-900 text-neutral-50 p-8 flex justify-between items-start gap-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">{companyInfo.name}</h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            <MultiLine text={companyInfo.address} />
            <span className="block">{companyInfo.email}</span>
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold mb-1">INVOICE</div>
          <div className="text-[11px] uppercase tracking-wider text-neutral-400">{invoiceNumber}</div>
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-12 mb-8 pb-8 border-b border-border-subtle">
          <div>
            <div className={`${capsClass} mb-2`}>Billed From</div>
            <p className="text-sm font-semibold text-primary">{companyInfo.name}</p>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              <MultiLine text={companyInfo.address} />
              <br />
              {companyInfo.email}
            </p>
          </div>
          <div>
            <div className={`${capsClass} mb-2`}>Billed To</div>
            <p className="text-sm font-semibold text-primary">{clientInfo.company || clientInfo.name}</p>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {clientInfo.name}
              <br />
              <MultiLine text={clientInfo.address} />
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div>
            <div className={`${capsClass} mb-1`}>Invoice Date</div>
            <p className="text-sm text-primary">{date}</p>
          </div>
          <div>
            <div className={`${capsClass} mb-1`}>Terms</div>
            <p className="text-sm font-semibold text-primary">{paymentTerms}</p>
          </div>
          <div>
            <div className={`${capsClass} mb-1`}>Reference</div>
            <p className="text-sm text-primary">{ref || '—'}</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-[3fr_1fr_1fr_1fr] bg-surface-container-low/50 p-3 rounded-t-lg border-b border-border-subtle">
            <div className={capsClass}>Description</div>
            <div className={`${capsClass} text-right`}>Rate</div>
            <div className={`${capsClass} text-right`}>Hours/Qty</div>
            <div className={`${capsClass} text-right`}>Amount</div>
          </div>
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-[3fr_1fr_1fr_1fr] p-3 border-b border-border-subtle">
              <div>
                <p className="text-sm text-primary">{item.name || 'Item'}</p>
                {item.description && <p className="text-xs text-on-surface-variant mt-0.5">{item.description}</p>}
              </div>
              <div className="text-sm text-primary text-right">{formatMoney(symbol, item.unitPrice)}</div>
              <div className="text-sm text-primary text-right">{item.quantity}</div>
              <div className="text-sm text-primary text-right font-semibold">
                {formatMoney(symbol, item.quantity * item.unitPrice - item.discount)}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-auto mb-12">
          <div className="w-[300px] space-y-3">
            <div className="flex justify-between text-sm text-on-surface-variant">
              <span>Subtotal</span>
              <span>{formatMoney(symbol, subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-on-surface-variant">
                <span>Discount</span>
                <span>-{formatMoney(symbol, discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-on-surface-variant">
              <span>
                {taxName} ({taxRate}%)
              </span>
              <span>{formatMoney(symbol, tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-primary pt-3 border-t border-border-subtle">
              <span>Total Due</span>
              <span>{formatMoney(symbol, total)}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border-subtle pt-8 grid grid-cols-2 gap-8">
          {bankRows.length > 0 ? (
            <div>
              <div className={`${capsClass} mb-3`}>Bank Details for Wire Transfer</div>
              <div className="bg-surface-container-low p-4 rounded-lg space-y-2">
                {bankRows.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-2">
                    <span className="text-xs text-on-surface-variant">{label}:</span>
                    <span className="text-sm text-primary">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div />
          )}
          <div className="flex flex-col justify-end">
            <p className="text-xs text-on-surface-variant text-right leading-relaxed">
              {notes ||
                `Please include invoice number ${invoiceNumber} in the payment reference. Payment is due within ${paymentTerms}.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
