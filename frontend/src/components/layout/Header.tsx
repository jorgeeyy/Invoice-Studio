import { Bell, HelpCircle, Search } from 'lucide-react';

export function Header() {
  return (
    <header className="h-14 bg-surface-bright border-b border-border-subtle flex items-center justify-between px-4">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
          <input
            type="text"
            placeholder="Search invoices, clients..."
            className="w-full bg-surface-container-low border border-border-subtle rounded-lg py-1.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant">
          <Bell className="w-5 h-5" />
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant">
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
