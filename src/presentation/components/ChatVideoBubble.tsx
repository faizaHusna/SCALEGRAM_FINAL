import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
// Import useVideoPlayer dan VideoView dari expo-video
import { useVideoPlayer, VideoView } from "expo-video";

interface ChatVideoBubbleProps {
  videoUri: string;
}

export default function ChatVideoBubble({ videoUri }: ChatVideoBubbleProps) {
  // State untuk mendeteksi apakah video masih dalam proses loading/penempelan
  const [isLoading, setIsLoading] = useState(true);
  
  // Memasukkan videoUri ke useVideoPlayer
  const player = useVideoPlayer(videoUri, (playerInstance) => {
    playerInstance.loop = false; // 💡 PERBAIKAN: Diubah menjadi false agar video TIDAK otomatis looping terus-menerus
    playerInstance.muted = false;         
  });

  // Listener untuk memantau perubahan status loading video
  useEffect(() => {
    if (!player) return;

    if (player.status === "readyToPlay") {
      setIsLoading(false);
    }

    const subscription = player.addListener("statusChange", (event) => {
      if (event.status === "readyToPlay") {
        setIsLoading(false); 
      } else if (event.status === "loading" || event.status === "idle") {
        setIsLoading(true);  
      }
    });

    return () => {
      subscription.remove(); 
    };
  }, [player]);

  return (
    // 💡 PERBAIKAN: pointerEvents="none" DIHAPUS agar sistem mendeteksi sentuhan pada tombol Play/Pause/Fullscreen native
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen                 
        allowsPictureInPicture           
        nativeControls={true} // Memastikan kontrol bar bawaan OS aktif sempurna
      />

      {/* LOAD PROGRESS OVERLAY SHADOW PUTIH */}
      {isLoading && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          {/* pointerEvents="none" di sini memastikan roda loading tidak menghalangi video di bawahnya */}
          <ActivityIndicator size="small" color="#5C5CFF" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    overflow: "hidden", 
    width: 220,
    height: 160,
    backgroundColor: "#F2F2F7", 
    position: "relative",
  },
  video: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000", 
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.65)", 
    justifyContent: "center",
    alignItems: "center",
  },
});