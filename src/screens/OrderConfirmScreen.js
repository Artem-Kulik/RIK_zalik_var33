import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { COLORS, FONTS, SHADOWS, SIZES } from '../constants/theme';

const TRACK_STEPS = [
  { id: 1, label: 'Замовлення прийнято', emoji: '✅', done: true },
  { id: 2, label: 'Готується на кухні', emoji: '👨‍🍳', done: false, delay: 2000 },
  { id: 3, label: 'Кур\'єр їде до вас', emoji: '🛵', done: false, delay: 4500 },
  { id: 4, label: 'Доставлено!', emoji: '🏠', done: false, delay: 7000 },
];

export default function OrderConfirmScreen({ route, navigation }) {
  const { orderNum, estimatedTime, total } = route.params;
  const { colors, isDark } = useTheme();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [steps, setSteps] = useState(TRACK_STEPS);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Animate check
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.2, friction: 4, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();
    Animated.timing(opacityAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();

    // Simulate order progress
    TRACK_STEPS.forEach((step, idx) => {
      if (idx === 0) return;
      setTimeout(() => {
        setCurrentStep(idx);
        setSteps(prev => prev.map((s, i) => i <= idx ? { ...s, done: true } : s));
      }, step.delay);
    });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <LinearGradient
        colors={isDark ? ['#1A1A2E', '#252540'] : ['#FF6B35', '#FF8C5A']}
        style={styles.hero}
      >
        <Animated.View style={[styles.checkCircle, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.checkEmoji}>✅</Text>
        </Animated.View>
        <Animated.View style={{ opacity: opacityAnim, alignItems: 'center' }}>
          <Text style={styles.heroTitle}>Замовлення прийнято!</Text>
          <Text style={styles.heroSubtitle}>Дякуємо за вибір Смачно 🍽️</Text>
          <View style={styles.orderNumBox}>
            <Text style={styles.orderNumLabel}>Номер замовлення</Text>
            <Text style={styles.orderNum}>{orderNum}</Text>
          </View>
        </Animated.View>
      </LinearGradient>

      <View style={styles.content}>
        {/* INFO CARDS */}
        <View style={styles.infoRow}>
          <View style={[styles.infoCard, { backgroundColor: colors.surface }, SHADOWS.sm]}>
            <Text style={styles.infoEmoji}>⏱️</Text>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Час доставки</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{estimatedTime}</Text>
          </View>
          <View style={[styles.infoCard, { backgroundColor: colors.surface }, SHADOWS.sm]}>
            <Text style={styles.infoEmoji}>💰</Text>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Сплачено</Text>
            <Text style={[styles.infoValue, { color: COLORS.primary }]}>{total} грн</Text>
          </View>
        </View>

        {/* TRACKING */}
        <View style={[styles.trackCard, { backgroundColor: colors.surface }, SHADOWS.sm]}>
          <Text style={[styles.trackTitle, { color: colors.text }]}>Відстеження замовлення</Text>
          {steps.map((step, idx) => (
            <View key={step.id} style={styles.trackStep}>
              <View style={styles.trackLeft}>
                <View style={[
                  styles.trackDot,
                  { backgroundColor: step.done ? COLORS.success : colors.border },
                ]}>
                  {step.done && <Text style={styles.trackDotCheck}>✓</Text>}
                </View>
                {idx < steps.length - 1 && (
                  <View style={[
                    styles.trackLine,
                    { backgroundColor: steps[idx + 1].done ? COLORS.success : colors.border },
                  ]} />
                )}
              </View>
              <View style={styles.trackContent}>
                <Text style={styles.trackEmoji}>{step.emoji}</Text>
                <Text style={[
                  styles.trackLabel,
                  { color: step.done ? colors.text : colors.textTertiary },
                  step.done && FONTS.semiBold,
                ]}>
                  {step.label}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.homeBtn, SHADOWS.primary]}
          onPress={() => navigation.navigate('HomeTab')}
        >
          <Text style={styles.homeBtnText}>На головну 🏠</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.newOrderBtn, { borderColor: COLORS.primary }]}
          onPress={() => navigation.navigate('MenuTab')}
        >
          <Text style={[styles.newOrderBtnText, { color: COLORS.primary }]}>Зробити ще одне замовлення</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    paddingTop: 70,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  checkCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  checkEmoji: { fontSize: 48 },
  heroTitle: { ...FONTS.extraBold, color: '#fff', fontSize: 24, marginBottom: 6 },
  heroSubtitle: { ...FONTS.medium, color: 'rgba(255,255,255,0.85)', fontSize: 14, marginBottom: 20 },
  orderNumBox: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 24, paddingVertical: 12, borderRadius: SIZES.radius.lg, alignItems: 'center' },
  orderNumLabel: { ...FONTS.medium, color: 'rgba(255,255,255,0.7)', fontSize: 11, marginBottom: 4 },
  orderNum: { ...FONTS.extraBold, color: '#fff', fontSize: 22, letterSpacing: 2 },

  content: { flex: 1, padding: 20, paddingTop: 24 },
  infoRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  infoCard: { flex: 1, borderRadius: SIZES.radius.lg, padding: 16, alignItems: 'center' },
  infoEmoji: { fontSize: 28, marginBottom: 8 },
  infoLabel: { ...FONTS.regular, fontSize: 12, marginBottom: 4 },
  infoValue: { ...FONTS.bold, fontSize: 16 },

  trackCard: { borderRadius: SIZES.radius.lg, padding: 20, marginBottom: 16 },
  trackTitle: { ...FONTS.bold, fontSize: 16, marginBottom: 20 },
  trackStep: { flexDirection: 'row', gap: 14, marginBottom: 0 },
  trackLeft: { alignItems: 'center', width: 24 },
  trackDot: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  trackDotCheck: { color: '#fff', fontSize: 12, fontWeight: '700' },
  trackLine: { width: 2, flex: 1, minHeight: 28, marginTop: 4, marginBottom: 4 },
  trackContent: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, paddingBottom: 20 },
  trackEmoji: { fontSize: 20 },
  trackLabel: { ...FONTS.regular, fontSize: 14, flex: 1 },

  homeBtn: { backgroundColor: COLORS.primary, borderRadius: SIZES.radius.full, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  homeBtnText: { ...FONTS.bold, color: '#fff', fontSize: 16 },
  newOrderBtn: { borderWidth: 2, borderRadius: SIZES.radius.full, paddingVertical: 14, alignItems: 'center' },
  newOrderBtnText: { ...FONTS.semiBold, fontSize: 15 },
});
