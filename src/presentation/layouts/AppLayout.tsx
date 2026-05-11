import { Outlet } from 'react-router-dom'
import { BottomNav } from '@/presentation/components/BottomNav'

export function AppLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <main className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
