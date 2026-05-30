import React, { createContext, useContext, useReducer, useMemo } from 'react';
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD, PROMO_CODES } from '../constants/menuData';

const CartContext = createContext();

const initialState = {
  items: [],
  promoCode: '',
  promoDiscount: null,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.item, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case 'INCREMENT':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    case 'DECREMENT': {
      const item = state.items.find(i => i.id === action.id);
      if (item.quantity <= 1) {
        return { ...state, items: state.items.filter(i => i.id !== action.id) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.id ? { ...i, quantity: i.quantity - 1 } : i
        ),
      };
    }
    case 'APPLY_PROMO': {
      const promo = PROMO_CODES[action.code.toUpperCase()];
      if (promo) {
        return { ...state, promoCode: action.code.toUpperCase(), promoDiscount: promo };
      }
      return { ...state, promoCode: action.code, promoDiscount: null };
    }
    case 'CLEAR_PROMO':
      return { ...state, promoCode: '', promoDiscount: null };
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const subtotal = useMemo(
    () => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [state.items]
  );

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;

  const discountAmount = useMemo(() => {
    if (!state.promoDiscount) return 0;
    if (state.promoDiscount.type === 'percent') {
      return Math.round(subtotal * (state.promoDiscount.discount / 100));
    }
    return state.promoDiscount.discount;
  }, [subtotal, state.promoDiscount]);

  const total = subtotal + deliveryFee - discountAmount;
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        promoCode: state.promoCode,
        promoDiscount: state.promoDiscount,
        subtotal,
        deliveryFee,
        discountAmount,
        total,
        itemCount,
        dispatch,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
