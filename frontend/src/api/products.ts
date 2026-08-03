import type { Product, CreateProductInput, UpdateProductInput } from '@/types';
import { mockProducts } from './mock-data';

let products: Product[] = [...mockProducts];

export async function fetchProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return products;
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return products.find((product) => product.id === id);
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newProduct: Product = {
    id: `${products.length + 1}`,
    name: input.name,
    description: input.description,
    unitPrice: input.unitPrice,
    currency: input.currency || 'USD',
    taxRate: input.taxRate || 0,
    quantity: input.quantity || 1,
    category: input.category,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  products.push(newProduct);
  return newProduct;
}

export async function updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const index = products.findIndex((product) => product.id === id);
  if (index === -1) {
    throw new Error('Product not found');
  }

  const updatedProduct: Product = {
    ...products[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };

  products[index] = updatedProduct;
  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  products = products.filter((product) => product.id !== id);
}
