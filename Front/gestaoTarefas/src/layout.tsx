import { AppSidebar } from "./components/app-sidebar"
import { Outlet } from "react-router-dom"

export function Layout() {
  return (
    <div className="h-screen bg-background p-4 flex gap-4">
      <AppSidebar />
      <div className="flex-1">
        <main className="h-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
