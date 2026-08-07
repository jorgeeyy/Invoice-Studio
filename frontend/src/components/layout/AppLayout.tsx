import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';
import { useSession } from '@/hooks/useSession';
import { apiClient } from '@/api/client';

const SIDEBAR_KEY = 'invoice-studio:sidebar-collapsed';

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
    </div>
  );
}

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => localStorage.getItem(SIDEBAR_KEY) === 'true'
  );
  const { data: session, isPending } = useSession();
  const queryClient = useQueryClient();

  useEffect(() => {
    apiClient.setUnauthorizedHandler(() => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
    });
    return () => apiClient.setUnauthorizedHandler(null);
  }, [queryClient]);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_KEY, String(next));
      return next;
    });
  };

  if (isPending) {
    return <LoadingScreen />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

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