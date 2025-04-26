// src/app/clients/loading.tsx
export default function ClientsLoading() {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="h-10 w-48 bg-gray-700/50 rounded animate-pulse"></div>
          <div className="h-10 w-36 bg-amber-500/30 rounded animate-pulse"></div>
        </div>
  
        <div className="mb-6">
          <div className="h-12 w-full bg-gray-700/50 rounded animate-pulse mb-4"></div>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="card h-64 animate-pulse">
              <div className="flex items-start mb-4">
                <div className="h-16 w-16 bg-amber-500/30 rounded-full mr-3"></div>
                <div className="flex-1">
                  <div className="h-6 w-3/4 bg-amber-500/30 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-700/50 rounded"></div>
                </div>
              </div>
              <div className="mt-auto flex justify-end">
                <div className="h-9 w-28 bg-gray-700/50 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }