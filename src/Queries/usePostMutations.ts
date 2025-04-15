import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Post } from '../Models/Post';
import { addPost, updatePost, deletePost } from '../Services/PostService';

export const usePostMutations = (onDone?: () => void) => {
  const queryClient = useQueryClient();

  const addPostMutation = useMutation({
    mutationFn: (newPost: Omit<Post, "id" | "createdDate" | "lastModifiedDate">) => addPost(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      onDone?.();
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: (updatedPost: Post) => updatePost(updatedPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      onDone?.();
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  return { addPostMutation, updatePostMutation, deletePostMutation };
};
