export function LoadingSpinner({ size = "default" }: { size?: "small" | "default" | "large" }) {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-8 h-8",
    large: "w-16 h-16",
  }

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-300 border-t-[#C62828]`} />
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="border-2 border-gray-200 rounded-lg overflow-hidden animate-pulse">
      <div className="w-full h-64 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
        <div className="h-10 bg-gray-200 rounded w-full" />
      </div>
    </div>
  )
}
