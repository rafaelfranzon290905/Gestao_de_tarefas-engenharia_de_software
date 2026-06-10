import { type ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { ChevronRight } from "lucide-react"

export const columns = (): ColumnDef<any>[] => {
  const cols: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <span>#{row.original.id}</span>,
    },
    {
      accessorKey: "tarefa",
      header: "Tarefa",
      cell: ({ row }) => <span className="font-medium">{row.original.titulo}</span>,
    },
    { 
      accessorKey: "descricao", 
      header: "descricao" 
    },
    {
      accessorKey: "createdAt",
      header: "Cadastrado em",
      cell: ({ row }) => {
        const data = new Date(row.original.createdAt)
        return <span>{data.toLocaleDateString("pt-BR")}</span>
      },
    },
    {
      accessorKey: "Status",
      header: "Status",
      cell: ({ row }) => {
        return row.original.status
      }
    },
    {
      accessorKey: "Responsavel",
      header: "Responsável",
      cell: ({ row }) => <span>{row.original.usuario.nome}</span>,
    },
  ]
  return cols
}