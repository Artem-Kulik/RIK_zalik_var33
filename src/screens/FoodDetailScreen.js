import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, StatusBar, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { MENU_ITEMS } from '../constants/menuData';
import FoodCard from '../components/FoodCard';

const { width } = Dimensions.get('window');

export default function FoodDetailScreen({ route, navigation }) {
  const { item } = route.params;
  const { colors, isDark } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { dispatch, items: cartItems } = useCart();

  const [quantity, setQuantity] = useState(1);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heartAnim = useRef(new Animated.Value(1)).current;

  const cartQty = cartItems.find(i => i.id === item.id)?.quantity || 0;
  const related = MENU_ITEMS.filter(i => i.category === item.category && i.id !== item.id).slice(0, 3);

  const handleAddToCart = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.92, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
    dispatch({ type: 'ADD_ITEM', item: { ...item, quantity } });
    if (quantity > 1) {
      for (let i = 1; i < quantity; i++) dispatch({ type: 'INCREMENT', id: item.id });
    }
  };

  const handleFavorite = () => {
    Animated.sequence([
      Animated.timing(heartAnim, { toValue: 1.5, duration: 120, useNativeDriver: true }),
      Animated.spring(heartAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    toggleFavorite(item);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HERO */}
        <LinearGradient
          colors={isDark ? ['#252540', '#1A1A2E'] : ['#FF8C5A', '#FF6B35']}
          style={styles.hero}
        >
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.heartBtnHero} onPress={handleFavorite}>
            <Animated.Text style={[styles.heartText, { transform: [{ scale: heartAnim }] }]}>
              {isFavorite(item.id) ? '❤️' : '🤍'}
            </Animated.Text>
          </TouchableOpacity>

          <Text style={styles.heroEmoji}>{item.emoji}</Text>

          {item.badge && (
            <View style={[styles.badge, { backgroundColor: item.badge === 'Новинка' ? COLORS.success : COLORS.primaryDark }]}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}
        </LinearGradient>

        {/* CONTENT */}
        <View style={[styles.content, { backgroundColor: colors.surface }]}>
          {/* TITLE ROW */}
          <View style={styles.titleRow}>
            <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
            <View>
              <Text style={[styles.price, { color: COLORS.primary }]}>{item.price} грн</Text>
              {item.oldPrice && (
                <Text style={[styles.oldPrice, { color: colors.textTertiary }]}>{item.oldPrice} грн</Text>
              )}
            </View>
          </View>

          {/* STATS */}
          <View style={[styles.statsRow, { backgroundColor: colors.background }]}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{item.rating}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{item.reviews} відг.</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>⏱️</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{item.time}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>доставка</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>🔥</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{item.calories}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>ккал</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>⚖️</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{item.weight}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>вага</Text>
            </View>
          </View>

          {/* DESCRIPTION */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Опис</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>{item.description}</Text>

          {/* INGREDIENTS */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Інгредієнти</Text>
          <View style={styles.ingredientsRow}>
            {item.ingredients.map((ing, idx) => (
              <View key={idx} style={[styles.ingredientChip, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Text style={[styles.ingredientText, { color: colors.textSecondary }]}>{ing}</Text>
              </View>
            ))}
          </View>

          {/* QUANTITY + ADD */}
          {cartQty > 0 && (
            <View style={[styles.inCartBadge, { backgroundColor: COLORS.success + '20' }]}>
              <Text style={[styles.inCartText, { color: COLORS.success }]}>✓ У кошику: {cartQty} шт.</Text>
            </View>
          )}

          <View style={styles.addRow}>
            <View style={[styles.qtySelector, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <TouchableOpacity
                onPress={() => setQuantity(q => Math.max(1, q - 1))}
                style={styles.qtyBtn}
              >
                <Text style={[styles.qtyBtnText, { color: colors.text }]}>−</Text>
              </TouchableOpacity>
              <Text style={[styles.qtyValue, { color: colors.text }]}>{quantity}</Text>
              <TouchableOpacity
                onPress={() => setQuantity(q => q + 1)}
                style={styles.qtyBtn}
              >
                <Text style={[styles.qtyBtnText, { color: COLORS.primary }]}>+</Text>
              </TouchableOpacity>
            </View>

            <Animated.View style={[{ flex: 1 }, { transform: [{ scale: scaleAnim }] }]}>
              <TouchableOpacity
                style={[styles.addBtn, SHADOWS.primary]}
                onPress={handleAddToCart}
              >
                <Text style={styles.addBtnText}>До кошика — {item.price * quantity} грн</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* RELATED */}
          {related.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Схожі страви</Text>
              {related.map(relItem => (
                <FoodCard
                  key={relItem.id}
                  item={relItem}
                  horizontal
                  onPress={() => navigation.replace('FoodDetail', { item: relItem })}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { color: '#fff', fontSize: 20, lineHeight: 22 },
  heartBtnHero: {
    position: 'absolute',
    top: 52,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartText: { fontSize: 18 },
  heroEmoji: { fontSize: 90 },
  badge: { position: 'absolute', bottom: 20, right: 20, paddingHorizontal: 12, paddingVertical: 4, borderRadius: SIZES.radius.full },
  badgeText: { ...FONTS.semiBold, color: '#fff', fontSize: 12 },

  content: { borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -24, padding: 24, paddingBottom: 40 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  name: { ...FONTS.extraBold, fontSize: 22, flex: 1, marginRight: 12 },
  price: { ...FONTS.bold, fontSize: 22, textAlign: 'right' },
  oldPrice: { ...FONTS.regular, fontSize: 14, textDecorationLine: 'line-through', textAlign: 'right' },

  statsRow: { flexDirection: 'row', borderRadius: SIZES.radius.md, padding: 16, marginBottom: 20, justifyContent: 'space-around' },
  statItem: { alignItems: 'center', gap: 2 },
  statIcon: { fontSize: 18, marginBottom: 4 },
  statValue: { ...FONTS.bold, fontSize: 14 },
  statLabel: { fontSize: 11 },
  statDivider: { width: 1, height: '80%', alignSelf: 'center' },

  sectionTitle: { ...FONTS.bold, fontSize: 16, marginBottom: 10, marginTop: 4 },
  description: { ...FONTS.regular, fontSize: 14, lineHeight: 22, marginBottom: 20 },

  ingredientsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  ingredientChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: SIZES.radius.full, borderWidth: 1 },
  ingredientText: { ...FONTS.regular, fontSize: 12 },

  inCartBadge: { padding: 12, borderRadius: SIZES.radius.md, marginBottom: 12 },
  inCartText: { ...FONTS.medium, fontSize: 14, textAlign: 'center' },

  addRow: { flexDirection: 'row', gap: 12, alignItems: 'center', marginTop: 8 },
  qtySelector: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: SIZES.radius.full, overflow: 'hidden' },
  qtyBtn: { width: 42, height: 48, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { ...FONTS.bold, fontSize: 20 },
  qtyValue: { ...FONTS.bold, fontSize: 17, paddingHorizontal: 4, minWidth: 28, textAlign: 'center' },
  addBtn: { backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: SIZES.radius.full, alignItems: 'center' },
  addBtnText: { ...FONTS.bold, color: '#fff', fontSize: 16 },

  relatedSection: { marginTop: 24 },
});
