export interface Post {
  id: string;
  username: string;
  image: string;
  caption: string;
  likes: number;
}

let posts: Post[] = [];

export function getPosts() {
  return posts;
}

export function addPost(post: Post) {
  posts.unshift(post);
}