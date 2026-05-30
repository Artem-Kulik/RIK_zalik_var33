import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS, SIZES, FONTS } from '../constants/theme';

export default function CategoryPill({ item, selected, onPress }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.pill,
        {
          backgroundColor: selected ? COLORS.primary : colors.surface,
          borderColor: selected ? COLORS.primary : colors.border,
        },
      ]}
    >
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text
        style={[
          styles.label,
          { color: selected ? '#fff' : colors.textSecondary },
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: SIZES.radius.full,
    borderWidth: 1.5,
    marginRight: 8,
    gap: 5,
  },
  emoji: { fontSize: 16 },
  label: {
    ...FONTS.medium,
    fontSize: 13,
  },
});
