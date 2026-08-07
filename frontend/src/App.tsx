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
import { ClientList } from '@/pages/clients/ClientList';
import { ProductList } from '@/pages/products/ProductList';
import { BusinessSettings } from '@/pages/settings/BusinessSettings';
import { PrintInvoice } from '@/pages/invoices/PrintInvoice';

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
            <Route path="/clients" element={<ClientList />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/settings" element={<BusinessSettings />} />
          </Route>

          {/* Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />

          {/* Standalone print route (outside AppLayout) */}
          <Route path="/print/:id" element={<PrintInvoice />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
