import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { apiFetch } from "@/lib/utils"
import { Loader2, CheckSquare } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

type LoginFormValues = {
  email: string
  senha:  string
}

export function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      senha: "",
    },
  })

  // Executa o logout automaticamente ao entrar na página para limpar sessões antigas
  useEffect(() => {
    const runLogout = async () => {
      await apiFetch("/auth/logout", { method: "POST" })
    }
    runLogout()
  }, [])

  const handleSubmit = async (values: LoginFormValues) => {
    setIsLoading(true)

    // Ajustado para bater exatamente com a rota do Gestor de Tarefas (/auth/login)
    const response = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: values.email,
        senha: values.senha,
      }),
    })

    if (!response.error) {
      // Salva os dados básicos do usuário no LocalStorage se o login for bem-sucedido
      localStorage.setItem("currentUser", JSON.stringify(response.data))
      
      toast.success(response.message || "Bem-vindo de volta!")
      
      // Redireciona para o dashboard ou raiz da aplicação
      navigate("/", { replace: true })
    } else {
      toast.error(response.message || "Erro ao realizar login.")
    }
    setIsLoading(false)
  }

  return (
    <div
      className="flex h-screen items-center justify-center bg-slate-100"
      style={{
        backgroundImage: "linear-gradient(135deg, #f8fafc 20%, #cbd5e1 70%)",
      }}
    >
      <Card className="w-full max-w-sm rounded-xl bg-white/95 p-6 shadow-xl border border-slate-200">
        <CardHeader className="flex flex-col items-center space-y-3 pb-4">
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">TaskManager</h1>
          </div>
          <CardTitle className="text-center text-md text-gray-500 font-normal">
            Entre com suas credenciais para gerenciar suas tarefas
          </CardTitle>
        </CardHeader>
        
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="email"
              rules={{ 
                required: "Por favor, preencha o e-mail.",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Insira um endereço de e-mail válido."
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">
                    E-mail
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      className="border-slate-300 focus:ring-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="senha"
              rules={{ required: "Por favor, preencha a senha." }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">
                    Senha
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="border-slate-300 focus:ring-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  )
}