import { useState, useEffect } from "react"
import { PageHeader } from "../page-header"


// Criamos uma interface para o TypeScript saber o que existe em um usuário
interface InterfaceUsuario {
  id: string
  nome: string
  email: string
}

export function Dashboard() {
  const [usuarios, setUsuarios] = useState<InterfaceUsuario[] | null>(null)
  const [usuarioLogado, setUsuarioLogado] = useState<InterfaceUsuario | null>(null)

  // Aqui vamos chamar nosso localStorage para dar oi ao usuário sempre que ele entrar na aplicação
  const usuario = localStorage.getItem("currentUser")
  const usuarioDados = JSON.parse(usuario)

  const loadData = async () => {
    const response = await fetch("http://localhost:3000/usuarios")

    if (response.ok) {
      const json = await response.json()
      console.log(json)
      setUsuario(json.data)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <>
      <PageHeader
              title={`Bem vindo(a), ${usuarioDados.nome}`}
              subtitle="Informações Recentes do usuário."
            />
      <p className="text-white">Bem vindo(a), {usuarioDados.nome}!</p>
      
    </>
  )
}
