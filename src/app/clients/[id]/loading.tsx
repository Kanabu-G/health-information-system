// src/app/clients/[id]/loading.tsx
export default function ClientDetailLoading() {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="h-6 w-32 bg-amber-500/30 rounded animate-pulse"></div>
        </div>
  
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-start">
            <div className="flex items-start">
              <div className="h-20 w-20 bg-amber-500/30 rounded-full mr-6 animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-8 w-64 bg-amber-500/30 rounded animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="h-5 w-full bg-gray-700/50 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="h-10 w-20 bg-gray-700/50 rounded animate-pulse"></div>
              <div className="h-10 w-20 bg-gray-700/50 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
  
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="h-7 w-48 bg-amber-500/30 rounded animate-pulse"></div>
            <div className="h-10 w-36 bg-amber-500/30 rounded animate-pulse"></div>
          </div>
          
          <div className="bg-gray-800/30 border border-gray-700 rounded-lg overflow-hidden">
            <div className="p-4 animate-pulse">
              <div className="h-10 w-full bg-gray-700/50 rounded mb-4"></div>
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-16 w-full bg-gray-700/50 rounded mb-4"></div>
              ))}
            </div>
          </div>
        </div>
  
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <div className="h-7 w-48 bg-amber-500/30 rounded animate-pulse mb-4"></div>
          <div className="h-5 w-full bg-gray-700/50 rounded animate-pulse mb-4"></div>
          <div className="bg-gray-900 p-3 rounded-md">
            <div className="h-6 w-72 bg-amber-500/30 rounded animate-pulse"></div>
          </div>
          <div className="h-5 w-3/4 bg-gray-700/50 rounded animate-pulse mt-4"></div>
        </div>
      </div>
    );
  }