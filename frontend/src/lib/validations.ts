import { z } from 'zod';

const currencySchema = z.enum(['USD', 'EUR', 'GBP', 'GHS', 'CAD', 'AUD']);
const paymentTermsSchema = z.enum(['due_on_receipt', 'net_15', 'net_30', 'net_60', 'custom']);
const templateSchema = z.enum(['minimal', 'corporate', 'modern', 'agency', 'elegant']);

export const invoiceItemSchema = z.object({
  productId: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Price must be 0 or greater'),
  discount: z.number().min(0, 'Discount must be 0 or greater').default(0),
  taxRate: z.number().min(0).max(100).default(0),
});

export const createInvoiceSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  currency: currencySchema.default('USD'),
  reference: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  discount: z.number().min(0).default(0),
  discountType: z.enum(['percentage', 'fixed']).default('percentage'),
  taxRate: z.number().min(0).max(100).default(0),
  taxName: z.string().default('Tax'),
  notes: z.string().optional(),
  internalNotes: z.string().optional(),
  paymentTerms: paymentTermsSchema.default('net_30'),
  paymentInstructions: z.string().optional(),
  template: templateSchema.default('minimal'),
});

export const clientSchema = z.object({
  name: z.string().min(1, 'Client name is required'),
  contactPerson: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  company: z.string().optional(),
  address: z.object({
    street: z.string().default(''),
    city: z.string().default(''),
    state: z.string().default(''),
    zipCode: z.string().default(''),
    country: z.string().default(''),
  }).optional(),
  taxId: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['active', 'archived']).default('active'),
});

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  unitPrice: z.number().min(0, 'Price must be 0 or greater'),
  currency: currencySchema.default('USD'),
  taxRate: z.number().min(0).max(100).default(0),
  quantity: z.number().min(1).default(1),
  category: z.string().optional(),
});

export const businessSettingsSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  taxId: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  defaultCurrency: currencySchema.default('USD'),
  defaultTaxRate: z.number().min(0).max(100).default(0),
  defaultTaxName: z.string().default('Tax'),
  invoicePrefix: z.string().min(1).default('INV'),
  defaultPaymentTerms: paymentTermsSchema.default('net_30'),
  bankDetails: z.string().optional(),
  mobileMoneyDetails: z.string().optional(),
  paymentInstructions: z.string().optional(),
});

export type CreateInvoiceFormData = z.infer<typeof createInvoiceSchema>;
export type ClientFormData = z.infer<typeof clientSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type BusinessSettingsFormData = z.infer<typeof businessSettingsSchema>;
