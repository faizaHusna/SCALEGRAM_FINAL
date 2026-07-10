import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';

// 1. Definisikan interface props secara eksplisit
interface CommentBottomSheetProps {
  postId: string | null;
}

// 2. Gunakan forwardRef dengan generic type <RefType, PropsType>
export const CommentBottomSheet = forwardRef<BottomSheet, CommentBottomSheetProps>(
  ({ postId }, ref) => {
    const snapPoints = useMemo(() => ['50%', '90%'], []);

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableDynamicSizing={false}
        animateOnMount={true}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
          {...props} 
          appearsOnIndex={0} 
            disappearsOnIndex={-1} 
            />
        )}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text style={styles.title}>Komentar</Text>
          <Text style={styles.info}>Post ID: {postId}</Text>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  contentContainer: { flex: 1, padding: 20, backgroundColor: 'white', },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  info: { color: '#888', marginBottom: 20 }
});