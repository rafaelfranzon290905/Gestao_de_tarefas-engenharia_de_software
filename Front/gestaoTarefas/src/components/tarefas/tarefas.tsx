"use client"
import { useCallback, useEffect, useState } from "react"
import { DataTable } from "../data-table"
import { PageHeader } from "../page-header"
import { AddTarefaModal } from "./addTarefaModal"
import { Loader2 } from "lucide-react"
import { type ColumnDef } from "@tanstack/react-table"
import { columns } from "./columns"

export function TarefasPage() {
  const [data, setData] = useState<any[]>([])
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [usuarioFiltrado, setUsuarioFiltrado] = useState<string>("")

  // Busca os usuários para alimentar os selects (Filtro e Modal)
  const fetchUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:3000/usuarios")
      if (response.ok) {
        const result = await response.json()
        setUsuarios(Array.isArray(result.data) ? result.data : [])
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error)
    }
  }

  // Busca as tarefas aplicando o filtro de usuário se houver
  const fetchTarefas = useCallback(async () => {
    setLoading(true)
    try {
      const url = usuarioFiltrado 
        ? `http://localhost:3000/tasks?usuarioId=${usuarioFiltrado}`
        : "http://localhost:3000/tasks"

      const response = await fetch(url)
      if (response.ok) {
        const result = await response.json()
        setData(Array.isArray(result.data) ? result.data : [])
      }
    } catch (error) {
      console.error("Erro na conexão:", error)
    } finally {
      setLoading(false)
    }
  }, [usuarioFiltrado])

  useEffect(() => {
    fetchUsuarios()
  }, [])

  useEffect(() => {
    fetchTarefas()
  }, [fetchTarefas])


  return (
    <>
      <PageHeader
        title="Gestão de Tarefas"
        subtitle="Gerenciamento e atribuição de atividades."
        buttons={<AddTarefaModal usuarios={usuarios} onSuccess={fetchTarefas} />}
      />
      
      <main className="flex-1 p-6 bg-slate-50 min-h-screen">
        {/* Barra de Filtro por Usuário */}
        <div className="flex items-center gap-3 py-4">
          <select
            value={usuarioFiltrado}
            onChange={(e) => setUsuarioFiltrado(e.target.value)}
            className="flex h-10 w-72 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Todos os Responsáveis</option>
            {usuarios.map((user) => (
              <option key={user.id} value={user.id}>
                {user.nome}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-2">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <p className="animate-pulse text-sm text-muted-foreground">Carregando Tarefas...</p>
          </div>
        ) : (
          <DataTable
            columns={columns()}
            data={data}
            filterColumn={["titulo", "descricao"]}
            filterPlaceholder="Buscar por título ou descrição..."
          />
        )}
      </main>
    </>
  )
}