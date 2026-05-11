import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Calorie Tracker</h1>
        <p className="text-sm text-muted-foreground">Registra tu nutrición y actividad física</p>
      </div>
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  )
}
