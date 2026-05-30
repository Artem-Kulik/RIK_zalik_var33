import React, { useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';

export default function FoodCard({ item, onPress, horizontal = false }) {
  const { colors } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { dispatch } = useCart();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heartAnim = useRef(new Animated.Value(1)).current;

  const handleAddToCart = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.93, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    dispatch({ type: 'ADD_ITEM', item });
  };

  const handleFavorite = () => {
    Animated.sequence([
      Animated.timing(heartAnim, { toValue: 1.4, duration: 120, useNativeDriver: true }),
      Animated.spring(heartAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    toggleFavorite(item);
  };

  const fav = isFavorite(item.id);

  if (horizontal) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={[styles.cardH, { backgroundColor: colors.card }, SHADOWS.md]}
      >
        <View style={styles.emojiContainerH}>
          <Text style={styles.emojiH}>{item.emoji}</Text>
        </View>
        <View style={styles.infoH}>
          {item.badge && (
            <View style={[styles.badge, { backgroundColor: item.badge === 'Новинка' ? COLORS.success : item.badge === 'Веган' ? '#4CAF50' : COLORS.primary }]}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}
          <Text style={[styles.nameH, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.star}>⭐</Text>
            <Text style={[styles.rating, { color: colors.textSecondary }]}>{item.rating}</Text>
            <Text style={[styles.dot, { color: colors.textTertiary }]}> · </Text>
            <Text style={[styles.time, { color: colors.textSecondary }]}>{item.time}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: COLORS.primary }]}>{item.price} грн</Text>
            {item.oldPrice && (
              <Text style={[styles.oldPrice, { color: colors.textTertiary }]}>{item.oldPrice}</Text>
            )}
          </View>
        </View>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity style={styles.addBtnSmall} onPress={handleAddToCart}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[styles.card, { backgroundColor: colors.card }, SHADOWS.md]}
    >
      <View style={[styles.emojiContainer, { backgroundColor: colors.background }]}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <TouchableOpacity style={styles.heartBtn} onPress={handleFavorite}>
          <Animated.Text style={[styles.heart, { transform: [{ scale: heartAnim }] }]}>
            {fav ? '❤️' : '🤍'}
          </Animated.Text>
        </TouchableOpacity>
        {item.badge && (
          <View style={[styles.badgeTop, { backgroundColor: item.badge === 'Новинка' ? COLORS.success : item.badge === 'Веган' ? '#4CAF50' : COLORS.primary }]}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.star}>⭐</Text>
          <Text style={[styles.rating, { color: colors.textSecondary }]}>{item.rating}</Text>
          <Text style={[styles.dot, { color: colors.textTertiary }]}> · </Text>
          <Text style={[styles.time, { color: colors.textSecondary }]}>{item.time}</Text>
          <Text style={[styles.dot, { color: colors.textTertiary }]}> · </Text>
          <Text style={[styles.calories, { color: colors.textSecondary }]}>{item.calories} ккал</Text>
        </View>
        <View style={styles.bottomRow}>
          <View>
            <Text style={[styles.price, { color: COLORS.primary }]}>{item.price} грн</Text>
            {item.oldPrice && (
              <Text style={[styles.oldPrice, { color: colors.textTertiary }]}>{item.oldPrice} грн</Text>
            )}
          </View>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity style={[styles.addBtn, SHADOWS.primary]} onPress={handleAddToCart}>
              <Text style={styles.addBtnText}>+ Додати</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: SIZES.radius.lg,
    marginBottom: 14,
    overflow: 'hidden',
  },
  emojiContainer: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emoji: { fontSize: 64 },
  heartBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  heart: { fontSize: 16 },
  badgeTop: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: SIZES.radius.full,
  },
  info: { padding: 14 },
  name: { ...FONTS.semiBold, fontSize: 15, marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  star: { fontSize: 12 },
  rating: { ...FONTS.medium, fontSize: 12 },
  dot: { fontSize: 12 },
  time: { fontSize: 12 },
  calories: { fontSize: 12 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { ...FONTS.bold, fontSize: 17 },
  oldPrice: { ...FONTS.regular, fontSize: 12, textDecorationLine: 'line-through' },
  addBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: SIZES.radius.full,
  },
  addBtnText: { ...FONTS.semiBold, color: '#fff', fontSize: 13 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: SIZES.radius.full, marginBottom: 4 },
  badgeText: { ...FONTS.medium, color: '#fff', fontSize: 10 },

  // Horizontal card styles
  cardH: {
    flexDirection: 'row',
    borderRadius: SIZES.radius.lg,
    marginBottom: 12,
    overflow: 'hidden',
    alignItems: 'center',
    paddingRight: 14,
  },
  emojiContainerH: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,107,53,0.08)',
    margin: 10,
    borderRadius: SIZES.radius.md,
  },
  emojiH: { fontSize: 44 },
  infoH: { flex: 1, paddingVertical: 12 },
  nameH: { ...FONTS.semiBold, fontSize: 14, marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  addBtnSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
