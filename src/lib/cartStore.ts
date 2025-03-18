import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  discount?: number;
  color?: string;
}

interface DeliveryAddress {
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface CartStore {
  items: CartItem[];
  deliveryAddress: DeliveryAddress | null;
  deliveryFee: number;
  setDeliveryFee: (fee: number) => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setDeliveryAddress: (address: DeliveryAddress) => void;
  getSubtotal: () => number;
  getDiscountTotal: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryAddress: null,
      deliveryFee: 5.99,

      setDeliveryFee: (fee) => set({ deliveryFee: fee }),

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
              ),
            };
          }

          return {
            items: [...state.items, { ...item, quantity: 1 }],
          };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.id !== id),
            };
          }

          return {
            items: state.items.map((item) =>
              item.id === id ? { ...item, quantity } : item,
            ),
          };
        }),

      clearCart: () => set({ items: [] }),

      setDeliveryAddress: (address) => set({ deliveryAddress: address }),

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const itemPrice = item.discount
            ? item.price * (1 - item.discount / 100)
            : item.price;
          return total + itemPrice * item.quantity;
        }, 0);
      },

      getDiscountTotal: () => {
        return get().items.reduce((total, item) => {
          if (!item.discount) return total;
          const discountAmount =
            ((item.price * item.discount) / 100) * item.quantity;
          return total + discountAmount;
        }, 0);
      },

      getTotal: () => {
        return get().getSubtotal() + get().deliveryFee;
      },
    }),
    {
      name: "cart-storage",
    },
  ),
);
