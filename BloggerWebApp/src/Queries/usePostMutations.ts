import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Post } from '../Models/Post';
import { addPost, updatePost, deletePost } from '../Services/PostService';
import { useState } from 'react';

export const usePostMutations = (onDone?: () => void) => {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const addPostMutation = useMutation({
    mutationFn: (newPost: Omit<Post, "id" | "createdDate" | "lastModifiedDate">) => addPost(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      onDone?.();
      setErrorMessage(null);
    },
    onError: (error: unknown) => {
      console.error('Error adding post:', error);
      setErrorMessage('Failed to add post.');
    }
  });

  const updatePostMutation = useMutation({
    mutationFn: (updatedPost: Post) => updatePost(updatedPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      onDone?.();
      setErrorMessage(null);
    },
    onError: (error: unknown) => {
      console.error('Error updating post:', error);
      setErrorMessage('Failed to update post.');
    }
  });

  const deletePostMutation = useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setErrorMessage(null);
    },
    onError: (error: unknown) => {
      console.error('Error deleting post:', error);
      setErrorMessage('Failed to delete post.');
    }
  });

  return { addPostMutation, updatePostMutation, deletePostMutation, errorMessage };
};
