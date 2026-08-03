export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: Client['address'];
}

export interface UpdateClientInput extends Partial<CreateClientInput> {}
