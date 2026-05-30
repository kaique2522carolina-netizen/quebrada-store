import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import Skeleton, { SkeletonProductCard } from '../components/Skeleton'
import RippleButton from '../components/RippleButton'
import { PRODUCTS, CATEGORIES, BANNERS } from '../data/products'
import { useCartStore } from '../store'

export default function HomePage({ onOpenProduct, onNavigate, toast }) {
  const [loading, setLoading] = useState(true)
  const [bannerIndex, setBannerIndex] = useState(0)
  const addItem = useCartStore(s => s.addItem)
  const intervalRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400)
    intervalRef.current = setInterval(() => {
      setBannerIndex(i => (i + 1) % BANNERS.length)
    }, 4500)
    return () => { clearTimeout(t); clearInterval(intervalRef.current) }
  }, [])

  const handleAddCart = (product) => {
    addItem(product, product.sizes[0], product.colorNames?.[0])
    toast(`${product.name} adicionado! 🛒`, 'success')
  }

  const sections = [
    { title: 'MAIS VENDIDOS', products: PRODUCTS.slice(0, 5) },
    { title: 'CAMISETAS / POLOS', slug: 'camisetas', products: PRODUCTS.filter(p => p.category === 'camisetas') },
    { title: 'BONÉS', slug: 'bones', products: PRODUCTS.filter(p => p.category === 'bones') },
    { title: 'TÊNIS', slug: 'tenis', products: PRODUCTS.filter(p => p.category === 'tenis') },
    { title: 'ACESSÓRIOS', slug: 'acessorios', products: PRODUCTS.filter(p => p.category === 'acessorios') },
  ]

  if (loading) {
    return (
      <div className="pt-20 pb-32 space-y-8 animate-fade-in">
        <div className="px-4">
          <Skeleton className="w-full h-52 rounded-3xl" />
        </div>
        <div className="overflow-hidden px-4">
          <div className="flex gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="w-16 h-16 rounded-full flex-shrink-0" />
            ))}
          </div>
        </div>
        <div className="space-y-4 px-4">
          <Skeleton className="h-5 w-40 rounded-lg" />
          <div className="flex gap-4">
            {[1, 2, 3].map(i => <SkeletonProductCard key={i} />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 pb-32 page-enter">
      {/* Banner Carousel */}
      <div className="px-4 mb-8">
        <div
          className={`relative w-full h-56 rounded-3xl bg-gradient-to-br overflow-hidden border border-white/5 cursor-pointer`}
          style={{ background: `linear-gradient(135deg, ${getBannerColors(bannerIndex)})` }}
          onClick={() => onNavigate('categories', BANNERS[bannerIndex].ctaSlug)}
        >
          {/* BG Emoji */}
          <span className="absolute right-4 top-4 text-[7rem] opacity-20 select-none pointer-events-none transition-all duration-500">
            {BANNERS[bannerIndex].emoji}
          </span>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <p className="text-zinc-400 text-xs font-bold tracking-widest mb-2 uppercase">
              {BANNERS[bannerIndex].subtitle}
            </p>
            <h2 className="text-white font-black text-4xl tracking-tight leading-none mb-4">
              {BANNERS[bannerIndex].title}
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-white font-black text-xs tracking-widest border border-white/30 px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-200">
                {BANNERS[bannerIndex].cta}
              </span>
              <ArrowRight size={16} className="text-white opacity-60" />
            </div>
          </div>

          {/* Dots */}
          <div className="absolute bottom-4 right-6 flex gap-1.5">
            {BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setBannerIndex(i) }}
                className={`h-1.5 rounded-full transition-all duration-300 ${bannerIndex === i ? 'w-6 bg-white' : 'w-1.5 bg-white/30'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-10">
        <div className="flex items-center justify-between px-4 mb-5">
          <span className="text-white font-black text-sm tracking-widest">CATEGORIAS</span>
          <button
            onClick={() => onNavigate('categories')}
            className="text-zinc-500 text-xs font-bold hover:text-white transition-colors flex items-center gap-1"
          >
            VER TUDO <ArrowRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto px-4 scrollbar-hide">
          <div className="flex gap-4 w-max pb-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => onNavigate('categories', cat.slug)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-16 h-16 rounded-full border-2 border-white/10 bg-zinc-900 flex items-center justify-center text-2xl group-hover:border-white/30 group-active:scale-95 transition-all duration-200">
                  {cat.emoji}
                </div>
                <span className="text-zinc-500 text-[10px] font-bold group-hover:text-white transition-colors">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Sections */}
      {sections.map(({ title, slug, products }) => (
        products.length > 0 && (
          <div key={title} className="mb-10">
            <div className="flex items-center justify-between px-4 mb-5">
              <span className="text-white font-black text-sm tracking-widest">{title}</span>
              {slug && (
                <button
                  onClick={() => onNavigate('categories', slug)}
                  className="text-zinc-500 text-xs font-bold hover:text-white transition-colors flex items-center gap-1"
                >
                  VER TUDO <ArrowRight size={12} />
                </button>
              )}
            </div>
            <div className="overflow-x-auto px-4 scrollbar-hide">
              <div className="flex gap-4 w-max pb-2">
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddCart={handleAddCart}
                    onOpen={onOpenProduct}
                  />
                ))}
              </div>
            </div>
          </div>
        )
      ))}

      {/* Trust Banner */}
      <div className="mx-4 mb-8 rounded-3xl border border-white/5 bg-zinc-950 p-6">
        <p className="text-white font-black text-xl mb-1 leading-tight">
          TRABALHAMOS<br />APENAS COM<br />ORIGINAIS 🔒
        </p>
        <p className="text-zinc-400 text-sm leading-relaxed mt-3">
          Todos os produtos com tag e nota fiscal. Entrega segura e rastreada para todo o Brasil.
        </p>
        <div className="flex gap-5 mt-5">
          {[
            { icon: '✓', label: '100% Original' },
            { icon: '🚚', label: 'Entrega Rápida' },
            { icon: '💬', label: 'WhatsApp' },
            { icon: '🔒', label: 'Seguro' },
          ].map(item => (
            <div key={item.label} className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-base">
                {item.icon}
              </div>
              <span className="text-zinc-500 text-[10px] text-center font-bold leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="mx-4 rounded-3xl bg-zinc-950 border border-white/5 p-6 text-center mb-8">
        <h3 className="text-white font-black text-xl mb-1">NEWSLETTER</h3>
        <p className="text-zinc-400 text-sm mb-5 leading-relaxed">
          Quer receber nossas ofertas? Cadastre-se e comece a recebê-las!
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
            placeholder="E-mail"
          />
          <RippleButton
            className="bg-white text-black font-black px-5 py-3 rounded-xl text-sm tracking-widest"
            onClick={() => toast('Inscrito com sucesso! 🎉', 'success')}
          >
            ENVIAR
          </RippleButton>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-white/10 text-center">
        <p className="text-white font-black text-base tracking-widest mb-1">QUEBRADA STORE</p>
        <p className="text-zinc-600 text-xs mb-4">© 2026 · Todos os direitos reservados</p>
        <div className="flex justify-center gap-3 mb-4">
          {['DEPARTAMENTOS', 'ENTRE EM CONTATO', 'TROCAS & DEVOLUÇÕES'].map(item => (
            <button key={item} className="text-zinc-600 text-[10px] font-bold hover:text-zinc-400 transition-colors">
              {item}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-zinc-700 text-[11px]">criado com</span>
          <span className="text-zinc-600 text-[11px] font-bold">nuvemshop</span>
        </div>
        <div className="flex justify-center mt-4">
          <a href="#" className="w-9 h-9 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center hover:bg-zinc-800 transition-colors">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </div>
      </footer>
    </div>
  )
}

function getBannerColors(index) {
  const palettes = [
    '#141414, #1a1a1a',
    '#0a0a1a, #0d1117',
    '#1a0505, #0d0005',
  ]
  return palettes[index] || palettes[0]
}
