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

export interface ClientAddressInput {
  street: string;
}

export interface CreateClientInput {
  name: string;
  email: string;
  phone?: string;
  website?: string;
  address?: ClientAddressInput;
  notes?: string;
  status?: Client['status'];
}

export interface UpdateClientInput extends Partial<CreateClientInput> {}
