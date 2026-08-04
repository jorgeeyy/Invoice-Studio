import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Package,
  Users,
  Settings,
  PenTool,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Products', href: '/products', icon: Package },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex h-screen w-60 fixed left-0 top-0 bg-surface border-r border-border-subtle flex-col py-6 px-4 z-50">
      <div className="mb-10 px-2 flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center rounded-xl shadow-md">
          <PenTool className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-headline text-lg font-bold text-primary leading-tight">Invoice Studio</h1>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Creative Suite</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                isActive
                  ? 'text-secondary font-semibold bg-surface-container-high'
                  : 'text-on-surface-variant hover:bg-surface-container'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-border-subtle">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
              isActive
                ? 'text-secondary font-semibold bg-surface-container-high'
                : 'text-on-surface-variant hover:bg-surface-container'
            )
          }
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm">Settings</span>
        </NavLink>

        <div className="mt-4 px-3 py-3 bg-gradient-to-r from-secondary/5 to-transparent rounded-xl border border-secondary/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-sm">
            G
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">George Wilson</p>
            <p className="text-[10px] text-secondary uppercase tracking-wider font-semibold">Studio</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
