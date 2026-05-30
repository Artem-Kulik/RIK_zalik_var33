import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, StatusBar, Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '../constants/menuData';
import EmptyState from '../components/EmptyState';

export default function CartScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const {
    items, subtotal, deliveryFee, discountAmount, total, itemCount,
    promoCode, promoDiscount, dispatch,
  } = useCart();
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = () => {
    dispatch({ type: 'APPLY_PROMO', code: promoInput });
    const found = ['СМАЧНО20', 'ПЕРШИЙ', 'ЛІТО10'].includes(promoInput.toUpperCase());
    setPromoError(found ? '' : 'Невірний промокод');
  };

  const progressToFree = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);
  const remaining = FREE_DELIVERY_THRESHOLD - subtotal;

  if (items.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>Кошик</Text>
        </View>
        <EmptyState
          emoji="🛒"
          title="Кошик порожній"
          subtitle="Додайте страви з меню, щоб зробити замовлення"
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Кошик</Text>
        <Text style={[styles.itemCount, { color: colors.textSecondary }]}>{itemCount} шт.</Text>
        <TouchableOpacity onPress={() => dispatch({ type: 'CLEAR_CART' })}>
          <Text style={[styles.clearAll, { color: COLORS.error }]}>Очистити</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={i => i.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          remaining > 0 ? (
            <View style={[styles.freeDeliveryBanner, { backgroundColor: colors.surface }]}>
              <Text style={[styles.freeDeliveryText, { color: colors.text }]}>
                Ще <Text style={{ color: COLORS.primary, fontWeight: '700' }}>{remaining} грн</Text> до безкоштовної доставки 🚀
              </Text>
              <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                <View style={[styles.progressFill, { width: `${progressToFree}%` }]} />
              </View>
            </View>
          ) : (
            <View style={[styles.freeDeliveryBanner, { backgroundColor: COLORS.success + '18' }]}>
              <Text style={[styles.freeDeliveryText, { color: COLORS.success }]}>🎉 Безкоштовна доставка!</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View style={[styles.cartItem, { backgroundColor: colors.surface }, SHADOWS.sm]}>
            <View style={[styles.emojiBox, { backgroundColor: colors.background }]}>
              <Text style={styles.emoji}>{item.emoji}</Text>
            </View>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
              <Text style={[styles.itemPrice, { color: COLORS.primary }]}>{item.price} грн / шт.</Text>
            </View>
            <View style={styles.qtyControls}>
              <TouchableOpacity
                style={[styles.qtyBtn, { borderColor: colors.border }]}
                onPress={() => dispatch({ type: 'DECREMENT', id: item.id })}
              >
                <Text style={[styles.qtyBtnText, { color: item.quantity === 1 ? COLORS.error : colors.text }]}>
                  {item.quantity === 1 ? '🗑' : '−'}
                </Text>
              </TouchableOpacity>
              <Text style={[styles.qty, { color: colors.text }]}>{item.quantity}</Text>
              <TouchableOpacity
                style={[styles.qtyBtn, { backgroundColor: COLORS.primary }]}
                onPress={() => dispatch({ type: 'INCREMENT', id: item.id })}
              >
                <Text style={[styles.qtyBtnText, { color: '#fff' }]}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.lineTotal, { color: colors.text }]}>
              {item.price * item.quantity} грн
            </Text>
          </View>
        )}
        ListFooterComponent={
          <View>
            {/* PROMO CODE */}
            <View style={[styles.promoSection, { backgroundColor: colors.surface }]}>
              <Text style={[styles.promoLabel, { color: colors.text }]}>Промокод</Text>
              <View style={styles.promoRow}>
                <TextInput
                  value={promoInput}
                  onChangeText={t => { setPromoInput(t); setPromoError(''); }}
                  placeholder="Введіть промокод"
                  placeholderTextColor={colors.textTertiary}
                  autoCapitalize="characters"
                  style={[styles.promoInput, { color: colors.text, borderColor: promoError ? COLORS.error : colors.border, backgroundColor: colors.background }]}
                />
                <TouchableOpacity style={styles.promoBtn} onPress={handleApplyPromo}>
                  <Text style={styles.promoBtnText}>Застосувати</Text>
                </TouchableOpacity>
              </View>
              {promoError ? (
                <Text style={styles.promoError}>{promoError}</Text>
              ) : promoDiscount ? (
                <Text style={styles.promoSuccess}>✓ {promoDiscount.description}</Text>
              ) : null}
            </View>

            {/* ORDER SUMMARY */}
            <View style={[styles.summary, { backgroundColor: colors.surface }]}>
              <Text style={[styles.summaryTitle, { color: colors.text }]}>Ваше замовлення</Text>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Сума</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>{subtotal} грн</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Доставка</Text>
                <Text style={[styles.summaryValue, { color: deliveryFee === 0 ? COLORS.success : colors.text }]}>
                  {deliveryFee === 0 ? 'Безкоштовно' : `${deliveryFee} грн`}
                </Text>
              </View>
              {discountAmount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: COLORS.success }]}>Знижка ({promoCode})</Text>
                  <Text style={[styles.summaryValue, { color: COLORS.success }]}>−{discountAmount} грн</Text>
                </View>
              )}
              <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
              <View style={styles.summaryRow}>
                <Text style={[styles.totalLabel, { color: colors.text }]}>Разом</Text>
                <Text style={[styles.totalValue, { color: COLORS.primary }]}>{total} грн</Text>
              </View>
            </View>

            {/* CHECKOUT BUTTON */}
            <TouchableOpacity
              style={[styles.checkoutBtn, SHADOWS.primary]}
              onPress={() => navigation.navigate('Checkout')}
            >
              <Text style={styles.checkoutBtnText}>Оформити замовлення 🛵</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 8,
  },
  title: { ...FONTS.bold, fontSize: 26, flex: 1 },
  itemCount: { ...FONTS.regular, fontSize: 14 },
  clearAll: { ...FONTS.medium, fontSize: 13 },
  list: { padding: 20, gap: 0 },

  freeDeliveryBanner: { borderRadius: SIZES.radius.md, padding: 14, marginBottom: 16 },
  freeDeliveryText: { ...FONTS.medium, fontSize: 13, marginBottom: 8 },
  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },

  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SIZES.radius.md,
    padding: 12,
    marginBottom: 10,
    gap: 10,
  },
  emojiBox: { width: 52, height: 52, borderRadius: SIZES.radius.sm, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 28 },
  itemInfo: { flex: 1 },
  itemName: { ...FONTS.semiBold, fontSize: 13, marginBottom: 2 },
  itemPrice: { ...FONTS.regular, fontSize: 12 },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  qtyBtnText: { ...FONTS.bold, fontSize: 14 },
  qty: { ...FONTS.bold, fontSize: 15, minWidth: 20, textAlign: 'center' },
  lineTotal: { ...FONTS.bold, fontSize: 14, minWidth: 64, textAlign: 'right' },

  promoSection: { borderRadius: SIZES.radius.md, padding: 16, marginTop: 4, marginBottom: 12 },
  promoLabel: { ...FONTS.semiBold, fontSize: 14, marginBottom: 10 },
  promoRow: { flexDirection: 'row', gap: 8 },
  promoInput: { flex: 1, borderWidth: 1.5, borderRadius: SIZES.radius.md, paddingHorizontal: 12, paddingVertical: 10, ...FONTS.medium, fontSize: 13 },
  promoBtn: { backgroundColor: COLORS.secondary, paddingHorizontal: 14, borderRadius: SIZES.radius.md, justifyContent: 'center' },
  promoBtnText: { ...FONTS.semiBold, color: '#fff', fontSize: 13 },
  promoError: { ...FONTS.regular, color: COLORS.error, fontSize: 12, marginTop: 6 },
  promoSuccess: { ...FONTS.medium, color: COLORS.success, fontSize: 12, marginTop: 6 },

  summary: { borderRadius: SIZES.radius.md, padding: 16, marginBottom: 16 },
  summaryTitle: { ...FONTS.bold, fontSize: 16, marginBottom: 14 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { ...FONTS.regular, fontSize: 14 },
  summaryValue: { ...FONTS.medium, fontSize: 14 },
  summaryDivider: { height: 1, marginVertical: 10 },
  totalLabel: { ...FONTS.bold, fontSize: 16 },
  totalValue: { ...FONTS.extraBold, fontSize: 20 },

  checkoutBtn: { backgroundColor: COLORS.primary, borderRadius: SIZES.radius.full, paddingVertical: 16, alignItems: 'center', marginBottom: 30 },
  checkoutBtnText: { ...FONTS.bold, color: '#fff', fontSize: 17 },
});
