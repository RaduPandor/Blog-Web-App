export interface Post {
  id: number;
  title: string;
  author: string;
  authorId: string;
  content: string;
  createdDate: string;
  lastModifiedDate: string;
}

export interface PostPreview {
  id: number;
  title: string;
  author: string;
  contentPreview: string;
  createdDate: string;
  lastModifiedDate: string;
}