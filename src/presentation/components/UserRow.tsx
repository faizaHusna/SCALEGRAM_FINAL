import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export const UserRow = ({ user, onSend }: { user: any, onSend: () => void }) => (
  <View style={styles.row}>
    <Text style={styles.userName}>{user.name}</Text>
    <Pressable style={styles.sendButton} onPress={onSend}>
      <Text style={styles.sendText}>Kirim</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, alignItems: 'center' },
  userName: { fontSize: 16 },
  sendButton: { backgroundColor: '#4F46E5', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  sendText: { color: 'white', fontWeight: 'bold' }
});