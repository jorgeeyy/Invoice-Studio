import type { Invoice, InvoiceItem, CreateInvoiceInput, UpdateInvoiceInput } from '@/types';
import { mockInvoices } from './mock-data';

let invoices = [...mockInvoices];

export async function fetchInvoices(): Promise<Invoice[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return invoices;
}

export async function fetchInvoiceById(id: string): Promise<Invoice | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return invoices.find((inv) => inv.id === id);
}

export async function createInvoice(input: CreateInvoiceInput): Promise<Invoice> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const items: InvoiceItem[] = input.items.map((item, index) => ({
    id: `${index + 1}`,
    productId: item.productId,
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    discount: item.discount || 0,
    taxRate: item.taxRate || 0,
    amount: item.quantity * item.unitPrice - (item.discount || 0),
  }));

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const discount = input.discount || 0;
  const taxRate = input.taxRate || 0;
  const taxName = input.taxName || 'Tax';
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * (taxRate / 100);

  const newInvoice: Invoice = {
    id: `${invoices.length + 1}`,
    invoiceNumber: `INV-${String(invoices.length + 1).padStart(4, '0')}`,
    businessId: '1',
    clientId: input.clientId,
    clientName: 'Client Name',
    clientEmail: 'client@email.com',
    status: 'draft',
    issueDate: input.issueDate,
    currency: input.currency || 'USD',
    reference: input.reference,
    items,
    subtotal,
    discount,
    discountType: input.discountType || 'percentage',
    taxRate,
    taxName,
    tax,
    total: taxableAmount + tax,
    notes: input.notes,
    internalNotes: input.internalNotes,
    paymentTerms: input.paymentTerms || 'net_30',
    paymentInstructions: input.paymentInstructions,
    template: input.template || 'minimal',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  invoices.push(newInvoice);
  return newInvoice;
}

export async function updateInvoice(id: string, input: UpdateInvoiceInput): Promise<Invoice> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const index = invoices.findIndex((inv) => inv.id === id);
  if (index === -1) {
    throw new Error('Invoice not found');
  }

  const existingInvoice = invoices[index];
  let items = existingInvoice.items;

  if (input.items) {
    items = input.items.map((item, idx) => ({
      id: `${idx + 1}`,
      productId: item.productId,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount || 0,
      taxRate: item.taxRate || 0,
      amount: item.quantity * item.unitPrice - (item.discount || 0),
    }));
  }

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const discount = input.discount ?? existingInvoice.discount;
  const taxRate = input.taxRate ?? existingInvoice.taxRate;
  const taxName = input.taxName ?? existingInvoice.taxName;
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * (taxRate / 100);

  const updatedInvoice: Invoice = {
    ...existingInvoice,
    ...input,
    items,
    subtotal,
    discount,
    taxRate,
    taxName,
    tax,
    total: taxableAmount + tax,
    updatedAt: new Date().toISOString(),
  };

  invoices[index] = updatedInvoice;
  return updatedInvoice;
}

export async function deleteInvoice(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  invoices = invoices.filter((inv) => inv.id !== id);
}
