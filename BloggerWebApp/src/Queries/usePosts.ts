import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from "../Services/PostService";

export const usePosts = () => {
  const { data: posts, isLoading, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });
  
  return { posts, loading: isLoading, error: isError };
};
