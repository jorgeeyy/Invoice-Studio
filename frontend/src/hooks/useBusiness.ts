import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBusiness, updateBusiness } from '@/api/business';
import type { UpdateBusinessInput } from '@/types';

export function useBusiness() {
  return useQuery({
    queryKey: ['business'],
    queryFn: fetchBusiness,
  });
}

export function useUpdateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateBusinessInput) => updateBusiness(input),
    onSuccess: (data) => {
      queryClient.setQueryData(['business'], data);
    },
  });
}