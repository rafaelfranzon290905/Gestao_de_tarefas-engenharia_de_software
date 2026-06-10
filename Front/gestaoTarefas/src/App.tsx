import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Dashboard } from "./components/dashboard/Dashboard"
import { Login } from "./components/login/login"
import { AppSidebar } from "./components/app-sidebar"
import { Layout } from "./layout"
import { UsersPage } from "./components/usuarios/usuarios"
import { TarefasPage } from "./components/tarefas/tarefas"
import { UserDetail } from "./components/usuarios/usuarioDetails"

function App() {

  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/usuarios" element={<UsersPage />}/>
          <Route path="/usuarios/:id" element={<UserDetail />}/>
          <Route path="/tarefas" element={<TarefasPage />}/>
          
        
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
