import { useState } from 'react';
import { 
  MoreHorizontal,
  TrendingUp,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const clientData = [
  { id: '1', name: 'Vortex Digital', clientId: 'CLI-0082', contact: 'Sarah Jenkins', email: 's.jenkins@vortex.io', invoices: 14, totalBilled: 28450, outstanding: 0 },
  { id: '2', name: 'Aether Design Studio', clientId: 'CLI-0124', contact: 'Marcus Thorne', email: 'm.thorne@aether.co', invoices: 8, totalBilled: 12200, outstanding: 2450 },
  { id: '3', name: 'Kinetics Corp', clientId: 'CLI-0041', contact: 'Lila Chen', email: 'lila.c@kinetics.net', invoices: 32, totalBilled: 45900, outstanding: 8120 },
  { id: '4', name: 'Project Orion', clientId: 'CLI-0095', contact: 'David Orion', email: 'billing@orion.space', invoices: 5, totalBilled: 8400, outstanding: 0 },
];

export function ClientList() {
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline text-2xl font-bold text-primary">Clients</h2>
          <p className="text-sm text-on-surface-variant mt-1">Manage your customer relationships and track billing history.</p>
        </div>
        <button className="bg-secondary text-white px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-blue-700 transition-all shadow-sm">
          + Add Client
        </button>
      </section>

      {/* Stats Overview */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest border border-border-subtle p-5 rounded-xl flex flex-col gap-2 hover:border-secondary transition-colors group">
          <span className="text-xs font-bold uppercase text-on-surface-variant">Total Clients</span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold">124</span>
            <span className="text-status-paid text-xs font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-border-subtle p-5 rounded-xl flex flex-col gap-2 hover:border-secondary transition-colors group">
          <span className="text-xs font-bold uppercase text-on-surface-variant">Active This Month</span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold">48</span>
            <span className="text-on-surface-variant text-xs font-medium">82% engagement</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-border-subtle p-5 rounded-xl flex flex-col gap-2 hover:border-secondary transition-colors group">
          <span className="text-xs font-bold uppercase text-on-surface-variant">Total Billed</span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold">$142,500</span>
            <span className="text-status-paid text-xs font-semibold flex items-center gap-1">
              <span className="text-sm">$</span>
            </span>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-border-subtle p-5 rounded-xl flex flex-col gap-2 border-l-4 border-l-status-warning hover:border-secondary transition-colors group">
          <span className="text-xs font-bold uppercase text-on-surface-variant">Total Outstanding</span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-status-warning">$18,240</span>
            <span className="text-on-surface-variant text-xs font-medium">12 Invoices</span>
          </div>
        </div>
      </section>

      {/* Table Filters and List */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden flex flex-col">
        {/* Table Controls */}
        <div className="p-4 border-b border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 p-1 bg-surface-container-low rounded-lg w-fit">
            <button 
              onClick={() => setActiveTab('active')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'active' ? 'bg-surface-container-lowest shadow-sm text-secondary' : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              Active
            </button>
            <button 
              onClick={() => setActiveTab('archived')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'archived' ? 'bg-surface-container-lowest shadow-sm text-secondary' : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              Archived
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 border border-border-subtle rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container-low transition-colors">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-border-subtle rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container-low transition-colors">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        {/* Clients Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant border-b border-border-subtle">Client Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant border-b border-border-subtle">Primary Contact</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant border-b border-border-subtle text-center">Invoices</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant border-b border-border-subtle text-right">Total Billed</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant border-b border-border-subtle text-right">Outstanding</th>
                <th className="px-6 py-4 border-b border-border-subtle"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {clientData.map((client) => (
                <tr key={client.id} className="group hover:bg-surface-container-low/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary font-bold text-lg">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-primary">{client.name}</p>
                        <p className="text-xs text-on-surface-variant">ID: {client.clientId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-sm text-primary">{client.contact}</p>
                      <p className="text-xs text-on-surface-variant">{client.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-surface-container px-2.5 py-1 rounded-full text-xs font-semibold">{client.invoices}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-sm">${client.totalBilled.toLocaleString()}.00</td>
                  <td className="px-6 py-4 text-right font-medium text-sm">
                    {client.outstanding > 0 ? (
                      <span className="text-status-warning">${client.outstanding.toLocaleString()}.00</span>
                    ) : (
                      <span className="text-status-paid">$0.00</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-on-surface-variant hover:text-primary transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border-subtle flex items-center justify-between">
          <p className="text-xs text-on-surface-variant">Showing 1 to 4 of 124 clients</p>
          <div className="flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-border-subtle hover:bg-surface-container-low transition-colors disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-secondary text-white font-bold text-xs">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-border-subtle hover:bg-surface-container-low font-bold text-xs">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-border-subtle hover:bg-surface-container-low font-bold text-xs">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-border-subtle hover:bg-surface-container-low transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Contextual Quick Actions */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-surface-container-lowest border border-border-subtle p-6 rounded-xl flex flex-col gap-4">
          <h3 className="font-headline text-sm font-semibold">Client Growth Activity</h3>
          <div className="h-48 relative overflow-hidden rounded-lg bg-surface-container-low group">
            <div className="absolute inset-0 flex items-end justify-between px-6 pb-4">
              <div className="w-8 bg-secondary/20 rounded-t-sm h-[40%] transition-all group-hover:h-[45%]"></div>
              <div className="w-8 bg-secondary/30 rounded-t-sm h-[60%] transition-all group-hover:h-[65%]"></div>
              <div className="w-8 bg-secondary/40 rounded-t-sm h-[35%] transition-all group-hover:h-[40%]"></div>
              <div className="w-8 bg-secondary/50 rounded-t-sm h-[75%] transition-all group-hover:h-[80%]"></div>
              <div className="w-8 bg-secondary/60 rounded-t-sm h-[55%] transition-all group-hover:h-[60%]"></div>
              <div className="w-8 bg-secondary/70 rounded-t-sm h-[90%] transition-all group-hover:h-[95%]"></div>
              <div className="w-8 bg-secondary/80 rounded-t-sm h-[65%] transition-all group-hover:h-[70%]"></div>
              <div className="w-8 bg-secondary rounded-t-sm h-[85%] transition-all group-hover:h-[90%]"></div>
            </div>
            <div className="absolute top-4 left-4">
              <p className="text-xs font-bold text-secondary uppercase tracking-widest">New Clients per Month</p>
            </div>
          </div>
        </div>
        <div className="bg-primary text-white p-6 rounded-xl flex flex-col justify-between overflow-hidden relative">
          <div className="z-10">
            <h3 className="font-headline text-sm font-semibold mb-2">Automate Follow-ups</h3>
            <p className="text-sm opacity-80 mb-6">Enable smart reminders to automatically nudge clients with outstanding balances.</p>
            <button className="bg-white text-primary px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors">
              Configure Settings
            </button>
          </div>
          <span className="absolute -bottom-4 -right-4 text-[120px] opacity-10 select-none pointer-events-none">✨</span>
        </div>
      </section>
    </div>
  );
}
