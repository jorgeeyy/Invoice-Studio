import type { Invoice, CreateInvoiceInput, UpdateInvoiceInput } from '@/types';
import { apiClient, type QueryParams } from './client';

export interface InvoiceQuery {
  search?: string;
  status?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export async function fetchInvoices(query: InvoiceQuery = {}): Promise<Invoice[]> {
  const params: QueryParams = { ...(query as QueryParams) };
  return apiClient.get<Invoice[]>('/invoices', params);
}

export async function fetchInvoiceById(id: string): Promise<Invoice> {
  return apiClient.get<Invoice>(`/invoices/${id}`);
}

export async function createInvoice(input: CreateInvoiceInput): Promise<Invoice> {
  return apiClient.post<Invoice>('/invoices', input);
}

export async function updateInvoice(id: string, input: UpdateInvoiceInput): Promise<Invoice> {
  return apiClient.put<Invoice>(`/invoices/${id}`, input);
}

export async function deleteInvoice(id: string): Promise<void> {
  return apiClient.delete(`/invoices/${id}`);
}

export async function duplicateInvoice(id: string): Promise<Invoice> {
  return apiClient.post<Invoice>(`/invoices/${id}/duplicate`, {});
}

export async function downloadInvoicePdf(id: string): Promise<Blob> {
  return apiClient.getBlob(`/invoices/${id}/pdf`);
}