import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { COLORS, FONTS } from '../constants/theme';

import HomeScreen from '../screens/HomeScreen';
import MenuScreen from '../screens/MenuScreen';
import CartScreen from '../screens/CartScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import FoodDetailScreen from '../screens/FoodDetailScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderConfirmScreen from '../screens/OrderConfirmScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />
    </Stack.Navigator>
  );
}

function MenuStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />
    </Stack.Navigator>
  );
}

function CartStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderConfirm" component={OrderConfirmScreen} />
    </Stack.Navigator>
  );
}

function FavoritesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />
    </Stack.Navigator>
  );
}

function TabIcon({ emoji, label, focused, color }) {
  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.tabEmoji, { fontSize: focused ? 24 : 22 }]}>{emoji}</Text>
      <Text style={[styles.tabLabel, { color, fontSize: focused ? 11 : 10 }]}>{label}</Text>
    </View>
  );
}

export default function AppNavigator() {
  const { colors, isDark } = useTheme();
  const { itemCount } = useCart();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 70,
            paddingBottom: 8,
            paddingTop: 6,
          },
          tabBarShowLabel: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: colors.textTertiary,
        }}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <TabIcon emoji="🏠" label="Головна" focused={focused} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="MenuTab"
          component={MenuStack}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <TabIcon emoji="🍽️" label="Меню" focused={focused} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="CartTab"
          component={CartStack}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <View>
                <TabIcon emoji="🛒" label="Кошик" focused={focused} color={color} />
                {itemCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{itemCount > 9 ? '9+' : itemCount}</Text>
                  </View>
                )}
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="FavoritesTab"
          component={FavoritesStack}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <TabIcon emoji="❤️" label="Обране" focused={focused} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabIcon: { alignItems: 'center', gap: 2 },
  tabEmoji: {},
  tabLabel: { ...FONTS.medium },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
});
