import type { Currency } from './invoice';

export interface Business {
  id: string;
  userId: string;
  name: string;
  logo?: string;
  email: string;
  phone?: string;
  website?: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  taxId?: string;
  defaultCurrency: Currency;
  defaultTaxRate: number;
  defaultTaxName: string;
  invoicePrefix: string;
  defaultPaymentTerms: 'due_on_receipt' | 'net_15' | 'net_30' | 'net_60' | 'custom';
  bankDetails?: string;
  mobileMoneyDetails?: string;
  paymentInstructions?: string;
  signature?: string;
  stamp?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBusinessInput {
  name: string;
  logo?: string;
  email: string;
  phone?: string;
  website?: string;
  address?: Business['address'];
  taxId?: string;
  defaultCurrency?: Currency;
  defaultTaxRate?: number;
  defaultTaxName?: string;
  invoicePrefix?: string;
  defaultPaymentTerms?: Business['defaultPaymentTerms'];
  bankDetails?: string;
  mobileMoneyDetails?: string;
  paymentInstructions?: string;
  signature?: string;
  stamp?: string;
}

export interface UpdateBusinessInput extends Partial<CreateBusinessInput> {}
