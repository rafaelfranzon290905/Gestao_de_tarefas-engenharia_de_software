import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/forms"
import { toast } from "sonner"
import { Plus, Loader2 } from "lucide-react"


type TarefaFormValues = {
  titulo: string
  descricao: string
  status: string
  deUsuario: string
}

interface AddTarefaModalProps {
  usuarios: any[]
  onSuccess: () => void
}

export function AddTarefaModal({ usuarios, onSuccess }: AddTarefaModalProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const form = useForm<TarefaFormValues>({
    defaultValues: {
      titulo: "",
      descricao: "",
      status: "pending",
      deUsuario: "none",
    },
  })

  useEffect(() => {
    if (!open) {
      form.reset()
      setApiError(null)
    }
  }, [open, form])

  const handleSave = async (values: TarefaFormValues) => {
    setIsSubmitting(true)
    setApiError(null)

    const payload = {
    ...values,
    deUsuario: (values.deUsuario === "none" || values.deUsuario === "") 
      ? null 
      : Number(values.deUsuario)
  }

    try {
      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const resultado = await response.json()

      if (!response.ok || resultado.error) {
        setApiError(resultado.message || "Erro ao salvar tarefa")
        return
      }

      toast.success("Nova tarefa criada com sucesso!")
      setOpen(false)
      form.reset()
      onSuccess()
    } catch (error) {
      toast.error("Falha na conexão com o servidor")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4" /> Adicionar Tarefa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Nova Tarefa</DialogTitle>
          <DialogDescription>Cadastre uma nova atividade no sistema.</DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="titulo"
              rules={{ required: "Título é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Ajustar deploy" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao"
              rules={{ required: "Descrição é obrigatória" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Detalhes da tarefa..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Select de Usuários vindo das propriedades */}
            <FormField
              control={form.control}
              name="deUsuario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Selecione um responsável" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Deixar sem responsável</SelectItem>
                      {usuarios.map((user) => (
                        <SelectItem key={user.id} value={String(user.id)}>
                          {user.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {apiError && <p className="text-xs font-medium text-red-500 mt-1">{apiError}</p>}
          </form>
        </Form>
        
        <DialogFooter>
          <Button
            onClick={form.handleSubmit(handleSave)}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar Tarefa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}