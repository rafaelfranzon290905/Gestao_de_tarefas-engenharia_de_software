import { useState, useEffect } from "react"
import { PageHeader } from "../page-header"
import { Bar, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface MetricData {
  porStatus: { pendente: number; em_andamento: number; concluida: number }
  porUsuario: Array<{ nome: string; totalTarefas: number }>
  tarefasRecentes: Array<{ id: number; titulo: string; status: string; createdAt: string }>
  insights: { totalGeral: number; taxaConclusaoGeral: string }
}

export function Dashboard() {
  const [metrics, setMetrics] = useState<MetricData | null>(null)
  const [loading, setLoading] = useState(true)
  // Aqui vamos chamar nosso localStorage para dar oi ao usuário sempre que ele entrar na aplicação
  const usuario = localStorage.getItem("currentUser")
  const usuarioDados = JSON.parse(usuario)
  console.log(usuarioDados.id)

  // const loadData = async () => {
  //   const response = await fetch("http://localhost:3000/usuarios")

  //   if (response.ok) {
  //     const json = await response.json()
  //     console.log(json)
  //     setUsuario(json.data)
  //   }
  // }

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Passa o ID do usuário logado na query string para o seu novo endpoint
        const response = await fetch(`http://localhost:3000/dashboard?usuarioId=${usuarioDados.id}`)
        const json = await response.json()
        
        if (!json.error) {
          setMetrics(json.data)
        }
      } catch (error) {
        console.error("Erro ao carregar métricas:", error)
      } finally {
        setLoading(false)
      }
    }

    if (usuarioDados.id) {
      fetchDashboardData()
    }
  }, [usuarioDados.id])

  if (loading) {
    return <div className="p-8 text-center text-white">Carregando painel de controle...</div>
  }

  // Configuração do Gráfico de Barras (Carga de Trabalho da Equipe)
  const userChartData = {
    labels: metrics?.porUsuario.map(u => u.nome) || [],
    datasets: [
      {
        label: "Total de Tarefas",
        data: metrics?.porUsuario.map(u => u.totalTarefas) || [],
        borderWidth: 1,
        backgroundColor: "#4169E1",
        borderColor: "#52525b",
        borderRadius: 4,
      },
    ],
  }


  return (
    <>
      <PageHeader
              title={`Bem vindo(a), ${usuarioDados.nome}`}
              subtitle="Informações Recentes do usuário."
            />
      {/* Gráficos fodas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl shadow-md">
            <p className="text-sm text-zinc-400 font-medium">Suas Tarefas Ativas</p>
            <p className="text-3xl font-bold mt-2 text-blue-500">{metrics?.insights.totalGeral}</p>
          </div>

          <div className="p-5 rounded-xl shadow-md">
            <p className="text-sm text-zinc-400 font-medium">Taxa de Conclusão</p>
            <p className="text-3xl font-bold mt-2 text-green-500">{metrics?.insights.taxaConclusaoGeral || "0%"}</p>
          </div>

          <div className="p-5 rounded-xl shadow-md">
            <p className="text-sm text-zinc-400 font-medium">Tarefas Pendentes</p>
            <p className="text-3xl font-bold mt-2 text-red-500">{metrics?.porStatus.pendente}</p>
          </div>
        </div>

        {/* --- SEÇÃO DE GRÁFICOS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Gráfico 2: Carga de trabalho do time */}
          <div className="p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Volume de Tarefas por Integrante</h3>
            <div className="h-64">
              <Bar 
                data={userChartData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  scales: { y: { ticks: { stepSize: 1 } } } 
                }} 
              />
            </div>
          </div>


        {/* --- FEED: 3 TAREFAS MAIS RECENTES --- */}
        <div className=" p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Suas Atividades Mais Recentes</h3>
          <div className="space-y-3">
            {metrics?.tarefasRecentes && metrics.tarefasRecentes.length > 0 ? (
              metrics.tarefasRecentes.map(tarefa => (
                <div 
                  key={tarefa.id} 
                  className="shadow flex items-center justify-between p-4 rounded-lg transition-all"
                >
                  <div>
                    <h4 className="font-medium">{tarefa.titulo}</h4>
                    <p className="text-xs text-zinc-500 mt-1">
                      Criada em: {new Date(tarefa.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase
                    ${tarefa.status?.toLowerCase() === "concluido" ? "bg-green-500/10 text-green-400 border border-green-500/20" : ""}
                    ${tarefa.status?.toLowerCase() === "em_andamento" || tarefa.status?.toLowerCase() === "em andamento" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" : ""}
                    ${tarefa.status?.toLowerCase() === "pendente" ? "bg-red-500/10 text-red-400 border border-red-500/20" : ""}
                  `}>
                    {tarefa.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500 py-2">Você ainda não possui nenhuma tarefa criada.</p>
            )}
          </div>
        </div>
        </div>


      
    </>
  )
}
