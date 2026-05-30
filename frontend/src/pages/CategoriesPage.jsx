import { useState } from 'react'
import { CATEGORIES, PRODUCTS } from '../data/products'
import ProductCard from '../components/ProductCard'
import { useCartStore } from '../store'
import { SkeletonGrid } from '../components/Skeleton'
import { SlidersHorizontal } from 'lucide-react'

export default function CategoriesPage({ initialSlug, onOpenProduct, toast }) {
  const [active, setActive] = useState(initialSlug || 'camisetas')
  const [sortBy, setSortBy] = useState('default')
  const addItem = useCartStore(s => s.addItem)

  const handleAddCart = (product) => {
    addItem(product, product.sizes[0], product.colorNames?.[0])
    toast(`${product.name} adicionado! 🛒`, 'success')
  }

  let filtered = PRODUCTS.filter(p => p.category === active)
  if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price)
  if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating)

  const cat = CATEGORIES.find(c => c.slug === active)

  return (
    <div className="min-h-screen bg-black pt-20 pb-32 page-enter">
      {/* Category pills */}
      <div className="overflow-x-auto px-4 py-4 scrollbar-hide border-b border-white/5">
        <div className="flex gap-2.5 w-max">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setActive(c.slug)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-[11px] font-black whitespace-nowrap transition-all duration-200 border ${
                active === c.slug
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-zinc-400 border-white/15 hover:border-white/30'
              }`}
            >
              <span>{c.emoji}</span>
              {c.name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-white font-black text-xl tracking-wider">
              {cat?.emoji} {cat?.name.toUpperCase()}
            </h2>
            <p className="text-zinc-500 text-xs font-medium mt-0.5">
              {filtered.length} produto{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-zinc-500" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-zinc-900 text-zinc-300 text-[11px] font-bold border border-white/10 rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="default">Relevância</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="rating">Avaliação</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <span className="text-6xl">{cat?.emoji}</span>
            <p className="text-white font-bold text-lg">Em breve!</p>
            <p className="text-zinc-500 text-sm">Novos produtos nessa categoria chegando em breve.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filtered.map(product => (
              <div key={product.id} className="space-y-3">
                <div
                  className={`aspect-square rounded-2xl bg-gradient-to-br ${product.gradient} flex items-center justify-center overflow-hidden border border-white/5 cursor-pointer relative group`}
                  onClick={() => onOpenProduct(product)}
                >
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{product.emoji}</span>
                  {product.tag && (
                    <span className="absolute top-2 left-2 text-[8px] font-black bg-white text-black px-2 py-0.5 rounded-full">
                      {product.tag}
                    </span>
                  )}
                  {product.stock <= 3 && (
                    <span className="absolute bottom-2 left-2 text-[8px] font-black bg-red-600 text-white px-2 py-0.5 rounded-full">
                      Últimas!
                    </span>
                  )}
                </div>
                <div className="cursor-pointer" onClick={() => onOpenProduct(product)}>
                  <p className="text-white font-bold text-[12px] leading-tight line-clamp-2">{product.name}</p>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-white font-black text-sm">R${product.price.toLocaleString('pt-BR')}</span>
                    <span className="text-zinc-600 text-[10px] line-through">R${product.originalPrice.toLocaleString('pt-BR')}</span>
                  </div>
                  {product.freeShipping && <p className="text-green-400 text-[10px] font-bold">🚚 Frete grátis</p>}
                </div>
                <button
                  className="w-full bg-white text-black text-[10px] font-black py-2.5 rounded-xl hover:bg-zinc-100 transition-colors tracking-widest active:scale-95"
                  onClick={() => handleAddCart(product)}
                >
                  ADICIONAR
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
