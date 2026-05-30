export default function Skeleton({ className = '' }) {
  return (
    <div
      className={`skeleton rounded-xl ${className}`}
    />
  )
}

export function SkeletonProductCard() {
  return (
    <div className="flex-shrink-0 w-52 space-y-3">
      <Skeleton className="w-full aspect-square rounded-2xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-9 w-full rounded-xl" />
    </div>
  )
}

export function SkeletonGrid({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 gap-4 px-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square rounded-2xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-9 rounded-xl" />
        </div>
      ))}
    </div>
  )
}
