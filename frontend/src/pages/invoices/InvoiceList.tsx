import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  MoreHorizontal,
  FileText,
  Download,
  Send,
} from 'lucide-react';
import { useInvoices } from '@/hooks/useInvoices';
import type { Currency } from '@/types';

const statusColors: Record<string, string> = {
  draft: 'bg-status-draft/10 text-status-draft',
  final: 'bg-status-draft/10 text-status-draft',
  sent: 'bg-status-sent/10 text-status-sent',
  paid: 'bg-status-paid/10 text-status-paid',
  overdue: 'bg-status-error/10 text-status-error',
  cancelled: 'bg-status-cancelled/10 text-status-cancelled',
};

const currencySymbol: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  GHS: 'GH₵',
  CAD: 'CA$',
  AUD: 'A$',
};

export function InvoiceList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { data: invoices, isLoading } = useInvoices();

  const filteredInvoices = invoices?.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline text-2xl font-bold text-primary tracking-tight">Invoices</h2>
          <p className="text-on-surface-variant mt-1">Manage and track your invoices</p>
        </div>
        <Link
          to="/invoices/create"
          className="bg-secondary text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-sm w-fit"
        >
          <Plus className="w-5 h-5" />
          New Invoice
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-surface-container-low border border-border-subtle rounded-lg pl-10 pr-4 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 bg-surface-container-low border border-border-subtle rounded-lg px-4 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="final">Final</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Invoice Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-border-subtle overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
            <p className="text-on-surface-variant mt-4 text-sm">Loading invoices...</p>
          </div>
        ) : filteredInvoices && filteredInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Invoice</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 border-b border-border-subtle"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-surface-container/30 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        to={`/invoices/${invoice.id}`}
                        className="flex items-center gap-2"
                      >
                        <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold">{invoice.invoiceNumber}</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{invoice.clientName}</div>
                      <div className="text-xs text-on-surface-variant">{invoice.clientEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      {currencySymbol[invoice.currency] || '$'}{invoice.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${statusColors[invoice.status]}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      {new Date(invoice.issueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant" title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                        {invoice.status === 'draft' && (
                          <button className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant" title="Send">
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-on-surface-variant mx-auto mb-4" />
            <p className="text-on-surface-variant">
              {searchQuery || statusFilter !== 'all' 
                ? 'No invoices found matching your filters' 
                : 'No invoices yet. Create your first invoice!'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Link
                to="/invoices/create"
                className="mt-4 inline-flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" /> Create Invoice
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
