import { useState, useCallback } from 'react'

// Pages
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CategoriesPage from './pages/CategoriesPage'
import FavoritesPage from './pages/FavoritesPage'
import CheckoutPage from './pages/CheckoutPage'

// Components
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import MenuDrawer from './components/MenuDrawer'
import CartDrawer from './components/CartDrawer'
import SearchOverlay from './components/SearchOverlay'
import WhatsAppButton from './components/WhatsAppButton'
import ToastContainer from './components/Toast'

// Hooks & store
import { useToast } from './hooks/useToast'
import { useUIStore } from './store'

export default function App() {
  const [page, setPage] = useState('home')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [categorySlug, setCategorySlug] = useState('camisetas')
  const [searchOpen, setSearchOpen] = useState(false)

  const { toasts, toast, removeToast } = useToast()
  const { cartOpen, openCart, closeCart } = useUIStore()

  // Navigation
  const navigate = useCallback((target, slug) => {
    setSelectedProduct(null)
    if (slug) setCategorySlug(slug)
    setPage(target)
  }, [])

  const openProduct = useCallback((product) => {
    setSelectedProduct(product)
  }, [])

  const goBack = useCallback(() => {
    setSelectedProduct(null)
  }, [])

  // Show product detail overlay
  if (selectedProduct) {
    return (
      <div className="max-w-lg mx-auto relative min-h-screen bg-black">
        <Header onSearch={() => setSearchOpen(true)} />
        <ProductPage
          product={selectedProduct}
          onBack={goBack}
          toast={toast}
        />
        <CartDrawer onCheckout={() => { navigate('checkout') }} />
        <WhatsAppButton />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <SearchOverlay
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          onOpenProduct={openProduct}
        />
      </div>
    )
  }

  // Checkout - full screen, no nav
  if (page === 'checkout') {
    return (
      <div className="max-w-lg mx-auto relative min-h-screen bg-black">
        <CheckoutPage
          onBack={() => navigate('home')}
          onSuccess={() => navigate('home')}
          toast={toast}
        />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto relative min-h-screen bg-black">
      {/* Header */}
      <Header onSearch={() => setSearchOpen(true)} />

      {/* Main Content */}
      <main>
        {page === 'home' && (
          <HomePage
            onOpenProduct={openProduct}
            onNavigate={navigate}
            toast={toast}
          />
        )}
        {page === 'categories' && (
          <CategoriesPage
            initialSlug={categorySlug}
            onOpenProduct={openProduct}
            toast={toast}
          />
        )}
        {page === 'favorites' && (
          <FavoritesPage
            onOpenProduct={openProduct}
            toast={toast}
          />
        )}
      </main>

      {/* Bottom Nav */}
      <BottomNav page={page} onNavigate={navigate} />

      {/* Drawers & Overlays */}
      <MenuDrawer onNavigate={navigate} />
      <CartDrawer onCheckout={() => navigate('checkout')} />
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onOpenProduct={openProduct}
      />

      {/* Floating */}
      <WhatsAppButton />

      {/* Toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
