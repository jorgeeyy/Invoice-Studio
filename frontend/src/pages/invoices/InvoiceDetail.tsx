import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  FileText,
  Copy,
  Trash2,
  Loader2,
  PencilLine,
} from 'lucide-react';
import {
  useInvoice,
  useUpdateInvoice,
  useDeleteInvoice,
  useDuplicateInvoice,
} from '@/hooks/useInvoices';
import { useBusiness } from '@/hooks/useBusiness';
import { downloadInvoicePdf } from '@/api/invoices';
import { useToast } from '@/components/Toast';
import type { Currency } from '@/types';

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  final: 'bg-blue-100 text-blue-700',
};

const currencySymbol: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  GHS: 'GH₵',
  CAD: 'CA$',
  AUD: 'A$',
};

export function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: invoice, isLoading } = useInvoice(id || '');
  const { data: business } = useBusiness();
  const updateInvoice = useUpdateInvoice();
  const deleteInvoice = useDeleteInvoice();
  const duplicateInvoice = useDuplicateInvoice();
  const { success, error: toastError } = useToast();

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="py-12 text-center">
        <FileText className="mx-auto h-12 w-12 text-on-surface-variant" />
        <h3 className="mt-2 text-sm font-semibold text-primary">Invoice not found</h3>
        <button
          onClick={() => navigate('/invoices')}
          className="mt-4 text-sm font-medium text-secondary hover:underline"
        >
          Back to invoices
        </button>
      </div>
    );
  }

  const symbol = currencySymbol[invoice.currency] || '$';

  const handleDownload = async () => {
    if (!invoice || downloading) return;
    setDownloading(true);
    try {
      const blob = await downloadInvoicePdf(invoice.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      toastError('Failed to download PDF');
      console.error('Failed to download PDF:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleSetFinal = async () => {
    try {
      await updateInvoice.mutateAsync({ id: invoice.id, input: { status: 'final' } });
      success(`Invoice ${invoice.invoiceNumber} marked as final`);
    } catch (err) {
      toastError('Failed to finalize invoice');
      console.error('Failed to finalize invoice:', err);
    }
  };

  const handleReopen = async () => {
    try {
      await updateInvoice.mutateAsync({ id: invoice.id, input: { status: 'draft' } });
      success(`Invoice ${invoice.invoiceNumber} reopened as draft`);
    } catch (err) {
      toastError('Failed to reopen invoice');
      console.error('Failed to reopen invoice:', err);
    }
  };

  const handleDuplicate = async () => {
    try {
      const dup = await duplicateInvoice.mutateAsync(invoice.id);
      success(`Invoice ${dup.invoiceNumber} created`);
      navigate(`/invoices/${dup.id}`);
    } catch (err) {
      toastError('Failed to duplicate invoice');
      console.error('Failed to duplicate invoice:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteInvoice.mutateAsync(invoice.id);
      success(`Invoice ${invoice.invoiceNumber} deleted`);
      navigate('/invoices');
    } catch (error) {
      toastError('Failed to delete invoice');
      console.error('Failed to delete invoice:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="font-headline text-2xl font-bold text-primary">{invoice.invoiceNumber}</h2>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${statusColors[invoice.status]}`}>
                {invoice.status}
              </span>
            </div>
            <p className="text-sm text-on-surface-variant mt-1">
              Created on {new Date(invoice.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button 
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-border-subtle font-semibold text-sm text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-60"
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {downloading ? 'Preparing...' : 'Download'}
          </button>
          {invoice.status === 'draft' && (
            <>
              <Link
                to={`/invoices/${invoice.id}/edit`}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-border-subtle font-semibold text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <PencilLine className="w-4 h-4" />
                Edit Draft
              </Link>
            </>
          )}
          {invoice.status === 'final' && (
            <button
              onClick={handleReopen}
              disabled={updateInvoice.isPending}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-border-subtle font-semibold text-sm text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50"
            >
              <PencilLine className="w-4 h-4" />
              {updateInvoice.isPending ? 'Opening...' : 'Reopen as Draft'}
            </button>
          )}
          <button
            onClick={handleDuplicate}
            disabled={duplicateInvoice.isPending}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-border-subtle font-semibold text-sm text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-60"
          >
            {duplicateInvoice.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {duplicateInvoice.isPending ? 'Duplicating...' : 'Duplicate'}
          </button>
          {invoice.status === 'draft' && (
            <button
              onClick={handleSetFinal}
              disabled={updateInvoice.isPending}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-secondary text-white dark:text-on-surface-variant font-semibold text-sm hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
            >
              {updateInvoice.isPending ? 'Finalizing...' : 'Mark as Final'}
            </button>
          )}
          <button
            onClick={() => setDeleteConfirm(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-status-error text-white font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setDeleteConfirm(false)}
          />
          <div className="relative bg-surface-container-lowest rounded-xl shadow-xl border border-border-subtle w-full max-w-sm p-6">
            <div className="w-12 h-12 rounded-full bg-status-error/10 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-status-error" />
            </div>
            <h3 className="font-headline text-lg font-bold text-primary">Delete invoice?</h3>
            <p className="text-sm text-on-surface-variant mt-1">
              This will permanently delete <span className="font-semibold text-primary">{invoice.invoiceNumber}</span>.
              This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirm(false)}
                disabled={deleteInvoice.isPending}
                className="flex-1 h-10 border border-border-subtle rounded-lg font-semibold text-sm hover:bg-surface-container transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteInvoice.isPending}
                className="flex-1 h-10 bg-status-error text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {deleteInvoice.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                {deleteInvoice.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Content */}
      <div className="bg-surface-container-lowest rounded-xl border border-border-subtle p-4 sm:p-8">
        {/* From/To Section */}
        <div className="grid gap-8 sm:grid-cols-2 mb-8">
          <div>
            <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">From</h3>
            <div>
              <p className="font-semibold text-primary">{business?.name || 'Your Company'}</p>
              {business?.address?.street && <p className="text-sm text-on-surface-variant">{business.address.street}</p>}
              {business?.address?.city && (
                <p className="text-sm text-on-surface-variant">
                  {[business.address.city, business.address.state, business.address.zipCode]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              )}
              {business?.email && <p className="text-sm text-on-surface-variant">{business.email}</p>}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Bill To</h3>
            <div>
              <p className="font-semibold text-primary">{invoice.clientName}</p>
              <p className="text-sm text-on-surface-variant">{invoice.clientEmail}</p>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid gap-4 sm:grid-cols-4 mb-8 p-4 bg-surface-container-low rounded-lg">
          <div>
            <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Issue Date</h3>
            <p className="font-medium text-primary">{new Date(invoice.issueDate).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Currency</h3>
            <p className="font-medium text-primary">{invoice.currency}</p>
          </div>
          {invoice.reference && (
            <div>
              <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Reference</h3>
              <p className="font-medium text-primary">{invoice.reference}</p>
            </div>
          )}
        </div>

        {/* Items Table */}
        <table className="w-full text-left border-collapse mb-6">
          <thead>
            <tr className="bg-surface-container-low/50">
              <th className="px-4 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Description</th>
              <th className="px-4 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider text-right">Qty</th>
              <th className="px-4 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider text-right">Rate</th>
              <th className="px-4 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 text-sm">{item.description}</td>
                <td className="px-4 py-3 text-sm text-on-surface-variant text-right">{item.quantity}</td>
                <td className="px-4 py-3 text-sm text-on-surface-variant text-right">{symbol}{item.unitPrice.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm font-medium text-right">{symbol}{item.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Subtotal</span>
              <span className="font-medium">{symbol}{invoice.subtotal.toLocaleString()}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Discount</span>
                <span className="font-medium">-{symbol}{invoice.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">{invoice.taxName} ({invoice.taxRate}%)</span>
              <span className="font-medium">{symbol}{invoice.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-border-subtle pt-2">
              <span className="font-semibold text-lg">Total</span>
              <span className="font-semibold text-lg">{symbol}{invoice.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-8 pt-6 border-t border-border-subtle">
            <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Notes</h3>
            <p className="text-sm text-on-surface-variant">{invoice.notes}</p>
          </div>
        )}

        {/* Payment Terms */}
        {invoice.paymentTerms && (
          <div className="mt-4">
            <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Payment Terms</h3>
            <p className="text-sm text-on-surface-variant">
              {invoice.paymentTerms.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
