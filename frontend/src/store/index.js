import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  dark: localStorage.getItem('medicore-theme') === 'dark',
  toggle: () =>
    set((state) => { 
      const next = !state.dark
      localStorage.setItem('medicore-theme', next ? 'dark' : 'light')
      if (next) document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
      return { dark: next }
    }),
}))

export const useCartStore = create((set, get) => ({
  items: [],
  add: (product) => {
    const items = get().items
    const existing = items.find((i) => i.id === product.id)
    if (existing) { 
      set({ items: items.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i) })
    } else {
      set({ items: [...items, { ...product, qty: 1 }] })
    }
  },
  remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
  count: () => get().items.reduce((sum, i) => sum + i.qty, 0),
}))

export const useLocationStore = create((set) => ({
  coords: null,
  selectedRegion: 'tashkent_city',
  loading: false,
  error: null,
  setRegion: (regionId) => set({ selectedRegion: regionId }),
  fetch: () => {
    set({ loading: true, error: null })
    navigator.geolocation.getCurrentPosition(
      (pos) => set({ coords: { lat: pos.coords.latitude, lng: pos.coords.longitude }, loading: false }),
      (err) => set({ error: err.message, loading: false }),
      { timeout: 10000 }
    )
  },
}))
