import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchQuotes, fetchQuoteById, createQuote, updateQuote, deleteQuote } from '@/api/quotes';
import type { CreateQuoteInput, UpdateQuoteInput } from '@/types';

export function useQuotes() {
  return useQuery({
    queryKey: ['quotes'],
    queryFn: fetchQuotes,
  });
}

export function useQuote(id: string) {
  return useQuery({
    queryKey: ['quotes', id],
    queryFn: () => fetchQuoteById(id),
    enabled: !!id,
  });
}

export function useCreateQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateQuoteInput) => createQuote(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
  });
}

export function useUpdateQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateQuoteInput }) =>
      updateQuote(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['quotes', variables.id] });
    },
  });
}

export function useDeleteQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteQuote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
  });
}
