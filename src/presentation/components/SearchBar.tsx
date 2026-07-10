import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

export const SearchBar = ({ placeholder }: { placeholder: string }) => (
  <TextInput style={styles.input} placeholder={placeholder} />
);

const styles = StyleSheet.create({
  input: { backgroundColor: '#F3F4F6', padding: 12, borderRadius: 10, marginBottom: 15 }
});