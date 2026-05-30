export default function Logo({ size = 'md' }) {
  const sizes = {
    sm: 'text-[10px]',
    md: 'text-[11px]',
    lg: 'text-sm',
  }

  return (
    <div className={`flex flex-col items-center leading-tight select-none no-select ${sizes[size]}`}>
      <span className="text-white font-black tracking-[0.25em]">QUEBRADA</span>
      <span className="text-white font-black tracking-[0.35em]">STORE</span>
    </div>
  )
}
