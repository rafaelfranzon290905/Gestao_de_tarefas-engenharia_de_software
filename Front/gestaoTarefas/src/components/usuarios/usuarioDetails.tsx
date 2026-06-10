import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { PageHeader } from "../page-header"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Tabs, TabsContent } from "../ui/tabs"
// import { Badge } from "../ui/badge"
import { Empty } from "../ui/empty"

import {
  Edit2,
  Save,
  ArrowLeft,
  Loader2,
  ListChecks,
  User,
  Mail,
  CalendarDays,
} from "lucide-react"
import { toast } from "sonner"

// Interface de definição com base no seu banco Prisma/Neon
interface Task {
  id: string
  titulo: string
  descricao: string
  status: "Pendente" | "Em_Andamento" | "Concluido"
  prioridade: "Baixa" | "Media" | "Alta"
}

interface UserProfile {
  id: number
  nome: string
  email: string
  createdAt: string
  tarefas?: Task[] // Array de tarefas que o usuário participa
}

export function UserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("detalhe")
  const [usuario, setUsuario] = useState<UserProfile | null>(null)

  // Abas simplificadas para o seu contexto de tarefas
  const tabsConfig = [
    { name: "detalhe", icon: User },
    { name: "tarefas", icon: ListChecks },
  ]

  // Carrega os dados do usuário e suas respectivas tarefas
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:3000/usuarios/${id}`)
      
      if (response.ok) {
        const json = await response.json()
        setUsuario(json.data)
      } else {
        toast.error("Erro ao carregar dados do usuário.")
      }
    } catch (error) {
      console.error("Erro na conexão:", error)
      toast.error("Não foi possível conectar ao servidor.")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Salva as alterações de Nome e Email
  const handleSave = async () => {
    if (!usuario?.nome || !usuario?.email) {
      toast.error("Nome e E-mail são obrigatórios.")
      return
    }

    try {
      const response = await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: usuario.nome,
          email: usuario.email,
        }),
      })

      const json = await response.json()

      if (response.ok && !json.error) {
        toast.success("Usuário atualizado com sucesso!")
        setIsEditing(false)
      } else {
        toast.error(json.message || "Erro ao salvar alterações.")
      }
    } catch (err) {
      console.error("Erro na requisição:", err)
      toast.error("Erro interno ao tentar salvar.")
    }
  }

  // Define a cor da badge de prioridade da tarefa
  // const getPriorityBadge = (prioridade: string) => {
  //   switch (prioridade) {
  //     case "Alta": return "bg-red-600 text-white border-none"
  //     case "Media": return "bg-amber-500 text-white border-none"
  //     default: return "bg-blue-500 text-white border-none"
  //   }
  // }

  // // Define a cor da badge de status da tarefa
  // const getStatusBadge = (status: string) => {
  //   switch (status) {
  //     case "Concluido": return "bg-green-600 text-white border-none"
  //     case "Em_Andamento": return "bg-sky-600 text-white border-none"
  //     default: return "bg-slate-500 text-white border-none"
  //   }
  // }

  if (loading) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!usuario) {
    return <Empty message="Usuário não encontrado." />
  }

  return (
    <>
      <PageHeader
        title={usuario.nome}
        subtitle={
          <span className="text-muted-foreground flex items-center gap-1">
            <Mail className="h-3.5 w-3.5" /> {usuario.email}
          </span>
        }
        tabs={tabsConfig}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        buttons={
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="gap-2 bg-blue-500">
                <Edit2 className="h-4 w-4" /> Editar
              </Button>
            ) : (
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white gap-2">
                <Save className="h-4 w-4" /> Salvar
              </Button>
            )
          }
          </div>

            // {/* <DeleteDialogGeral
            //   endpoint={`/usuarios/${id}`}
            //   nomeEntidade="Usuário"
            //   nomeObjeto={usuario.nome}
            //   cascata={true}
            //   onSuccess={() => navigate("/usuarios")}
            // /> */}
          // {/* // </div> */}
        }
      />

      <main className="flex-1 p-6">
        <Tabs value={activeTab}>
          
          {/* ABA 1: Dados do Usuário */}
          <TabsContent value="detalhe" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2 grid-cols-2
                ">
                  <label className="text-xs font-medium text-slate-400">Nome Completo</label>
                  <Input
                    disabled={!isEditing}
                    value={usuario.nome}
                    onChange={(e) => setUsuario({ ...usuario, nome: e.target.value })}
                    className={!isEditing ? "bg-secondary/40 border-transparent text-foreground opacity-90 cursor-not-allowed" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">Endereço de E-mail</label>
                  <Input
                    disabled={!isEditing}
                    value={usuario.email}
                    onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
                    className={!isEditing ? "bg-secondary/40 border-transparent text-foreground opacity-90 cursor-not-allowed" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
                    <CalendarDays className="h-3 w-3 text-slate-500" /> Data de Cadastro
                  </label>
                  <Input
                    disabled
                    value={
                      usuario.createdAt 
                        ? new Date(usuario.createdAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                        : "Data não disponível"
                    }
                    className="bg-secondary/40 border-transparent text-foreground opacity-90 cursor-not-allowed"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA 2: Lista de Tarefas Vinculadas */}
          <TabsContent value="tarefas" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Tarefas Designadas ({usuario.tarefas?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {usuario.tarefas && usuario.tarefas.length > 0 ? (
                  usuario.tarefas.map((tarefa) => (
                    <div
                      key={tarefa.id}
                      className="flex items-center justify-between rounded-xl border p-4 bg-card hover:bg-secondary/20 transition-all duration-200 shadow-sm"
                    >
                      <div className="flex flex-col gap-1 min-w-0 flex-1 pr-4">
                        <span className="font-semibold text-sm truncate text-foreground">
                          {tarefa.titulo}
                        </span>
                        <p className="text-xs text-muted-foreground truncate max-w-xl">
                          {tarefa.descricao || "Sem descrição informada."}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/tarefas/${tarefa.id}`)}
                          title="Abrir tarefa"
                        >
                          <ArrowLeft className="h-4 w-4 rotate-180" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 border border-dashed rounded-xl">
                    <ListChecks className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-muted-foreground">
                      Este usuário não está participando de nenhuma tarefa no momento.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>
    </>
  )
}