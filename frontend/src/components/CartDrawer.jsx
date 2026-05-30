import { X, Trash2, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCartStore, useUIStore } from '../store'
import RippleButton from './RippleButton'

export default function CartDrawer({ onCheckout }) {
  const { cartOpen, closeCart } = useUIStore()
  const { items, removeItem, updateQty } = useCartStore()

  const total = items.reduce((acc, i) => acc + i.price * i.qty, 0)
  const count = items.reduce((acc, i) => acc + i.qty, 0)

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/80 z-[60] transition-opacity duration-300 ${
          cartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-zinc-950 z-[70] flex flex-col transition-transform duration-300 ease-out border-l border-white/5 ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-white" />
            <span className="text-white font-black text-base tracking-wider">CARRINHO</span>
            {count > 0 && (
              <span className="bg-white text-black text-[11px] font-black px-2 py-0.5 rounded-full">
                {count}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white transition-colors rounded-xl hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 pb-10">
              <div className="w-20 h-20 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center">
                <ShoppingBag size={32} className="text-zinc-600" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-white font-bold text-base">Carrinho vazio</p>
                <p className="text-zinc-500 text-sm">Adicione produtos incríveis</p>
              </div>
              <RippleButton
                className="bg-white text-black font-black px-6 py-3 rounded-2xl text-sm"
                onClick={closeCart}
              >
                CONTINUAR COMPRANDO
              </RippleButton>
            </div>
          ) : (
            items.map((item) => (
              <CartItem
                key={item.key}
                item={item}
                onRemove={() => removeItem(item.key)}
                onQty={(q) => updateQty(item.key, q)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-5 border-t border-white/10 space-y-4 bg-zinc-950">
            {/* Subtotal */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400 font-medium">Subtotal</span>
                <span className="text-white font-bold">
                  R${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400 font-medium">Frete</span>
                <span className="text-green-400 font-bold text-xs">Calculado no checkout</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t border-white/10">
              <span className="text-white font-black text-sm">TOTAL</span>
              <span className="text-white font-black text-2xl">
                R${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <RippleButton
              className="w-full bg-white text-black font-black py-4 rounded-2xl text-sm tracking-widest hover:bg-zinc-100 transition-colors"
              onClick={() => { closeCart(); onCheckout?.() }}
            >
              FINALIZAR COMPRA →
            </RippleButton>

            <p className="text-center text-zinc-600 text-[11px]">
              🔒 Compra 100% segura · Mercado Pago
            </p>
          </div>
        )}
      </aside>
    </>
  )
}

function CartItem({ item, onRemove, onQty }) {
  return (
    <div className="flex gap-3 bg-zinc-900 rounded-2xl p-4 border border-white/5">
      {/* Image */}
      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-2xl flex-shrink-0`}>
        {item.emoji}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-white font-bold text-[13px] leading-tight line-clamp-2">{item.name}</p>
        <div className="flex gap-2 text-[11px] text-zinc-500 font-medium">
          {item.size && item.size !== 'U' && <span>Tam: {item.size}</span>}
          {item.colorName && <span>Cor: {item.colorName}</span>}
        </div>
        <p className="text-white font-black text-sm">
          R${item.price.toLocaleString('pt-BR')}
        </p>

        {/* Qty + Remove */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onQty(item.qty - 1)}
            className="w-7 h-7 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <Minus size={12} />
          </button>
          <span className="text-white font-bold text-sm w-5 text-center">{item.qty}</span>
          <button
            onClick={() => onQty(item.qty + 1)}
            className="w-7 h-7 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <Plus size={12} />
          </button>
          <button
            onClick={onRemove}
            className="ml-auto text-zinc-600 hover:text-red-500 transition-colors p-1"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
