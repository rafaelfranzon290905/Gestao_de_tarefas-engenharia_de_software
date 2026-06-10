import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { PageHeader } from "../page-header"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Tabs, TabsContent } from "../ui/tabs"
import { Empty } from "../ui/empty"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

import {
  Edit2,
  Save,
  Trash2,
  Loader2,
  FileText,
  User,
  CheckCircle2,
} from "lucide-react"
import { toast } from "sonner"
import { DeleteTaskDialog } from "./deleteTrefas"

interface UserMin {
  id: number
  nome: string
  email: string
}

interface TaskData {
  id: number
  titulo: string
  descricao: string
  status: string
  deUsuario: number | null
  usuario: UserMin | null
}

export function TaskDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("detalhe")
  
  const [tarefa, setTarefa] = useState<TaskData | null>(null)
  const [usuariosLista, setUsuariosLista] = useState<UserMin[]>([])

  const tabsConfig = [
    { name: "detalhe", icon: FileText },
  ]

  // Carrega os detalhes da tarefa e a lista de usuários para o Select
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      // 1. Busca detalhes da tarefa
      const resTask = await fetch(`http://localhost:3000/tasks/${id}`)
      // 2. Busca lista de usuários cadastrados para alimentar o Select de responsável
      const resUsers = await fetch(`http://localhost:3000/usuarios`)

      if (resTask.ok && resUsers.ok) {
        const jsonTask = await resTask.json()
        const jsonUsers = await resUsers.json()
        
        setTarefa(jsonTask.data)
        setUsuariosLista(jsonUsers.data || [])
      } else {
        toast.error("Erro ao carregar dados do servidor.")
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

  const handleSave = async () => {
    if (!tarefa?.titulo || !tarefa?.descricao) {
      toast.error("Título e Descrição são obrigatórios.")
      return
    }

    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: tarefa.titulo,
          descricao: tarefa.descricao,
          status: tarefa.status,
          deUsuario: tarefa.deUsuario ? Number(tarefa.deUsuario) : null,
        }),
      })

      const json = await response.json()

      if (response.ok && !json.error) {
        toast.success("Tarefa atualizada com sucesso!")
        setTarefa(json.data) // Atualiza o estado com o retorno populado do back-end
        setIsEditing(false)
      } else {
        toast.error(json.message || "Erro ao salvar alterações.")
      }
    } catch (err) {
      console.error("Erro na requisição:", err)
      toast.error("Erro interno ao tentar salvar.")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!tarefa) {
    return <Empty message="Tarefa não encontrada." />
  }

  return (
    <>
      <PageHeader
        title={tarefa.titulo}
        subtitle={
          <span className="text-muted-foreground flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Status: {tarefa.status || "Pendente"}
          </span>
        }
        tabs={tabsConfig}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        buttons={
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <Button onClick={() => setIsEditing(true)} className="gap-2">
                  <Edit2 className="h-4 w-4" /> Editar
                </Button>
                
              </>
            ) : (
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white gap-2">
                <Save className="h-4 w-4" /> Salvar
              </Button>
            )}
            <Button variant="destructive" onClick={() => setIsDeleteOpen(true)} className="gap-2">
              <Trash2 className="h-4 w-4" /> Excluir
            </Button>
          </div>
        }
      />

      <main className="flex-1 p-6">
        <Tabs value={activeTab}>
          <TabsContent value="detalhe" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Informações da Atividade</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                
                {/* Título da Tarefa */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-400">Título</label>
                  <Input
                    disabled={!isEditing}
                    value={tarefa.titulo}
                    onChange={(e) => setTarefa({ ...tarefa, titulo: e.target.value })}
                    className={!isEditing ? "bg-secondary/40 border-transparent text-foreground opacity-90 cursor-not-allowed" : ""}
                  />
                </div>

                {/* Descrição da Tarefa */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-400">Descrição</label>
                  <Textarea
                    disabled={!isEditing}
                    value={tarefa.descricao}
                    onChange={(e) => setTarefa({ ...tarefa, descricao: e.target.value })}
                    className={!isEditing ? "bg-secondary/40 border-transparent text-foreground opacity-90 cursor-not-allowed" : ""}
                  />
                </div>

                {/* Seleção do Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Status do Andamento</label>
                  <Select
                    disabled={!isEditing}
                    value={tarefa.status}
                    onValueChange={(value) => setTarefa({ ...tarefa, status: value })}
                  >
                    <SelectTrigger className={!isEditing ? "w-full bg-secondary/40 border-transparent text-foreground opacity-90 cursor-not-allowed" : "w-full"}>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                      <SelectItem value="Concluido">Concluido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Seleção de Usuário Responsável */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">
                    Colaborador Responsável
                  </label>
                  <Select
                    disabled={!isEditing}
                    value={tarefa.deUsuario?.toString() || "sem_usuario"}
                    onValueChange={(value) => setTarefa({ 
                      ...tarefa, 
                      deUsuario: value === "sem_usuario" ? null : Number(value) 
                    })}
                  >
                    <SelectTrigger className={!isEditing ? "w-full bg-secondary/40 border-transparent text-foreground opacity-90 cursor-not-allowed" : "w-full"}>
                      <SelectValue placeholder="Selecione um responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sem_usuario">Nenhum responsável</SelectItem>
                      {usuariosLista.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <DeleteTaskDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        taskId={tarefa.id}
        taskTitulo={tarefa.titulo}
        onSuccess={() => navigate("/tarefas")} // Redireciona para a tabela geral de tarefas após exclusão
      />
    </>
  )
}