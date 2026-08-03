export interface Client {
  id: string;
  name: string;
  contactPerson?: string;
  email: string;
  phone?: string;
  website?: string;
  company?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  taxId?: string;
  notes?: string;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientInput {
  name: string;
  contactPerson?: string;
  email: string;
  phone?: string;
  website?: string;
  company?: string;
  address?: Client['address'];
  taxId?: string;
  notes?: string;
  status?: Client['status'];
}

export interface UpdateClientInput extends Partial<CreateClientInput> {}
