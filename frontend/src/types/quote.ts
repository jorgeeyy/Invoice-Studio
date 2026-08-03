export interface Quote {
  id: string;
  quoteNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  issueDate: string;
  validUntil: string;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface CreateQuoteInput {
  clientId: string;
  issueDate: string;
  validUntil: string;
  items: Omit<QuoteItem, 'id' | 'amount'>[];
  notes?: string;
}

export interface UpdateQuoteInput extends Partial<CreateQuoteInput> {
  status?: Quote['status'];
}
