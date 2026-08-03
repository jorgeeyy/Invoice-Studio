import type { Quote, CreateQuoteInput, UpdateQuoteInput } from '@/types';
import { mockQuotes } from './mock-data';

let quotes = [...mockQuotes];

export async function fetchQuotes(): Promise<Quote[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return quotes;
}

export async function fetchQuoteById(id: string): Promise<Quote | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return quotes.find((quote) => quote.id === id);
}

export async function createQuote(input: CreateQuoteInput): Promise<Quote> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const items = input.items.map((item, index) => ({
    id: `${index + 1}`,
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    amount: item.quantity * item.unitPrice,
  }));

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * 0.1;

  const newQuote: Quote = {
    id: `${quotes.length + 1}`,
    quoteNumber: `QUO-${String(quotes.length + 1).padStart(4, '0')}`,
    clientId: input.clientId,
    clientName: 'Client Name',
    clientEmail: 'client@email.com',
    status: 'draft',
    issueDate: input.issueDate,
    validUntil: input.validUntil,
    items,
    subtotal,
    tax,
    total: subtotal + tax,
    notes: input.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  quotes.push(newQuote);
  return newQuote;
}

export async function updateQuote(id: string, input: UpdateQuoteInput): Promise<Quote> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const index = quotes.findIndex((quote) => quote.id === id);
  if (index === -1) {
    throw new Error('Quote not found');
  }

  const existingQuote = quotes[index];
  let items = existingQuote.items;

  if (input.items) {
    items = input.items.map((item, idx) => ({
      id: `${idx + 1}`,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      amount: item.quantity * item.unitPrice,
    }));
  }

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * 0.1;

  const updatedQuote: Quote = {
    ...existingQuote,
    ...input,
    items,
    subtotal,
    tax,
    total: subtotal + tax,
    updatedAt: new Date().toISOString(),
  };

  quotes[index] = updatedQuote;
  return updatedQuote;
}

export async function deleteQuote(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  quotes = quotes.filter((quote) => quote.id !== id);
}
