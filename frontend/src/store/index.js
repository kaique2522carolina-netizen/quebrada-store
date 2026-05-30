import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── CART STORE ───────────────────────────────────────────────────────────────
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, size, color) => {
        const key = `${product.id}-${size}-${color}`
        const existing = get().items.find(i => i.key === key)
        if (existing) {
          set(state => ({
            items: state.items.map(i =>
              i.key === key ? { ...i, qty: i.qty + 1 } : i
            )
          }))
        } else {
          set(state => ({
            items: [...state.items, { ...product, key, size, color, qty: 1 }]
          }))
        }
      },

      removeItem: (key) =>
        set(state => ({ items: state.items.filter(i => i.key !== key) })),

      updateQty: (key, qty) => {
        if (qty <= 0) {
          set(state => ({ items: state.items.filter(i => i.key !== key) }))
          return
        }
        set(state => ({
          items: state.items.map(i => (i.key === key ? { ...i, qty } : i))
        }))
      },

      clearCart: () => set({ items: [] }),

      get total() {
        return get().items.reduce((acc, i) => acc + i.price * i.qty, 0)
      },

      get count() {
        return get().items.reduce((acc, i) => acc + i.qty, 0)
      },
    }),
    { name: 'qs-cart' }
  )
)

// ─── FAVORITES STORE ──────────────────────────────────────────────────────────
export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      ids: [],

      toggle: (id) => {
        const already = get().ids.includes(id)
        set(state => ({
          ids: already
            ? state.ids.filter(i => i !== id)
            : [...state.ids, id]
        }))
        return !already // returns true if just added
      },

      isFav: (id) => get().ids.includes(id),
    }),
    { name: 'qs-favorites' }
  )
)

// ─── UI STORE ─────────────────────────────────────────────────────────────────
export const useUIStore = create(set => ({
  cartOpen: false,
  menuOpen: false,
  searchOpen: false,

  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  toggleCart: () => set(s => ({ cartOpen: !s.cartOpen })),

  openMenu: () => set({ menuOpen: true }),
  closeMenu: () => set({ menuOpen: false }),

  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
}))
