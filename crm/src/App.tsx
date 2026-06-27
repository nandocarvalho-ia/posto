import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import Dashboard from '@/pages/Dashboard'
import Atendimentos from '@/pages/Atendimentos'
import Kanban from '@/pages/Kanban'
import Precos from '@/pages/Precos'
import Autorizados from '@/pages/Autorizados'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/atendimentos" element={<Atendimentos />} />
        <Route path="/atendimentos/:telefone" element={<Atendimentos />} />
        <Route path="/kanban" element={<Kanban />} />
        <Route path="/precos" element={<Precos />} />
        <Route path="/autorizados" element={<Autorizados />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
