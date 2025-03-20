import { Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Pricing from "./pages/Pricing"
import LogIn from "./pages/LogIn"
import Signup from "./pages/Signup"
import Layout from "./components/Layout"
import ProtectedRoutes from "./components/ProtectedRoutes"


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        } />
        <Route path="/pricing" element={
          <Layout>
            <Pricing />
          </Layout>} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
