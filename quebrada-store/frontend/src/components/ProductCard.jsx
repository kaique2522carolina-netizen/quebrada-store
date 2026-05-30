import { Heart, Star } from 'lucide-react'
import RippleButton from './RippleButton'
import { useFavoritesStore } from '../store'

export default function ProductCard({ product, onAddCart, onOpen }) {
  const { toggle, isFav } = useFavoritesStore()
  const fav = isFav(product.id)
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  return (
    <div className="relative flex-shrink-0 w-52 group">
      {/* Image Area */}
      <div
        className={`relative w-full aspect-square rounded-2xl bg-gradient-to-br ${product.gradient} flex items-center justify-center overflow-hidden mb-3 border border-white/5 cursor-pointer`}
        onClick={() => onOpen(product)}
      >
        {/* Tag */}
        {product.tag && (
          <span className="absolute top-3 left-3 text-[9px] font-black tracking-widest bg-white text-black px-2 py-1 rounded-full z-10 uppercase">
            {product.tag}
          </span>
        )}

        {/* Discount */}
        <span className="absolute top-3 right-10 text-[9px] font-black bg-red-600 text-white px-2 py-1 rounded-full z-10">
          -{discount}%
        </span>

        {/* Emoji */}
        <span className="product-emoji text-7xl select-none transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
          {product.emoji}
        </span>

        {/* Favorite */}
        <button
          className="absolute bottom-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all duration-200 active:scale-90"
          onClick={(e) => { e.stopPropagation(); toggle(product.id) }}
        >
          <Heart
            size={15}
            className={`transition-all duration-300 ${fav ? 'fill-red-500 text-red-500' : 'text-white'}`}
          />
        </button>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300 rounded-2xl pointer-events-none" />
      </div>

      {/* Info */}
      <div className="px-1 cursor-pointer" onClick={() => onOpen(product)}>
        <p className="text-white font-bold text-[13px] leading-tight mb-1 line-clamp-2">{product.name}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-1.5">
          <Star size={10} className="fill-yellow-400 text-yellow-400" />
          <span className="text-zinc-400 text-[10px] font-medium">{product.rating} ({product.reviews})</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-white font-black text-base">
            R${product.price.toLocaleString('pt-BR')}
          </span>
          <span className="text-zinc-600 text-[11px] line-through">
            R${product.originalPrice.toLocaleString('pt-BR')}
          </span>
        </div>
        <p className="text-zinc-600 text-[10px] mt-0.5">
          12x R${Math.ceil(product.price / 12).toLocaleString('pt-BR')} s/juros
        </p>
        {product.freeShipping && (
          <span className="text-green-400 text-[10px] font-bold">🚚 Frete grátis</span>
        )}
      </div>

      {/* Add Button */}
      <RippleButton
        className="mt-3 w-full bg-white text-black text-[11px] font-black py-2.5 rounded-xl hover:bg-zinc-100 transition-colors tracking-widest"
        onClick={() => onAddCart(product)}
      >
        ADICIONAR
      </RippleButton>
    </div>
  )
}
