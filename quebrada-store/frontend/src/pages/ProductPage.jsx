import { useState } from 'react'
import { ChevronLeft, Heart, Star, Truck, Shield, RefreshCw, Share2 } from 'lucide-react'
import RippleButton from '../components/RippleButton'
import { useCartStore, useFavoritesStore } from '../store'

export default function ProductPage({ product, onBack, toast }) {
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(0)
  const [qty, setQty] = useState(1)
  const { toggle, isFav } = useFavoritesStore()
  const addItem = useCartStore(s => s.addItem)

  const fav = isFav(product.id)
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
  const currentSize = selectedSize || (product.sizes[0] !== 'U' ? null : 'U')

  const handleAddCart = () => {
    if (product.sizes[0] !== 'U' && !selectedSize) {
      toast('Selecione um tamanho', 'error')
      return
    }
    addItem(
      { ...product, qty },
      currentSize,
      product.colorNames?.[selectedColor]
    )
    toast(`${product.name} adicionado! 🛒`, 'success')
  }

  const handleFav = () => {
    const added = toggle(product.id)
    toast(added ? 'Adicionado aos favoritos ❤️' : 'Removido dos favoritos', added ? 'heart' : 'info')
  }

  return (
    <div className="min-h-screen bg-black pb-36 page-enter">
      {/* Back + Share */}
      <div className="sticky top-16 z-40 px-4 pt-3 pb-2 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-semibold">Voltar</span>
        </button>
        <button className="w-9 h-9 rounded-full bg-zinc-900/80 backdrop-blur flex items-center justify-center text-zinc-400 hover:text-white transition-colors border border-white/5">
          <Share2 size={16} />
        </button>
      </div>

      {/* Product Image */}
      <div className="px-4 mt-1">
        <div className={`relative w-full aspect-square rounded-3xl bg-gradient-to-br ${product.gradient} flex items-center justify-center border border-white/5 overflow-hidden`}>
          {/* Tags */}
          {product.tag && (
            <span className="absolute top-4 left-4 text-[10px] font-black tracking-widest bg-white text-black px-3 py-1.5 rounded-full z-10">
              {product.tag}
            </span>
          )}
          <span className="absolute top-4 right-4 text-[10px] font-black bg-red-600 text-white px-3 py-1.5 rounded-full z-10">
            -{discount}%
          </span>

          {/* Emoji */}
          <span className="text-[10rem] select-none">{product.emoji}</span>

          {/* Favorite */}
          <button
            onClick={handleFav}
            className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all duration-200 active:scale-90 border border-white/10"
          >
            <Heart
              size={22}
              className={`transition-all duration-300 ${fav ? 'fill-red-500 text-red-500' : 'text-white'}`}
            />
          </button>

          {/* Stock warning */}
          {product.stock <= 5 && (
            <div className="absolute bottom-4 left-4 bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-black px-3 py-1.5 rounded-full">
              🔥 Só {product.stock} restantes!
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="px-4 mt-6 space-y-6">
        {/* Name + Rating */}
        <div>
          <p className="text-zinc-500 text-[11px] font-black tracking-widest uppercase mb-2">
            {product.category}
          </p>
          <h1 className="text-white font-black text-2xl leading-tight">{product.name}</h1>

          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-700'}
                />
              ))}
            </div>
            <span className="text-zinc-400 text-xs font-semibold">
              {product.rating} ({product.reviews} avaliações)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-white font-black text-4xl">
              R${product.price.toLocaleString('pt-BR')}
            </span>
            <span className="text-zinc-600 text-base line-through">
              R${product.originalPrice.toLocaleString('pt-BR')}
            </span>
          </div>
          <p className="text-zinc-400 text-sm mt-1">
            em até <strong className="text-white">12x</strong> de{' '}
            <strong className="text-white">R${Math.ceil(product.price / 12).toLocaleString('pt-BR')}</strong> sem juros
          </p>
          {product.freeShipping && (
            <span className="inline-block mt-2 text-green-400 text-xs font-bold">
              🚚 Frete grátis para todo o Brasil
            </span>
          )}
        </div>

        {/* Color selector */}
        {product.colors && (
          <div>
            <p className="text-white font-black text-xs tracking-widest mb-3">
              COR: <span className="font-semibold text-zinc-300">{product.colorNames?.[selectedColor]}</span>
            </p>
            <div className="flex gap-3">
              {product.colors.map((color, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColor(i)}
                  className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                    selectedColor === i ? 'border-white scale-110 shadow-lg shadow-white/10' : 'border-white/20'
                  }`}
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Size selector */}
        {product.sizes[0] !== 'U' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-black text-xs tracking-widest">
                TAMANHO {selectedSize && <span className="font-semibold text-zinc-300">— {selectedSize}</span>}
              </p>
              <button className="text-zinc-500 text-xs font-bold hover:text-white transition-colors underline">
                Guia de tamanhos
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all duration-150 ${
                    selectedSize === size
                      ? 'bg-white text-black border-white scale-105'
                      : 'bg-transparent text-zinc-400 border-white/15 hover:border-white/40 hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Qty */}
        <div>
          <p className="text-white font-black text-xs tracking-widest mb-3">QUANTIDADE</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="w-10 h-10 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white/10 transition-colors font-black text-lg"
            >
              −
            </button>
            <span className="text-white font-black text-xl w-6 text-center">{qty}</span>
            <button
              onClick={() => setQty(q => Math.min(product.stock, q + 1))}
              className="w-10 h-10 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white/10 transition-colors font-black text-lg"
            >
              +
            </button>
            <span className="text-zinc-600 text-xs font-medium ml-2">{product.stock} disponíveis</span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-zinc-950 rounded-2xl p-5 border border-white/5">
          <p className="text-white font-black text-xs tracking-widest mb-3">DESCRIÇÃO</p>
          <p className="text-zinc-400 text-sm leading-relaxed">{product.description}</p>
        </div>

        {/* Badges */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <Shield size={16} />, label: '100% Original' },
            { icon: <Truck size={16} />, label: 'Entrega Segura' },
            { icon: <RefreshCw size={16} />, label: 'Troca Fácil' },
          ].map(b => (
            <div key={b.label} className="bg-zinc-950 rounded-2xl p-3 flex flex-col items-center gap-2 border border-white/5 text-center">
              <span className="text-zinc-400">{b.icon}</span>
              <span className="text-zinc-400 text-[10px] font-bold leading-tight">{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pb-8 pt-4 bg-gradient-to-t from-black via-black/95 to-transparent z-50">
        <div className="flex gap-3">
          <button
            onClick={handleFav}
            className="w-14 h-14 rounded-2xl border border-white/15 flex items-center justify-center flex-shrink-0 hover:bg-white/5 transition-colors"
          >
            <Heart
              size={20}
              className={`transition-all duration-300 ${fav ? 'fill-red-500 text-red-500' : 'text-white'}`}
            />
          </button>
          <RippleButton
            className="flex-1 bg-white text-black font-black py-4 rounded-2xl text-sm tracking-widest hover:bg-zinc-100 transition-colors"
            onClick={handleAddCart}
          >
            ADICIONAR — R${(product.price * qty).toLocaleString('pt-BR')}
          </RippleButton>
        </div>
      </div>
    </div>
  )
}
