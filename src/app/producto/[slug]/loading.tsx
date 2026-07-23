export default function ProductoLoading() {
  return (
    <main className="min-h-screen pb-24">
      <div className="h-20 border-b border-white/10" />

      <div className="max-w-7xl mx-auto px-4 pt-32 pb-24">
        {/* Breadcrumb skeleton */}
        <div className="h-4 w-48 bg-white/5 animate-pulse mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image skeleton */}
          <div className="aspect-square bg-white/5 animate-pulse" />

          {/* Info skeleton */}
          <div className="space-y-6">
            <div className="h-6 w-24 bg-white/5 animate-pulse" />
            <div className="h-12 w-3/4 bg-white/5 animate-pulse" />
            <div className="h-8 w-32 bg-white/5 animate-pulse" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-white/5 animate-pulse" />
              <div className="h-4 w-full bg-white/5 animate-pulse" />
              <div className="h-4 w-2/3 bg-white/5 animate-pulse" />
            </div>
            <div className="h-14 w-full bg-white/5 animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
}
