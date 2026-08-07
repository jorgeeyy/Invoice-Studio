import { useParams } from 'react-router-dom';
import { useInvoice } from '@/hooks/useInvoices';
import { useBusiness } from '@/hooks/useBusiness';
import { InvoicePreview } from '@/components/InvoicePreview';
import type { Currency } from '@/types';

const currencySymbol: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  GHS: 'GH₵',
  CAD: 'CA$',
  AUD: 'A$',
};

const PAYMENT_TERMS_LABELS: Record<string, string> = {
  due_on_receipt: 'Due on Receipt',
  net_15: 'Net 15',
  net_30: 'Net 30',
  net_60: 'Net 60',
  custom: 'Custom terms',
};

export function PrintInvoice() {
  const { id } = useParams<{ id: string }>();
  const { data: invoice, isLoading, isError } = useInvoice(id || '');
  const { data: business } = useBusiness();

  if (isLoading) {
    return null;
  }

  if (!invoice || isError) {
    return (
      <div className="p-12 text-center text-sm text-gray-500">
        Invoice not found or you do not have access to it.
      </div>
    );
  }

  const companyAddress = business?.address
    ? [business.address.street, business.address.city, business.address.state, business.address.country]
        .filter(Boolean)
        .join(', ')
    : '';

  return (
    <div className="w-full bg-white print:bg-white">
      <div data-pdf-ready className="w-full">
        <InvoicePreview
          template={invoice.template}
          currency={invoice.currency}
          companyInfo={{
            name: business?.name || 'Your Company',
            address: companyAddress,
            email: business?.email || '',
          }}
          clientInfo={{
            name: invoice.clientName,
            company: invoice.clientName,
            address: invoice.clientEmail || '',
          }}
          invoiceNumber={invoice.invoiceNumber}
          issueDate={invoice.issueDate}
          reference={invoice.reference}
          items={invoice.items.map((item) => ({
            name: item.description,
            description: '',
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
          }))}
          subtotal={invoice.subtotal}
          discount={invoice.discount}
          taxRate={invoice.taxRate}
          taxName={invoice.taxName}
          tax={invoice.tax}
          total={invoice.total}
          notes={invoice.notes}
          paymentTerms={PAYMENT_TERMS_LABELS[invoice.paymentTerms] || invoice.paymentTerms}
          paymentDetails={undefined}
          currencySymbol={currencySymbol}
        />
      </div>
    </div>
  );
}