import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetFlatList,
    BottomSheetView
} from '@gorhom/bottom-sheet';
import React, { forwardRef, useMemo } from 'react'; // <--- Perbaikan 'forwardRef'
import { StyleSheet, Text } from 'react-native';

// --- Impor Komponen yang belum ada (Sesuaikan Path-nya) ---
import { SearchBar } from '../components/SearchBar';
import { UserRow } from '../components/UserRow';

interface ShareProps {
    postId: string | null;
}

// Simulasi data (Ganti dengan data dari Store/API Anda)
const friendsList = [{ id: '1', name: 'User 1' }];

export const ShareToDMBottomSheet = forwardRef<BottomSheet, ShareProps>(
    ({ postId }, ref) => {

        const handleSendPost = (pId: string | null, uId: string) => {
            console.log(`Mengirim post ${pId} ke user ${uId}`);
        };

        const snapPoints = useMemo(() => ['60%', '90%'], []);

        return (
            <BottomSheet
                ref={ref}
                index={-1}
                snapPoints={snapPoints}
                enableDynamicSizing={false}
                animateOnMount={true}
                enablePanDownToClose={true}
                backdropComponent={(props) => (
                    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
                )}
            >
                <BottomSheetView style={styles.contentContainer}>
                    <Text style={styles.title}>Kirim ke...</Text>
                    <SearchBar placeholder="Cari teman..." />

                    <BottomSheetFlatList
                        data={friendsList}
                        renderItem={({ item }: { item: any }) => ( // <--- Perbaikan tipe 'item'
                            <UserRow
                                user={item}
                                onSend={() => handleSendPost(postId, item.id)}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                    />
                </BottomSheetView>
            </BottomSheet>
        );
    }
);

// --- Perbaikan: Mendefinisikan 'styles' yang hilang ---
const styles = StyleSheet.create({
    contentContainer: { flex: 1, padding: 20 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
});