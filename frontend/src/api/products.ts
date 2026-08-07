import type { Product, CreateProductInput, UpdateProductInput } from '@/types';
import { apiClient } from './client';

export async function fetchProducts(): Promise<Product[]> {
  return apiClient.get<Product[]>('/products');
}

export async function fetchProductById(id: string): Promise<Product> {
  return apiClient.get<Product>(`/products/${id}`);
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  return apiClient.post<Product>('/products', input);
}

export async function updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
  return apiClient.put<Product>(`/products/${id}`, input);
}

export async function deleteProduct(id: string): Promise<void> {
  return apiClient.delete(`/products/${id}`);
}