import { useState, useEffect } from "react"


// Aqui vamos chamar nosso localStorage para dar oi ao usuário sempre que ele entrar na aplicação
const nomeDeUsuario = "Bianca"

// Criamos uma interface para o TypeScript saber o que existe em um usuário
interface InterfaceUsuario {
  id: string
  nome: string
  email: string
}

export function Dashboard() {
  const [usuario, setUsuario] = useState<InterfaceUsuario[] | null>(null)

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
    <div className="bg-blue-800">
      <p className="text-white">Bem vindo(a), {nomeDeUsuario}!</p>
      {usuario && usuario.map((user) => (
        <p key={user.id} className="text-white">{user.nome} - {user.email}</p>
      ))}
    </div>
  )
}
