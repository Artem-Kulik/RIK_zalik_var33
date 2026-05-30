import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';

const PAYMENT_METHODS = [
  { id: 'cash', label: 'Готівка', emoji: '💵' },
  { id: 'card', label: 'Картка', emoji: '💳' },
  { id: 'apple', label: 'Apple Pay', emoji: '🍎' },
  { id: 'google', label: 'Google Pay', emoji: '🔵' },
];

export default function CheckoutScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const { total, deliveryFee, dispatch } = useCart();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    street: '',
    apartment: '',
    comment: '',
  });
  const [payment, setPayment] = useState('card');
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Введіть ваше ім'я";
    if (!form.phone.match(/^[0-9+\- ]{10,15}$/)) e.phone = 'Невірний номер телефону';
    if (!form.street.trim()) e.street = 'Введіть вулицю та будинок';
    return e;
  };

  const handleOrder = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    const orderNum = `SM-${Math.floor(10000 + Math.random() * 90000)}`;
    const estimatedTime = `${15 + Math.floor(Math.random() * 20)}-${25 + Math.floor(Math.random() * 20)} хв`;
    dispatch({ type: 'CLEAR_CART' });
    navigation.replace('OrderConfirm', { orderNum, estimatedTime, total });
  };

  const InputField = ({ label, field, placeholder, keyboardType = 'default', multiline = false }) => (
    <View style={styles.fieldWrapper}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <TextInput
        value={form[field]}
        onChangeText={v => update(field, v)}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.background,
            borderColor: errors[field] ? COLORS.error : colors.border,
            height: multiline ? 80 : 48,
            textAlignVertical: multiline ? 'top' : 'center',
          },
        ]}
      />
      {errors[field] ? <Text style={styles.errorText}>{errors[field]}</Text> : null}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={[styles.backText, { color: colors.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Оформлення</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

          {/* DELIVERY INFO */}
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>🏠 Адреса доставки</Text>
            <InputField label="Ваше ім'я" field="name" placeholder="Іван Іванов" />
            <InputField label="Телефон" field="phone" placeholder="+380 99 123 4567" keyboardType="phone-pad" />
            <InputField label="Вулиця, будинок" field="street" placeholder="вул. Хрещатик, 1" />
            <InputField label="Квартира / офіс (необов'язково)" field="apartment" placeholder="кв. 15" />
          </View>

          {/* PAYMENT */}
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>💳 Спосіб оплати</Text>
            <View style={styles.paymentGrid}>
              {PAYMENT_METHODS.map(pm => (
                <TouchableOpacity
                  key={pm.id}
                  onPress={() => setPayment(pm.id)}
                  style={[
                    styles.paymentOption,
                    {
                      backgroundColor: payment === pm.id ? COLORS.primary + '18' : colors.background,
                      borderColor: payment === pm.id ? COLORS.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={styles.paymentEmoji}>{pm.emoji}</Text>
                  <Text style={[styles.paymentLabel, { color: payment === pm.id ? COLORS.primary : colors.textSecondary }]}>
                    {pm.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* COMMENT */}
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>📝 Коментар кур'єру</Text>
            <InputField label="" field="comment" placeholder="Зателефонуйте перед приїздом..." multiline />
          </View>

          {/* SUMMARY */}
          <View style={[styles.orderSummary, { backgroundColor: colors.surface }]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Доставка</Text>
              <Text style={[styles.summaryVal, { color: deliveryFee === 0 ? COLORS.success : colors.text }]}>
                {deliveryFee === 0 ? 'Безкоштовно' : `${deliveryFee} грн`}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.summaryRow}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>До сплати</Text>
              <Text style={[styles.totalVal, { color: COLORS.primary }]}>{total} грн</Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.orderBtn, SHADOWS.primary]} onPress={handleOrder}>
            <Text style={styles.orderBtnText}>Підтвердити замовлення ✓</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
    gap: 12,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 22 },
  title: { ...FONTS.bold, fontSize: 22 },
  content: { padding: 20, gap: 12, paddingBottom: 40 },
  section: { borderRadius: SIZES.radius.lg, padding: 16 },
  sectionTitle: { ...FONTS.bold, fontSize: 16, marginBottom: 14 },
  fieldWrapper: { marginBottom: 12 },
  label: { ...FONTS.medium, fontSize: 12, marginBottom: 5 },
  input: { borderWidth: 1.5, borderRadius: SIZES.radius.md, paddingHorizontal: 14, ...FONTS.regular, fontSize: 15 },
  errorText: { ...FONTS.regular, color: COLORS.error, fontSize: 11, marginTop: 3 },
  paymentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  paymentOption: { width: '47%', padding: 14, borderRadius: SIZES.radius.md, borderWidth: 1.5, alignItems: 'center', gap: 6 },
  paymentEmoji: { fontSize: 26 },
  paymentLabel: { ...FONTS.medium, fontSize: 13 },
  orderSummary: { borderRadius: SIZES.radius.lg, padding: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { ...FONTS.regular, fontSize: 14 },
  summaryVal: { ...FONTS.medium, fontSize: 14 },
  divider: { height: 1, marginVertical: 10 },
  totalLabel: { ...FONTS.bold, fontSize: 16 },
  totalVal: { ...FONTS.extraBold, fontSize: 22 },
  orderBtn: { backgroundColor: COLORS.primary, borderRadius: SIZES.radius.full, paddingVertical: 17, alignItems: 'center', marginTop: 4, marginBottom: 20 },
  orderBtnText: { ...FONTS.bold, color: '#fff', fontSize: 17 },
});
