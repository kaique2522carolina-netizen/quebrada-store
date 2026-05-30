import { X } from 'lucide-react'
import Logo from './Logo'
import { CATEGORIES } from '../data/products'
import { useUIStore } from '../store'

export default function MenuDrawer({ onNavigate }) {
  const { menuOpen, closeMenu } = useUIStore()

  const handleNav = (page, slug) => {
    onNavigate(page, slug)
    closeMenu()
  }

  const navItems = [
    { label: 'Início', action: () => handleNav('home') },
    { label: 'Todos os Produtos', action: () => handleNav('categories') },
    { type: 'divider' },
    ...CATEGORIES.map(c => ({
      label: `${c.emoji}  ${c.name}`,
      action: () => handleNav('categories', c.slug),
    })),
    { type: 'divider' },
    { label: '❤️  Favoritos', action: () => handleNav('favorites') },
    { label: '👤  Minha Conta', action: () => {} },
    { label: '📦  Meus Pedidos', action: () => {} },
  ]

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/80 z-[60] transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-zinc-950 z-[70] flex flex-col transition-transform duration-300 ease-out border-r border-white/5 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <Logo size="lg" />
          <button
            onClick={closeMenu}
            className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white transition-colors rounded-xl hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          {navItems.map((item, i) =>
            item.type === 'divider' ? (
              <div key={i} className="my-2 border-t border-white/5" />
            ) : (
              <button
                key={i}
                onClick={item.action}
                className="w-full text-left text-zinc-300 font-semibold text-[13px] py-3 px-3 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-150 tracking-wide"
              >
                {item.label}
              </button>
            )
          )}
        </nav>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-white/10 space-y-1">
          <p className="text-zinc-600 text-xs font-medium">Quebrada Store · 2026</p>
          <p className="text-zinc-700 text-[11px]">Sua fonte da quebrada 🖤</p>
        </div>
      </aside>
    </>
  )
}
