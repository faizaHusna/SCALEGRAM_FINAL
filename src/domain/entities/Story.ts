// domain/entities/Story.ts
export interface Story {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  mediaUrl: string;
  createdAt: Date;
}