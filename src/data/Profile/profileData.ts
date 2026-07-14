export const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
];

export const DUMMY_CONNECTIONS = [
  { id: "c1", name: "Syifa Adinda", username: "syifaaa._", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", isFollowing: true, isFollower: true },
  { id: "c2", name: "Kevin Sanjaya", username: "kevin.san", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", isFollowing: true, isFollower: true },
  { id: "c3", name: "Hanifah Izzati", username: "hanifah_iz", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", isFollowing: false, isFollower: true },
  { id: "c4", name: "Faiza Luna", username: "faiza_luna", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", isFollowing: true, isFollower: false },
  { id: "c5", name: "Budi Sanjaya", username: "budi_sanjaya", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150", isFollowing: false, isFollower: true },
];

export const DUMMY_SAVED_POSTS = [
  { id: "saved1", imageUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400", caption: "Forest vibes 🌲💚 #nature #peace", likes: ["c1", "c2"], comments: 2, createdAt: Date.now() - 86400000, mediaType: "image" as const, username: "nature_seeker", userId: "nature_seeker" },
  { id: "saved2", imageUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400", caption: "Nature is the art of God. 🍂✨", likes: ["c3"], comments: 1, createdAt: Date.now() - 172800000, mediaType: "image" as const, username: "wanderlust", userId: "wanderlust" },
];

export type TabType = "grid" | "list" | "saved";