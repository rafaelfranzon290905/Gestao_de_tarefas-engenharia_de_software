"use client"
import { useCallback, useEffect, useState } from "react"
import { DataTable } from "../data-table"
import { PageHeader } from "../page-header"
import { columns } from "./columns"
import { AddUserModal } from "./addUsuarioModal"
import { Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function UsersPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:3000/usuarios")
      
      if (!response.ok) {
        console.error("Erro ao buscar usuários:", response.status)
        setData([])
        return
      }

      const result = await response.json()
      // Mapeia o array que vem dentro de .data da sua API
      setData(Array.isArray(result.data) ? result.data : [])
    } catch (error) {
      console.error("Erro na conexão:", error)
      setData([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <>
      <PageHeader
        title="Gestão de Usuários"
        subtitle="Visualização e cadastro de usuários do sistema."
        buttons={<AddUserModal onSuccess={fetchData} />}
      />
      <main className="flex-1 p-6 min-h-screen">
        {loading ? (
          <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-2">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <p className="animate-pulse text-sm text-muted-foreground">
              Carregando Usuários...
            </p>
          </div>
        ) : (
          <DataTable
            columns={columns()}
            data={data}
            clickable
            onRowClick={(row) => navigate(`/usuarios/${row.id}`)}
            filterColumn={["nome", "email"]}
            filterPlaceholder="Buscar por nome ou e-mail..."
          />
        )}
      </main>
    </>
  )
}