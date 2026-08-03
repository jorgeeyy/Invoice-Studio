import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchInvoices, fetchInvoiceById, createInvoice, updateInvoice, deleteInvoice } from '@/api/invoices';
import type { CreateInvoiceInput, UpdateInvoiceInput } from '@/types';

export function useInvoices() {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: fetchInvoices,
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ['invoices', id],
    queryFn: () => fetchInvoiceById(id),
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateInvoiceInput) => createInvoice(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateInvoiceInput }) =>
      updateInvoice(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoices', variables.id] });
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}
