import { Link } from 'react-router-dom';
import { FileText, Users, Package, FileEdit, Plus, ArrowRight } from 'lucide-react';
import { useInvoices } from '@/hooks/useInvoices';
import { useClients } from '@/hooks/useClients';
import { useProducts } from '@/hooks/useProducts';

const statusColors: Record<string, string> = {
  draft: 'bg-status-draft/10 text-status-draft',
  final: 'bg-status-draft/10 text-status-draft',
  sent: 'bg-status-sent/10 text-status-sent',
  paid: 'bg-status-paid/10 text-status-paid',
  overdue: 'bg-status-error/10 text-status-error',
  cancelled: 'bg-status-cancelled/10 text-status-cancelled',
};

export function Dashboard() {
  const { data: invoices } = useInvoices();
  const { data: clients } = useClients();
  const { data: products } = useProducts();

  const draftCount = invoices?.filter((inv) => inv.status === 'draft').length || 0;
  const recentInvoices = invoices?.slice(0, 5) || [];

  const stats = [
    {
      name: 'Invoices Created',
      value: invoices?.length || 0,
      icon: FileText,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      href: '/invoices',
    },
    {
      name: 'Clients',
      value: clients?.length || 0,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      href: '/clients',
    },
    {
      name: 'Products',
      value: products?.length || 0,
      icon: Package,
      color: 'text-status-warning',
      bgColor: 'bg-status-warning/10',
      href: '/products',
    },
    {
      name: 'Drafts',
      value: draftCount,
      icon: FileEdit,
      color: 'text-on-surface-variant',
      bgColor: 'bg-surface-container-high',
      href: '/invoices',
    },
  ];

  const quickActions = [
    {
      name: 'Create Invoice',
      description: 'Start a new invoice',
      icon: FileText,
      href: '/invoices/create',
      color: 'bg-secondary',
    },
    {
      name: 'Add Client',
      description: 'Add a new client',
      icon: Users,
      href: '/clients',
      color: 'bg-secondary',
    },
    {
      name: 'Add Product',
      description: 'Add to your catalog',
      icon: Package,
      href: '/products',
      color: 'bg-status-warning',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline text-2xl font-bold text-primary tracking-tight">Dashboard</h2>
          <p className="text-on-surface-variant mt-1">Welcome back! Here's an overview of your business.</p>
        </div>
        <Link
          to="/invoices/create"
          className="bg-secondary text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-sm w-fit"
        >
          <Plus className="w-5 h-5" />
          Create Invoice
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="bg-surface-container-lowest p-5 rounded-xl border border-border-subtle hover:border-secondary/20 transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">{stat.name}</span>
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <h3 className="font-headline text-3xl font-bold text-primary">{stat.value}</h3>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.name}
            to={action.href}
            className="bg-surface-container-lowest p-5 rounded-xl border border-border-subtle hover:border-secondary/20 transition-all group flex items-center gap-4"
          >
            <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
              <action.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-primary">{action.name}</h4>
              <p className="text-xs text-on-surface-variant">{action.description}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-secondary group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>

      {/* Recent Invoices */}
      <section className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <h4 className="font-headline text-lg font-semibold text-primary">Recent Invoices</h4>
          <Link to="/invoices" className="text-secondary text-xs font-semibold hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {recentInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Invoice</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-surface-container/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold">{invoice.invoiceNumber}</td>
                    <td className="px-6 py-4 text-sm">{invoice.clientName}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      {new Date(invoice.issueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      {invoice.currency === 'USD' ? '$' : invoice.currency === 'EUR' ? '€' : invoice.currency === 'GBP' ? '£' : invoice.currency}
                      {invoice.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${statusColors[invoice.status]}`}>
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-on-surface-variant mx-auto mb-4" />
            <p className="text-on-surface-variant mb-4">No invoices yet. Create your first invoice!</p>
            <Link
              to="/invoices/create"
              className="inline-flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" /> Create Invoice
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
