import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from "../Services/PostService";

export const usePosts = () => {
  const { data: posts, isLoading, isError, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  return {
    posts,
    loading: isLoading,
    error: isError ? (error instanceof Error ? error.message : "An error occurred") : null
  };
};
