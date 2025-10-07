import { create } from 'zustand';
import type { StateCreator } from 'zustand';

export type CartItem = {
  id: number | string;
  name: string;
  price_eur: number;
  qty: number;
  image_url?: string;
};

type State = {
  items: CartItem[];
  open: boolean;
  currency: 'EUR' | 'USD' | 'XOF';
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  remove: (id: CartItem['id']) => void;
  clear: () => void;
  toggle: (value?: boolean) => void;
  setCurrency: (c: 'EUR' | 'USD' | 'XOF') => void;
  updateQty: (id: CartItem['id'], qty: number) => void;
};
const creator: StateCreator<State> = (set, get) => ({
  items: [],
  open: false,
  currency: 'EUR',
  add: (item: Omit<CartItem, 'qty'>, qty = 1) => {
    const items = get().items.slice();
    const idx = items.findIndex((i) => i.id === item.id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], qty: items[idx].qty + qty };
    } else {
      items.push({ ...item, qty });
    }
    set({ items });
  },
  remove: (id: CartItem['id']) => {
    set({ items: get().items.filter((i) => i.id !== id) });
  },
  clear: () => set({ items: [] }),
  toggle: (value?: boolean) =>
    set({ open: typeof value === 'boolean' ? value : !get().open }),
  updateQty: (id: CartItem['id'], qty: number) => {
    const items = get().items.slice();
    const idx = items.findIndex((i) => i.id === id);
    if (idx >= 0) {
      if (qty <= 0) items.splice(idx, 1);
      else items[idx] = { ...items[idx], qty };
      set({ items });
    }
  },
  setCurrency: (c: 'EUR' | 'USD' | 'XOF') => set({ currency: c }),
});

export const useCartStore = create<State>()(creator);

export default useCartStore;
