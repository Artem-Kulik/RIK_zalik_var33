import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { FONTS } from '../constants/theme';

export default function EmptyState({ emoji = '🍽️', title, subtitle }) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingVertical: 60 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { ...FONTS.semiBold, fontSize: 18, textAlign: 'center', marginBottom: 8 },
  subtitle: { ...FONTS.regular, fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
