import type { Currency, InvoiceTemplate } from '@/types';

export interface InvoicePreviewProps {
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

export const capsClass = 'text-[11px] uppercase tracking-wider text-on-surface-variant';

export function formatMoney(symbol: string, value: number): string {
  return `${symbol}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(iso: string): string {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function MultiLine({ text, className }: { text?: string; className?: string }) {
  if (!text) return null;
  return (
    <span className={className}>
      {text.split('\n').map((line, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {line}
        </span>
      ))}
    </span>
  );
}

export function hasPaymentDetails(pd?: InvoicePreviewProps['paymentDetails']): boolean {
  if (!pd) return false;
  return Boolean(
    (pd.bank?.name ||
      pd.bank?.accountName ||
      pd.bank?.accountNumber ||
      pd.bank?.routingNumber ||
      pd.bank?.iban ||
      pd.bank?.swift) ||
      (pd.momo?.provider || pd.momo?.number) ||
      (pd.crypto?.network || pd.crypto?.address) ||
      (pd.custom1?.label && pd.custom1?.value) ||
      (pd.custom2?.label && pd.custom2?.value),
  );
}

export function PaymentMethods({
  details,
  className,
}: {
  details?: InvoicePreviewProps['paymentDetails'];
  className?: string;
}) {
  if (!hasPaymentDetails(details)) return null;
  const pd = details!;
  return (
    <div className={className}>
      {pd.bank?.name && (
        <div className="mb-2">
          <p className="font-semibold">Bank Transfer</p>
          <p>{pd.bank.name}</p>
          {pd.bank.accountName && <p>Account Name: {pd.bank.accountName}</p>}
          {pd.bank.accountNumber && <p>Account No: {pd.bank.accountNumber}</p>}
          {pd.bank.routingNumber && <p>Routing: {pd.bank.routingNumber}</p>}
          {pd.bank.iban && <p>IBAN: {pd.bank.iban}</p>}
          {pd.bank.swift && <p>SWIFT: {pd.bank.swift}</p>}
        </div>
      )}
      {pd.momo?.provider && (
        <div className="mb-2">
          <p className="font-semibold">Mobile Money</p>
          <p>
            {pd.momo.provider}: {pd.momo.number}
          </p>
          {pd.momo.name && <p>Name: {pd.momo.name}</p>}
        </div>
      )}
      {pd.crypto?.network && (
        <div className="mb-2">
          <p className="font-semibold">Crypto ({pd.crypto.network})</p>
          <p className="break-all">{pd.crypto.address}</p>
          {pd.crypto.label && <p>{pd.crypto.label}</p>}
        </div>
      )}
      {pd.custom1?.label && pd.custom1?.value && (
        <div className="mb-2">
          <p className="font-semibold">{pd.custom1.label}</p>
          <p>{pd.custom1.value}</p>
        </div>
      )}
      {pd.custom2?.label && pd.custom2?.value && (
        <div className="mb-2">
          <p className="font-semibold">{pd.custom2.label}</p>
          <p>{pd.custom2.value}</p>
        </div>
      )}
    </div>
  );
}
