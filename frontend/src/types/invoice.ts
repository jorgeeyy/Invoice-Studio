export type Currency = 'USD' | 'EUR' | 'GBP' | 'GHS' | 'CAD' | 'AUD';
export type DiscountType = 'percentage' | 'fixed';
export type PaymentTerms = 'due_on_receipt' | 'net_15' | 'net_30' | 'net_60' | 'custom';
export type InvoiceTemplate = 'minimal' | 'corporate' | 'modern' | 'agency' | 'elegant';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  businessId: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  status: 'draft' | 'final' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  currency: Currency;
  reference?: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  discountType: DiscountType;
  taxRate: number;
  taxName: string;
  tax: number;
  total: number;
  notes?: string;
  internalNotes?: string;
  paymentTerms: PaymentTerms;
  paymentInstructions?: string;
  template: 'minimal' | 'corporate' | 'modern' | 'agency' | 'elegant';
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  amount: number;
}

export interface CreateInvoiceInput {
  clientId: string;
  issueDate: string;
  currency: Currency;
  reference?: string;
  items: Omit<InvoiceItem, 'id' | 'amount'>[];
  discount?: number;
  discountType?: DiscountType;
  taxRate?: number;
  taxName?: string;
  notes?: string;
  internalNotes?: string;
  paymentTerms?: PaymentTerms;
  paymentInstructions?: string;
  template?: Invoice['template'];
}

export interface UpdateInvoiceInput extends Partial<CreateInvoiceInput> {
  status?: Invoice['status'];
}
