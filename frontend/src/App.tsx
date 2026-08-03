import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout';
import { Landing } from '@/pages/Landing';
import { Login } from '@/pages/Login';
import { Signup } from '@/pages/Signup';
import { Dashboard } from '@/pages/Dashboard';
import { InvoiceList } from '@/pages/invoices/InvoiceList';
import { CreateInvoice } from '@/pages/invoices/CreateInvoice';
import { InvoiceDetail } from '@/pages/invoices/InvoiceDetail';
import { QuoteList } from '@/pages/quotes/QuoteList';
import { ClientList } from '@/pages/clients/ClientList';
import { BusinessSettings } from '@/pages/settings/BusinessSettings';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/invoices/create" element={<CreateInvoice />} />
            <Route path="/invoices/:id" element={<InvoiceDetail />} />
            <Route path="/quotes" element={<QuoteList />} />
            <Route path="/clients" element={<ClientList />} />
            <Route path="/settings" element={<BusinessSettings />} />
          </Route>

          {/* Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
