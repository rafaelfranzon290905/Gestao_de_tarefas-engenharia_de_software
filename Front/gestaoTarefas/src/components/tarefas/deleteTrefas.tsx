import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface DeleteTaskDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  taskId: number
  taskTitulo: string
}

export function DeleteTaskDialog({
  isOpen,
  onClose,
  onSuccess,
  taskId,
  taskTitulo,
}: DeleteTaskDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "DELETE",
      })

      const json = await response.json()

      if (response.ok && !json.error) {
        toast.success(`Tarefa "${taskTitulo}" removida com sucesso!`)
        onClose()
        onSuccess()
      } else {
        toast.error(json.message || "Erro ao excluir a tarefa.")
      }
    } catch (error) {
      console.error("Erro na requisição de exclusão:", error)
      toast.error("Não foi possível conectar ao servidor.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" /> Excluir Tarefa
          </DialogTitle>
          <DialogDescription className="pt-2">
            Tem certeza que deseja remover a tarefa{" "}
            <strong className="text-foreground font-semibold">"{taskTitulo}"</strong>? 
            Esta ação removerá permanentemente o registro do banco de dados.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button variant="ghost" onClick={onClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Removendo...
              </>
            ) : (
              "Sim, excluir tarefa"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}