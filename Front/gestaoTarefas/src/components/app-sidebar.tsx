import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {
  Clock,
  Rocket,
  ListChecks,
  UserCog2,
  Building2,
  Search,
  CheckSquare,
  X,
  Users,
  FileText,
  DollarSign,
} from "lucide-react"

import { Link, useLocation } from "react-router-dom"

const navItems = [
  { id: 1, icon: Rocket, path: "/dashboard", label: "Dashboard" },
  { id: 2, icon: ListChecks, path: "/tarefas", label: "Tarefas" },
  { id: 3, icon: Users, path: "/usuarios", label: "Usuarios" },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <div className="h-full rounded-2xl shadow-lg bg-sidebar border border-sidebar-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="space-y-4 px-6 py-6 pb-4 border-b">
        {/* Logo Section */}
        <div className="flex items-center gap-1">
          <CheckSquare className="w-6 h-6 text-blue-600" />
          <div className="flex flex-col">
            <h1 className="font-bold text-md">Gestão de tarefas</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="py-0">
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Navegação
          </div>
          <div className="mt-3">
            <div className="space-y-1.5">
              {navItems.map((menu) => {
                const isActive = location.pathname === menu.path
                const Icon = menu.icon

                return (
                  <Link
                    key={menu.id}
                    to={menu.path}
                    className={`
                      flex items-center gap-3 h-8 px-4 rounded-full transition-all duration-200
                      ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/95 hover:text-sidebar-foreground"
                      }
                    `}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="font-medium text-sm">{menu.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
