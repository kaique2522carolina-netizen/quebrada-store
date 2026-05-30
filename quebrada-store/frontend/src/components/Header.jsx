import { ShoppingBag, Menu, User, Search } from 'lucide-react'
import Logo from './Logo'
import { useCartStore, useUIStore } from '../store'

export default function Header({ onSearch }) {
  const count = useCartStore(s => s.items.reduce((a, i) => a + i.qty, 0))
  const { openCart, openMenu } = useUIStore()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between px-4 h-16 max-w-lg mx-auto">
        {/* Hamburger */}
        <button
          onClick={openMenu}
          className="w-10 h-10 flex items-center justify-center text-white hover:text-zinc-300 transition-colors rounded-xl hover:bg-white/5"
          aria-label="Menu"
        >
          <Menu size={22} />
        </button>

        {/* Logo */}
        <Logo />

        {/* Right Icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={onSearch}
            className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors rounded-xl hover:bg-white/5"
            aria-label="Buscar"
          >
            <Search size={20} />
          </button>

          <button
            className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors rounded-xl hover:bg-white/5"
            aria-label="Conta"
          >
            <User size={20} />
          </button>

          <button
            onClick={openCart}
            className="w-10 h-10 flex items-center justify-center text-white hover:text-zinc-300 transition-colors rounded-xl hover:bg-white/5 relative"
            aria-label="Carrinho"
          >
            <ShoppingBag size={22} />
            {count > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-white text-black text-[9px] font-black rounded-full flex items-center justify-center leading-none">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
