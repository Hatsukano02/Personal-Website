'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/api/queryClient'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* React Query Devtools 需要单独安装，暂时移除 */}
    </QueryClientProvider>
  )
}