import type { Client, CreateClientInput, UpdateClientInput } from '@/types';
import { apiClient } from './client';

export async function fetchClients(): Promise<Client[]> {
  return apiClient.get<Client[]>('/clients');
}

export async function fetchClientById(id: string): Promise<Client> {
  return apiClient.get<Client>(`/clients/${id}`);
}

export async function createClient(input: CreateClientInput): Promise<Client> {
  return apiClient.post<Client>('/clients', input);
}

export async function updateClient(id: string, input: UpdateClientInput): Promise<Client> {
  return apiClient.put<Client>(`/clients/${id}`, input);
}

export async function deleteClient(id: string): Promise<void> {
  return apiClient.delete(`/clients/${id}`);
}