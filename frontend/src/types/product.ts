export interface Product {
  id: string;
  name: string;
  description?: string;
  unitPrice: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'GHS' | 'CAD' | 'AUD';
  taxRate: number;
  quantity: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  unitPrice: number;
  currency?: Product['currency'];
  taxRate?: number;
  quantity?: number;
  category?: string;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}
