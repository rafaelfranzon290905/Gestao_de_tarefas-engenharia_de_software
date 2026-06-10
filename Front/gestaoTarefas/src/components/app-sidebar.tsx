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
  LogOut,
  FileText,
  DollarSign,
} from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"

import { Link, useLocation, useNavigate } from "react-router-dom"

const navItems = [
  { id: 1, icon: Rocket, path: "/dashboard", label: "Dashboard" },
  { id: 2, icon: ListChecks, path: "/tarefas", label: "Tarefas" },
  { id: 3, icon: Users, path: "/usuarios", label: "Usuarios" },
]

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    
    try {
      await fetch("http://localhost:3000/auth/logout", { 
        method: "POST" 
      })
    } catch (error) {
      console.error("Erro ao avisar o servidor do logout:", error)
    } finally {
      // Apaga os dados do usuário e o token do navegador de forma limpa
      localStorage.clear()
      sessionStorage.clear()

      toast.success("Sessão encerrada com sucesso!")
      
      // Redireciona para a página de login substituindo o histórico
      navigate("/login", { replace: true })
      setIsLoggingOut(false)
    }
  }


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
                          ? "bg-blue-600 text-primary-foreground shadow-sm font-semibold"
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
      {/* Footer - Botão de Logout Fixo Embaixo */}
      <div className="p-4 border-t border-sidebar-border bg-sidebar-muted/20">
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full flex items-center justify-start gap-3 h-9 px-4 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-all duration-200"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span className="font-medium text-sm">Sair da Conta</span>
        </Button>
      </div>
    </div>
  )
}
