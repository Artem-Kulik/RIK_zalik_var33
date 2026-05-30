import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';

export default function SearchBar({ value, onChangeText, placeholder = 'Пошук страв...', onFocus, editable = true }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.wrapper, { backgroundColor: colors.surface }, SHADOWS.sm]}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        style={[styles.input, { color: colors.text }]}
        onFocus={onFocus}
        editable={editable}
      />
      {value ? (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Text style={[styles.clear, { color: colors.textSecondary }]}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SIZES.radius.full,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  icon: { fontSize: 16 },
  input: { flex: 1, ...FONTS.regular, fontSize: 15 },
  clear: { fontSize: 14, paddingHorizontal: 4 },
});
