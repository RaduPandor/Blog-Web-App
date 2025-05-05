import { useQuery } from '@tanstack/react-query';
import { fetchPostById } from "../Services/PostService";

export const usePost = (id: number | null) => {
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['post', id],
    queryFn: () => id ? fetchPostById(id) : Promise.reject('No ID provided'),
    enabled: !!id,
  });
  
  return { post, loading: isLoading, error: isError };
};