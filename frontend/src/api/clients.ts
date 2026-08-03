import type { Client, CreateClientInput, UpdateClientInput } from '@/types';
import { mockClients } from './mock-data';

let clients = [...mockClients];

export async function fetchClients(): Promise<Client[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return clients;
}

export async function fetchClientById(id: string): Promise<Client | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return clients.find((client) => client.id === id);
}

export async function createClient(input: CreateClientInput): Promise<Client> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newClient: Client = {
    id: `${clients.length + 1}`,
    ...input,
    status: input.status || 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  clients.push(newClient);
  return newClient;
}

export async function updateClient(id: string, input: UpdateClientInput): Promise<Client> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const index = clients.findIndex((client) => client.id === id);
  if (index === -1) {
    throw new Error('Client not found');
  }

  const updatedClient = {
    ...clients[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };

  clients[index] = updatedClient;
  return updatedClient;
}

export async function deleteClient(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  clients = clients.filter((client) => client.id !== id);
}
