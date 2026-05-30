import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, FlatList,
  TouchableOpacity, StatusBar, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { CATEGORIES, MENU_ITEMS } from '../constants/menuData';
import FoodCard from '../components/FoodCard';
import SearchBar from '../components/SearchBar';
import CategoryPill from '../components/CategoryPill';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { itemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const popular = MENU_ITEMS.filter(i => i.isPopular);
  const newItems = MENU_ITEMS.filter(i => i.isNew);
  const featured = MENU_ITEMS.slice(0, 3);

  const handleSearch = () => {
    navigation.navigate('MenuTab', { screen: 'Menu', params: { query: searchQuery } });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HERO HEADER */}
        <LinearGradient
          colors={isDark ? ['#1A1A2E', '#252540'] : ['#FF6B35', '#FF8C5A']}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Привіт! 👋</Text>
              <View style={styles.locationRow}>
                <Text style={styles.locationIcon}>📍</Text>
                <Text style={styles.location}>Київ, Хрещатик 1</Text>
                <Text style={styles.chevron}>▾</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={toggleTheme} style={styles.iconBtn}>
                <Text style={styles.iconBtnText}>{isDark ? '☀️' : '🌙'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('CartTab')}
                style={styles.iconBtn}
              >
                <Text style={styles.iconBtnText}>🛒</Text>
                {itemCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{itemCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.heroTitle}>Смачно і швидко{'\n'}прямо до тебе 🍕</Text>

          <View style={styles.searchWrapper}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Пошук страв та категорій..."
              onFocus={handleSearch}
            />
          </View>
        </LinearGradient>

        {/* CATEGORIES */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Категорії</Text>
          <FlatList
            data={CATEGORIES.filter(c => c.id !== 'all')}
            keyExtractor={i => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.categoryCard, { backgroundColor: colors.card }, SHADOWS.sm]}
                onPress={() => navigation.navigate('MenuTab', { screen: 'Menu', params: { category: item.id } })}
                activeOpacity={0.8}
              >
                <Text style={styles.categoryEmoji}>{item.emoji}</Text>
                <Text style={[styles.categoryName, { color: colors.text }]}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* PROMO BANNER */}
        <View style={styles.paddedSection}>
          <LinearGradient
            colors={['#2D3250', '#424769']}
            style={styles.promoBanner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.promoTag}>ПРОМОКОД</Text>
              <Text style={styles.promoTitle}>-20% на перше{'\n'}замовлення</Text>
              <View style={styles.promoCodeBox}>
                <Text style={styles.promoCode}>СМАЧНО20</Text>
              </View>
            </View>
            <Text style={styles.promoBig}>🎉</Text>
          </LinearGradient>
        </View>

        {/* POPULAR */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>🔥 Популярне</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MenuTab')}>
              <Text style={[styles.seeAll, { color: COLORS.primary }]}>Усі →</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={popular}
            keyExtractor={i => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item }) => (
              <View style={{ width: width * 0.56, marginRight: 12 }}>
                <FoodCard
                  item={item}
                  onPress={() => navigation.navigate('FoodDetail', { item })}
                />
              </View>
            )}
          />
        </View>

        {/* NEW ITEMS */}
        {newItems.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>✨ Нові страви</Text>
            {newItems.map(item => (
              <FoodCard
                key={item.id}
                item={item}
                horizontal
                onPress={() => navigation.navigate('FoodDetail', { item })}
              />
            ))}
          </View>
        )}

        {/* ALL RECOMMENDED */}
        <View style={[styles.section, { marginBottom: 30 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>💡 Рекомендуємо</Text>
          {featured.map(item => (
            <FoodCard
              key={item.id}
              item={item}
              onPress={() => navigation.navigate('FoodDetail', { item })}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { ...FONTS.medium, color: 'rgba(255,255,255,0.85)', fontSize: 14, marginBottom: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationIcon: { fontSize: 13 },
  location: { ...FONTS.semiBold, color: '#fff', fontSize: 14 },
  chevron: { color: '#fff', fontSize: 12, opacity: 0.8 },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  iconBtnText: { fontSize: 18 },
  cartBadge: { position: 'absolute', top: -2, right: -2, width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  cartBadgeText: { ...FONTS.bold, fontSize: 10, color: COLORS.primary },
  heroTitle: { ...FONTS.extraBold, color: '#fff', fontSize: 24, lineHeight: 32, marginBottom: 20 },
  searchWrapper: { backgroundColor: '#fff', borderRadius: SIZES.radius.full },

  section: { paddingHorizontal: 20, paddingTop: 24 },
  paddedSection: { paddingHorizontal: 20, paddingTop: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { ...FONTS.bold, fontSize: 18, marginBottom: 14 },
  seeAll: { ...FONTS.medium, fontSize: 14 },

  categoryList: { paddingBottom: 4 },
  categoryCard: { width: 78, alignItems: 'center', paddingVertical: 12, borderRadius: SIZES.radius.md, marginRight: 10 },
  categoryEmoji: { fontSize: 28, marginBottom: 6 },
  categoryName: { ...FONTS.medium, fontSize: 11, textAlign: 'center' },

  promoBanner: { borderRadius: SIZES.radius.lg, padding: 20, flexDirection: 'row', alignItems: 'center' },
  promoTag: { ...FONTS.semiBold, color: 'rgba(255,255,255,0.7)', fontSize: 11, letterSpacing: 1, marginBottom: 6 },
  promoTitle: { ...FONTS.extraBold, color: '#fff', fontSize: 20, lineHeight: 26, marginBottom: 12 },
  promoCodeBox: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: SIZES.radius.sm, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', borderStyle: 'dashed' },
  promoCode: { ...FONTS.bold, color: '#FFD700', fontSize: 14, letterSpacing: 1 },
  promoBig: { fontSize: 52 },

  horizontalList: { paddingBottom: 4 },
});
