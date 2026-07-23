export default function CarritoLoading() {
  return (
    <main className="min-h-screen pb-24">
      <div className="h-20 border-b border-white/10" />

      <div className="max-w-7xl mx-auto px-4 pt-32 pb-24">
        {/* Title skeleton */}
        <div className="h-14 w-48 bg-white/5 animate-pulse mb-12" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Cart items skeleton */}
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-4 flex items-center gap-6">
                <div className="w-24 h-24 bg-white/10 animate-pulse flex-shrink-0" />
                <div className="flex-grow space-y-3">
                  <div className="h-3 w-16 bg-white/10 animate-pulse" />
                  <div className="h-5 w-40 bg-white/10 animate-pulse" />
                  <div className="h-4 w-24 bg-white/10 animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Form skeleton */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/5 border border-white/10 p-8 space-y-4">
              <div className="h-8 w-32 bg-white/10 animate-pulse mb-6" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 w-full bg-white/10 animate-pulse" />
              ))}
            </div>
            <div className="bg-white/5 border border-white/10 p-8 space-y-4">
              <div className="h-8 w-24 bg-white/10 animate-pulse mb-6" />
              <div className="h-16 w-full bg-white/10 animate-pulse" />
            </div>
            <div className="bg-white p-8 brutal-shadow space-y-4">
              <div className="h-8 w-24 bg-black/10 animate-pulse mb-8" />
              <div className="h-6 w-full bg-black/10 animate-pulse" />
              <div className="h-14 w-full bg-black/10 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
