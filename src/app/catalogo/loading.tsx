export default function CatalogoLoading() {
  return (
    <main className="min-h-screen pb-24">
      {/* Navbar placeholder */}
      <div className="h-20 border-b border-white/10" />

      {/* Title skeleton */}
      <section className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="h-12 w-48 bg-white/5 animate-pulse" />
          <div className="h-4 w-24 bg-white/5 animate-pulse" />
        </div>
      </section>

      {/* Filter buttons skeleton */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-3 pb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-24 bg-white/5 animate-pulse rounded" />
          ))}
        </div>
      </section>

      {/* Product grid skeleton */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-square bg-white/5 animate-pulse" />
              <div className="h-3 w-16 bg-white/5 animate-pulse" />
              <div className="h-5 w-40 bg-white/5 animate-pulse" />
              <div className="h-4 w-24 bg-white/5 animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
