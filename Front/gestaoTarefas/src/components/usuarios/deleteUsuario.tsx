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

interface DeleteUserDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  usuarioId: number
  usuarioNome: string
}

export function DeleteUserDialog({
  isOpen,
  onClose,
  onSuccess,
  usuarioId,
  usuarioNome,
}: DeleteUserDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`http://localhost:3000/usuarios/${usuarioId}`, {
        method: "DELETE",
      })

      const json = await response.json()

      if (response.ok && !json.error) {
        toast.success(`Usuário "${usuarioNome}" excluído com sucesso!`)
        onClose()
        onSuccess() // Redireciona ou atualiza a lista externa
      } else {
        toast.error(json.message || "Erro ao excluir o usuário.")
      }
    } catch (error) {
      console.error("Erro na requisição de exclusão:", error)
      toast.error("Erro interno ao tentar conectar com o servidor.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" /> Excluir Usuário
          </DialogTitle>
          <DialogDescription className="pt-2 text-sm">
            Tem certeza absoluta que deseja excluir o usuário{" "}
            <strong className="text-foreground font-semibold">"{usuarioNome}"</strong>? 
            Esta ação não poderá ser desfeita e removerá o acesso dele ao sistema.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isDeleting}
          >
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
                <Loader2 className="h-4 w-4 animate-spin" /> Excluindo...
              </>
            ) : (
              "Sim, excluir usuário"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}