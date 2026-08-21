import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true, // Auto-refetch when switching tabs so admin changes reflect instantly
      refetchOnMount: true,
      retry: 1,
      staleTime: 0 // Always fetch fresh database content
    }
  }
});
