import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';

const SIDEBAR_KEY = 'invoice-studio:sidebar-collapsed';

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => localStorage.getItem(SIDEBAR_KEY) === 'true'
  );

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_KEY, String(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {!sidebarCollapsed && <Sidebar />}
      <main className={cn('min-h-screen', !sidebarCollapsed && 'md:ml-60')}>
        <Header onToggleSidebar={toggleSidebar} sidebarCollapsed={sidebarCollapsed} />
        <div className="p-4 md:p-8 max-w-[1440px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
