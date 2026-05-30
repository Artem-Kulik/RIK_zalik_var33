import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar, Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { CATEGORIES, MENU_ITEMS } from '../constants/menuData';
import FoodCard from '../components/FoodCard';
import CategoryPill from '../components/CategoryPill';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';

export default function MenuScreen({ navigation, route }) {
  const { colors, isDark } = useTheme();
  const [search, setSearch] = useState(route?.params?.query || '');
  const [selectedCategory, setSelectedCategory] = useState(route?.params?.category || 'all');
  const [sortBy, setSortBy] = useState('popular');
  const [isListView, setIsListView] = useState(false);

  useEffect(() => {
    if (route?.params?.query) setSearch(route.params.query);
    if (route?.params?.category) setSelectedCategory(route.params.category);
  }, [route?.params]);

  const sortOptions = [
    { id: 'popular', label: 'Популярні' },
    { id: 'price_asc', label: 'Дешевше' },
    { id: 'price_desc', label: 'Дорожче' },
    { id: 'rating', label: 'Рейтинг' },
  ];

  const filtered = useMemo(() => {
    let items = MENU_ITEMS;
    if (selectedCategory !== 'all') items = items.filter(i => i.category === selectedCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.ingredients.some(ing => ing.toLowerCase().includes(q))
      );
    }
    switch (sortBy) {
      case 'price_asc': return [...items].sort((a, b) => a.price - b.price);
      case 'price_desc': return [...items].sort((a, b) => b.price - a.price);
      case 'rating': return [...items].sort((a, b) => b.rating - a.rating);
      default: return [...items].sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }
  }, [search, selectedCategory, sortBy]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* STICKY HEADER */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Меню</Text>
        <TouchableOpacity onPress={() => setIsListView(v => !v)} style={styles.viewToggle}>
          <Text style={{ fontSize: 20 }}>{isListView ? '⊞' : '☰'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={isListView ? filtered : filtered}
        keyExtractor={i => i.id}
        numColumns={isListView ? 1 : 2}
        key={isListView ? 'list' : 'grid'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* SEARCH */}
            <View style={styles.searchSection}>
              <SearchBar value={search} onChangeText={setSearch} />
            </View>

            {/* CATEGORIES */}
            <FlatList
              data={CATEGORIES}
              keyExtractor={i => i.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.catList}
              renderItem={({ item }) => (
                <CategoryPill
                  item={item}
                  selected={selectedCategory === item.id}
                  onPress={() => setSelectedCategory(item.id)}
                />
              )}
            />

            {/* SORT CHIPS */}
            <View style={styles.sortRow}>
              {sortOptions.map(opt => (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => setSortBy(opt.id)}
                  style={[
                    styles.sortChip,
                    { backgroundColor: sortBy === opt.id ? COLORS.primary : colors.surface, borderColor: colors.border },
                  ]}
                >
                  <Text style={[styles.sortLabel, { color: sortBy === opt.id ? '#fff' : colors.textSecondary }]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* RESULTS COUNT */}
            <Text style={[styles.count, { color: colors.textSecondary }]}>
              {filtered.length} страв
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            emoji="🔍"
            title="Нічого не знайдено"
            subtitle="Спробуйте змінити запит або категорію"
          />
        }
        columnWrapperStyle={isListView ? undefined : styles.columnWrapper}
        renderItem={({ item }) => (
          <View style={isListView ? styles.listItem : styles.gridItem}>
            <FoodCard
              item={item}
              horizontal={isListView}
              onPress={() => navigation.navigate('FoodDetail', { item })}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  title: { ...FONTS.bold, fontSize: 26 },
  viewToggle: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  searchSection: { paddingHorizontal: 20, paddingTop: 16, marginBottom: 12 },
  catList: { paddingHorizontal: 20, paddingBottom: 14 },
  sortRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 12, flexWrap: 'wrap' },
  sortChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: SIZES.radius.full, borderWidth: 1 },
  sortLabel: { ...FONTS.medium, fontSize: 12 },
  count: { ...FONTS.regular, fontSize: 13, paddingHorizontal: 20, marginBottom: 8 },
  listContent: { paddingBottom: 30 },
  columnWrapper: { paddingHorizontal: 16, gap: 10 },
  gridItem: { flex: 1 },
  listItem: { paddingHorizontal: 20 },
});
