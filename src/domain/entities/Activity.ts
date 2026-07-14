export interface ActivityItem {
  id: string;
  type: "like" | "comment" | "mention" | "follow";
  username: string;
  userAvatar: string;
  time: string;
  postImage?: string;
  commentText?: string;
  isUnread: boolean;
  postCaption?: string;
  likesCount?: number;
  commentsCount?: number;
  postId?: string;
}

export type ActivityTab = "semua" | "suka" | "komentar" | "mengikuti";