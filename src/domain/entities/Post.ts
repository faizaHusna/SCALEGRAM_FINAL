export interface Post {
  id: string;
  userId: string;
  username: string;
  caption: string;
  imageUrl: string;
  likes: number;
  comments: number;
  createdAt: number;
}