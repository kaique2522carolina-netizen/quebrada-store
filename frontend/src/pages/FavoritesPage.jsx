import { Heart } from 'lucide-react'
import { PRODUCTS } from '../data/products'
import { useFavoritesStore, useCartStore } from '../store'
import RippleButton from '../components/RippleButton'

export default function FavoritesPage({ onOpenProduct, toast }) {
  const { ids, toggle } = useFavoritesStore()
  const addItem = useCartStore(s => s.addItem)
  const favorites = PRODUCTS.filter(p => ids.includes(p.id))

  const handleAddCart = (product) => {
    addItem(product, product.sizes[0], product.colorNames?.[0])
    toast(`${product.name} adicionado! 🛒`, 'success')
  }

  return (
    <div className="min-h-screen bg-black pt-20 pb-32 px-4 page-enter">
      <div className="flex items-center justify-between mb-8 mt-2">
        <div>
          <h2 className="text-white font-black text-2xl tracking-wider">FAVORITOS</h2>
          <p className="text-zinc-500 text-xs font-medium mt-1">
            {favorites.length} produto{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Heart
          size={22}
          className={`transition-all duration-300 ${favorites.length > 0 ? 'fill-red-500 text-red-500' : 'text-zinc-600'}`}
        />
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
          <div className="w-24 h-24 rounded-full bg-zinc-950 border border-white/5 flex items-center justify-center">
            <Heart size={36} className="text-zinc-700" />
          </div>
          <div className="space-y-2">
            <p className="text-white font-bold text-lg">Nenhum favorito ainda</p>
            <p className="text-zinc-500 text-sm">Toque no ❤️ para salvar seus produtos favoritos</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {favorites.map(product => (
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
                <button
                  onClick={e => {
                    e.stopPropagation()
                    toggle(product.id)
                    toast('Removido dos favoritos', 'info')
                  }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all active:scale-90"
                >
                  <Heart size={13} className="fill-red-500 text-red-500" />
                </button>
              </div>
              <div className="cursor-pointer" onClick={() => onOpenProduct(product)}>
                <p className="text-white font-bold text-[12px] leading-tight line-clamp-2">{product.name}</p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-white font-black text-sm">R${product.price.toLocaleString('pt-BR')}</span>
                  <span className="text-zinc-600 text-[10px] line-through">R${product.originalPrice.toLocaleString('pt-BR')}</span>
                </div>
                {product.freeShipping && <p className="text-green-400 text-[10px] font-bold">🚚 Frete grátis</p>}
              </div>
              <RippleButton
                className="w-full bg-white text-black text-[10px] font-black py-2.5 rounded-xl tracking-widest"
                onClick={() => handleAddCart(product)}
              >
                ADICIONAR
              </RippleButton>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
