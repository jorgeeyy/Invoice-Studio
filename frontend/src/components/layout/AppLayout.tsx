import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:ml-60 min-h-screen">
        <Header />
        <div className="p-4 md:p-8 max-w-[1440px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
