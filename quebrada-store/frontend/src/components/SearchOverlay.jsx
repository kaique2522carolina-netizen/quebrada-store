import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { PRODUCTS } from '../data/products'

export default function SearchOverlay({ isOpen, onClose, onOpenProduct }) {
  const [query, setQuery] = useState('')

  const results = query.trim().length > 1
    ? PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.tag?.toLowerCase().includes(query.toLowerCase())
      )
    : []

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black z-[80] flex flex-col animate-fade-in">
      {/* Search input */}
      <div className="flex items-center gap-3 px-4 py-4 pt-safe border-b border-white/10" style={{ paddingTop: '1rem' }}>
        <div className="flex-1 flex items-center gap-3 bg-zinc-900 rounded-2xl px-4 py-3 border border-white/10 focus-within:border-white/30 transition-colors">
          <Search size={18} className="text-zinc-500 flex-shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar produtos..."
            className="flex-1 bg-transparent text-white text-sm placeholder-zinc-600 focus:outline-none font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-zinc-500 hover:text-white transition-colors">
              <X size={16} />
            </button>
          )}
        </div>
        <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors font-bold text-sm">
          Cancelar
        </button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {query.trim().length <= 1 && (
          <div className="text-center py-16 space-y-3">
            <span className="text-5xl">🔍</span>
            <p className="text-zinc-500 text-sm">Digite para buscar produtos</p>
          </div>
        )}

        {query.trim().length > 1 && results.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <span className="text-5xl">😕</span>
            <p className="text-white font-bold">Nenhum resultado para "{query}"</p>
            <p className="text-zinc-500 text-sm">Tente outra busca</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-2">
            <p className="text-zinc-500 text-xs font-bold mb-4 uppercase tracking-wider">
              {results.length} resultado{results.length > 1 ? 's' : ''}
            </p>
            {results.map(product => (
              <button
                key={product.id}
                className="w-full flex items-center gap-4 bg-zinc-900 rounded-2xl p-4 border border-white/5 hover:border-white/20 transition-colors text-left"
                onClick={() => { onOpenProduct(product); onClose(); }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center text-2xl flex-shrink-0`}>
                  {product.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm truncate">{product.name}</p>
                  <p className="text-zinc-500 text-xs capitalize">{product.category}</p>
                  <p className="text-white font-black text-sm mt-0.5">R${product.price.toLocaleString('pt-BR')}</p>
                </div>
                {product.tag && (
                  <span className="text-[9px] font-black bg-white text-black px-2 py-1 rounded-full flex-shrink-0">
                    {product.tag}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
