import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

// 💡 Tambahkan value dan onChangeText ke dalam tipe data properti (props)
interface SearchBarProps {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export const SearchBar = ({ placeholder, value, onChangeText }: SearchBarProps) => (
  <TextInput 
    style={styles.input} 
    placeholder={placeholder} 
    value={value}                      // 💡 Ikat dengan state eksternal
    onChangeText={onChangeText}        // 💡 Kirim balik perubahan teks ke induk
    placeholderTextColor="#8A8A8A"     
  />
);

const styles = StyleSheet.create({
  input: { backgroundColor: '#F3F4F6', padding: 12, borderRadius: 10, marginBottom: 15 }
});