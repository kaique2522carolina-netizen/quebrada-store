export default function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="toast-in pointer-events-auto"
          onClick={() => onRemove?.(toast.id)}
        >
          <div
            className={`
              flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold
              shadow-2xl shadow-black/50 backdrop-blur-sm border
              ${toast.type === 'success' ? 'bg-white text-black border-white/20' : ''}
              ${toast.type === 'error' ? 'bg-red-600 text-white border-red-500/30' : ''}
              ${toast.type === 'heart' ? 'bg-red-600 text-white border-red-500/30' : ''}
              ${toast.type === 'info' ? 'bg-zinc-900 text-white border-white/10' : ''}
            `}
          >
            {toast.type === 'success' && <span>✓</span>}
            {toast.type === 'heart' && <span>❤️</span>}
            {toast.type === 'error' && <span>✕</span>}
            {toast.type === 'info' && <span>ℹ</span>}
            <span>{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
