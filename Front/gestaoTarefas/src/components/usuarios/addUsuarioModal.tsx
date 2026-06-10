import { useEffect, useState } from "react"
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

type UserFormValues = {
  nome: string
  email: string
  senha: string
}

export function AddUserModal({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const form = useForm<UserFormValues>({
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
    },
  })

  useEffect(() => {
    if (!open) {
      form.reset()
      setApiError(null)
      form.clearErrors()
    }
  }, [open, form])

  const handleSave = async (values: UserFormValues) => {
    setIsSubmitting(true)
    setApiError(null)

    try {
      const response = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const resultado = await response.json()

      if (!response.ok || resultado.error) {
        setApiError(resultado.message || "Erro ao salvar usuário")
        return
      }

      toast.success("Novo usuário cadastrado com sucesso!")
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
          <Plus className="h-4 w-4" /> Adicionar Usuário
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[400px]"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
          <DialogDescription>
            Crie um novo usuário com senha criptografada para testar o login.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="nome"
              rules={{
                required: "Nome é obrigatório",
                minLength: { value: 3, message: "Mínimo de 3 caracteres" }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "E-mail é obrigatório",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "E-mail inválido" }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="nome@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="senha"
              rules={{
                required: "Senha obrigatória",
                minLength: { value: 6, message: "A senha deve ter no mínimo 6 caracteres" }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {apiError && (
              <p className="text-xs font-medium text-red-500 mt-1">{apiError}</p>
            )}
          </form>
        </Form>
        
        <DialogFooter>
          <Button
            onClick={form.handleSubmit(handleSave)}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cadastrar e Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}