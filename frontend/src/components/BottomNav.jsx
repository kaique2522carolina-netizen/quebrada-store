import { Home, Grid, Heart, ShoppingBag } from 'lucide-react'
import { useCartStore, useFavoritesStore, useUIStore } from '../store'

export default function BottomNav({ page, onNavigate }) {
  const count = useCartStore(s => s.items.reduce((a, i) => a + i.qty, 0))
  const favCount = useFavoritesStore(s => s.ids.length)
  const { openCart } = useUIStore()

  const tabs = [
    {
      id: 'home',
      label: 'Início',
      icon: Home,
      action: () => onNavigate('home'),
    },
    {
      id: 'categories',
      label: 'Catálogo',
      icon: Grid,
      action: () => onNavigate('categories'),
    },
    {
      id: 'favorites',
      label: 'Favoritos',
      icon: Heart,
      badge: favCount,
      action: () => onNavigate('favorites'),
      activeColor: favCount > 0 ? 'text-red-500 fill-red-500' : '',
    },
    {
      id: 'cart',
      label: 'Carrinho',
      icon: ShoppingBag,
      badge: count,
      action: openCart,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/5 z-40 safe-bottom">
      <div className="flex items-center justify-around px-2 pt-2 pb-3 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = page === tab.id
          return (
            <button
              key={tab.id}
              onClick={tab.action}
              className={`flex flex-col items-center gap-1 px-5 py-1.5 rounded-2xl transition-all duration-200 relative ${
                isActive ? 'text-white' : tab.activeColor || 'text-zinc-600'
              }`}
            >
              <div className="relative">
                <Icon
                  size={22}
                  className={`transition-all duration-200 ${
                    tab.id === 'favorites' && favCount > 0 ? 'fill-red-500 text-red-500' : ''
                  }`}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                {tab.badge > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-white text-black text-[8px] font-black rounded-full flex items-center justify-center leading-none">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-bold transition-all duration-200 ${isActive ? 'text-white' : 'text-zinc-600'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
