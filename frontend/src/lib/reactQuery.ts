import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't reload on tab toggle for luxury smoothness
      retry: 1, // Retry failed requests once before error boundary
      staleTime: 5 * 60 * 1000, // Content is fresh for 5 mins
      gcTime: 10 * 60 * 1000 // Cache is kept in memory for 10 mins
    }
  }
});
