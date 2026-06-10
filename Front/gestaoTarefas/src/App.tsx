import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Dashboard } from "./components/dashboard/Dashboard"
import { Login } from "./components/login/login"
import { AppSidebar } from "./components/app-sidebar"
import { Layout } from "./layout"

function App() {

  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
