import type { Business, UpdateBusinessInput } from '@/types';
import { apiClient } from './client';

export async function fetchBusiness(): Promise<Business> {
  return apiClient.get<Business>('/businesses/me');
}

export async function updateBusiness(input: UpdateBusinessInput): Promise<Business> {
  return apiClient.put<Business>('/businesses/me', input);
}