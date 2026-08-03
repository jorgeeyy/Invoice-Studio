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
import { useQuotes } from '@/hooks/useQuotes';

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  sent: 'bg-status-sent/10 text-status-sent',
  accepted: 'bg-status-paid/10 text-status-paid',
  rejected: 'bg-status-error/10 text-status-error',
  expired: 'bg-gray-100 text-gray-500',
};

export function QuoteList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { data: quotes, isLoading } = useQuotes();

  const filteredQuotes = quotes?.filter((quote) => {
    const matchesSearch =
      quote.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline text-2xl font-bold text-primary tracking-tight">Quotes</h2>
          <p className="text-on-surface-variant mt-1">Manage and track your quotes</p>
        </div>
        <Link
          to="/quotes/create"
          className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-sm w-fit"
        >
          <Plus className="w-5 h-5" />
          New Quote
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
          <input
            type="text"
            placeholder="Search quotes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-low border border-border-subtle rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Quote Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-border-subtle overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50">
              <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Quote</th>
              <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Valid Until</th>
              <th className="px-6 py-3 border-b border-border-subtle"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent"></div>
                  </div>
                </td>
              </tr>
            ) : filteredQuotes?.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <FileText className="mx-auto h-12 w-12 text-on-surface-variant" />
                  <h3 className="mt-2 text-sm font-semibold text-primary">No quotes</h3>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    Get started by creating a new quote.
                  </p>
                  <Link
                    to="/quotes/create"
                    className="mt-4 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    New Quote
                  </Link>
                </td>
              </tr>
            ) : (
              filteredQuotes?.map((quote) => (
                <tr key={quote.id} className="hover:bg-surface-container/30 transition-colors">
                  <td className="px-6 py-4">
                    <Link
                      to={`/quotes/${quote.id}`}
                      className="flex items-center gap-2"
                    >
                      <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold">{quote.quoteNumber}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">{quote.clientName}</div>
                    <div className="text-xs text-on-surface-variant">{quote.clientEmail}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold">${quote.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${statusColors[quote.status]}`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">
                    {new Date(quote.validUntil).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant" title="Send">
                        <Send className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
