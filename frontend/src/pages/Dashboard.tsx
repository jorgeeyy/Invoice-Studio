import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Plus,
} from 'lucide-react';

const stats = [
  {
    name: 'Total Revenue',
    value: '$12,450',
    change: '+12.4%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-secondary',
    bgColor: 'bg-secondary/5',
  },
  {
    name: 'Outstanding',
    value: '$4,200',
    subtitle: '5 invoices',
    icon: Clock,
    color: 'text-status-warning',
    bgColor: 'bg-status-warning/10',
  },
  {
    name: 'Overdue',
    value: '$1,200',
    subtitle: '2 invoices',
    icon: AlertCircle,
    color: 'text-status-error',
    bgColor: 'bg-status-error/10',
  },
  {
    name: 'Paid Invoices',
    value: '32',
    change: '+8%',
    trend: 'up',
    icon: CheckCircle,
    color: 'text-status-paid',
    bgColor: 'bg-status-paid/10',
  },
];

const recentInvoices = [
  { id: '1', number: '#INV-2023-001', client: 'Design Studio', date: 'Oct 12, 2023', due: 'Oct 26, 2023', amount: '$2,450.00', status: 'paid', initials: 'D' },
  { id: '2', number: '#INV-2023-002', client: 'Acme Corp', date: 'Oct 15, 2023', due: 'Oct 29, 2023', amount: '$1,200.00', status: 'sent', initials: 'A' },
  { id: '3', number: '#INV-2023-003', client: 'Krystal Klear', date: 'Oct 01, 2023', due: 'Oct 15, 2023', amount: '$850.00', status: 'overdue', initials: 'K' },
];

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  sent: 'bg-status-sent/10 text-status-sent',
  paid: 'bg-status-paid/10 text-status-paid',
  overdue: 'bg-status-error/10 text-status-error',
};

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline text-2xl font-bold text-primary tracking-tight">Good morning, George</h2>
          <p className="text-on-surface-variant mt-1">Here's what's happening with your business.</p>
        </div>
        <Link
          to="/invoices/create"
          className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-sm w-fit"
        >
          <Plus className="w-5 h-5" />
          Create invoice
        </Link>
      </div>

      {/* Summary Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-surface-container-lowest p-5 rounded-xl border border-border-subtle hover:border-secondary/20 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">{stat.name}</span>
              <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="font-headline text-2xl font-bold text-primary">{stat.value}</h3>
              {stat.change && (
                <span className={`text-xs font-semibold flex items-center ${
                  stat.trend === 'up' ? 'text-status-paid' : 'text-status-error'
                }`}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.change}
                </span>
              )}
              {stat.subtitle && (
                <span className="text-xs text-on-surface-variant font-medium">{stat.subtitle}</span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              {stat.name === 'Total Revenue' && 'Last 30 days'}
              {stat.name === 'Outstanding' && 'Awaiting payment'}
              {stat.name === 'Overdue' && 'Action required'}
              {stat.name === 'Paid Invoices' && 'This month'}
            </p>
          </div>
        ))}
      </div>

      {/* Charts and Activity Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden flex flex-col">
          <div className="p-6 flex items-center justify-between border-b border-border-subtle">
            <div>
              <h4 className="font-headline text-lg font-semibold text-primary">Revenue Growth</h4>
              <p className="text-xs text-on-surface-variant">Daily performance overview</p>
            </div>
            <div className="flex gap-2">
              <button className="text-xs font-medium px-3 py-1 rounded bg-surface-container-high">7D</button>
              <button className="text-xs font-medium px-3 py-1 rounded hover:bg-surface-container transition-colors">1M</button>
              <button className="text-xs font-medium px-3 py-1 rounded hover:bg-surface-container transition-colors">1Y</button>
            </div>
          </div>
          <div className="p-6 flex-1 min-h-[300px] relative flex items-end justify-between gap-1">
            <div className="w-full h-full relative z-10 flex items-end gap-2 sm:gap-4 px-2">
              <div className="flex-1 bg-secondary/10 hover:bg-secondary/20 transition-colors rounded-t-sm h-[40%]"></div>
              <div className="flex-1 bg-secondary/10 hover:bg-secondary/20 transition-colors rounded-t-sm h-[65%]"></div>
              <div className="flex-1 bg-secondary/20 hover:bg-secondary/30 transition-colors rounded-t-sm h-[50%]"></div>
              <div className="flex-1 bg-secondary/10 hover:bg-secondary/20 transition-colors rounded-t-sm h-[85%]"></div>
              <div className="flex-1 bg-secondary/40 hover:bg-secondary/50 transition-colors rounded-t-sm h-[60%]"></div>
              <div className="flex-1 bg-secondary/30 hover:bg-secondary/40 transition-colors rounded-t-sm h-[75%]"></div>
              <div className="flex-1 bg-secondary hover:bg-secondary/90 transition-colors rounded-t-sm h-[95%]"></div>
            </div>
          </div>
          <div className="px-8 pb-4 flex justify-between text-xs text-on-surface-variant">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Quick Actions / Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-primary text-white p-6 rounded-xl relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-headline text-lg font-semibold mb-2">Automate your finances</h4>
              <p className="text-sm text-white/80 leading-relaxed mb-4">Connect your bank account to automatically reconcile payments with your invoices.</p>
              <button className="bg-white text-primary px-4 py-2 rounded-lg font-semibold text-sm hover:bg-surface-bright transition-colors">Connect Bank</button>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-5">
            <h4 className="font-headline text-lg font-semibold text-primary mb-4">Upcoming Due Dates</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center font-bold text-primary">A</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Acme Corp</p>
                  <p className="text-xs text-status-warning">Due in 2 days</p>
                </div>
                <p className="font-semibold">$1,200</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center font-bold text-primary">S</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Stripe Inc</p>
                  <p className="text-xs text-on-surface-variant">Due in 5 days</p>
                </div>
                <p className="font-semibold">$450</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <section className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <h4 className="font-headline text-lg font-semibold text-primary">Recent Invoices</h4>
          <Link to="/invoices" className="text-secondary text-xs font-semibold hover:underline">View all invoices</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Invoice</th>
                <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Due</th>
                <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 border-b border-border-subtle"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {recentInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-surface-container/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold">{invoice.number}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-container text-white text-[10px] flex items-center justify-center">{invoice.initials}</div>
                      {invoice.client}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{invoice.date}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{invoice.due}</td>
                  <td className="px-6 py-4 text-sm font-semibold">{invoice.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${statusColors[invoice.status]}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant">
                      <span className="text-sm">···</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
