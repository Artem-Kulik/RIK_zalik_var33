import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import EmptyState from '../components/EmptyState';
import FoodCard from '../components/FoodCard';

export default function FavoritesScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const { favorites } = useFavorites();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Обране</Text>
        {favorites.length > 0 && (
          <Text style={[styles.count, { color: colors.textSecondary }]}>{favorites.length} страв</Text>
        )}
      </View>

      {favorites.length === 0 ? (
        <EmptyState
          emoji="❤️"
          title="Список обраного порожній"
          subtitle="Натисніть ❤️ на будь-якій страві, щоб додати її сюди"
        />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={i => i.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <FoodCard
              item={item}
              onPress={() => navigation.navigate('FoodDetail', { item })}
            />
          )}
        />
      )}
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
  count: { ...FONTS.regular, fontSize: 14 },
  list: { padding: 20, paddingBottom: 30 },
});
