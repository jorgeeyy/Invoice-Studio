import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCurrentUser, logout as logoutApi } from '@/api/auth';

export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: fetchCurrentUser,
    retry: false,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return async () => {
    try {
      await logoutApi();
    } catch {
      /* session may already be gone */
    }
    queryClient.setQueryData(['session'], null);
  };
}