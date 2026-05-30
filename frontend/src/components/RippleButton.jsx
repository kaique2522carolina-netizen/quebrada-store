import { useRef } from 'react'

export default function RippleButton({ children, onClick, className = '', disabled = false, type = 'button' }) {
  const btnRef = useRef(null)

  const handleClick = (e) => {
    if (disabled) return
    const btn = btnRef.current
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ripple = document.createElement('span')
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.25);
      width: 0; height: 0;
      left: ${x}px; top: ${y}px;
      transform: translate(-50%, -50%);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `
    btn.appendChild(ripple)
    setTimeout(() => ripple.remove(), 600)
    onClick && onClick(e)
  }

  return (
    <button
      ref={btnRef}
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`relative overflow-hidden transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  )
}
