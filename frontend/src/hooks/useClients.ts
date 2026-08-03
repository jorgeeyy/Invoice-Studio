import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchClients, fetchClientById, createClient, updateClient, deleteClient } from '@/api/clients';
import type { CreateClientInput, UpdateClientInput } from '@/types';

export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => fetchClientById(id),
    enabled: !!id,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateClientInput) => createClient(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateClientInput }) =>
      updateClient(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients', variables.id] });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}
