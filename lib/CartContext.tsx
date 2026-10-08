"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "@/types/content";

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  add: (product: Product) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "kilimo-hai-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      // kikapu kibovu - anza upya
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((n, i) => n + i.qty * i.price, 0),
      add: (p) =>
        setItems((prev) => {
          const existing = prev.find((i) => i.product_id === p.id);
          if (existing) {
            return prev.map((i) =>
              i.product_id === p.id ? { ...i, qty: Math.min(i.qty + 1, Math.max(p.stock, 1)) } : i
            );
          }
          return [
            ...prev,
            {
              product_id: p.id,
              name: p.name,
              price: p.price,
              unit: p.unit,
              qty: 1,
              image_url: p.image_url,
            },
          ];
        }),
      setQty: (id, qty) =>
        setItems((prev) =>
          qty < 1
            ? prev.filter((i) => i.product_id !== id)
            : prev.map((i) => (i.product_id === id ? { ...i, qty } : i))
        ),
      remove: (id) => setItems((prev) => prev.filter((i) => i.product_id !== id)),
      clear: () => setItems([]),
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
