import { useQuery } from '@tanstack/react-query';
import { fetchPostById } from "../Services/PostService";

export const usePost = (id: number | null) => {
  const { data: post, isLoading, isError, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => {
      if (!id) {
        return Promise.reject(new Error('No ID provided'));
      }
      return fetchPostById(id);
    },
    enabled: !!id,
  });

  return { 
    post, 
    loading: isLoading, 
    error: isError ? (error instanceof Error ? error.message : "An error occurred") : null 
  };
};
