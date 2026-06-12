import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

import Navbar from "./components/Navbar"
import PageTransition from "./components/animations/PageTransition"

import Home from "./pages/Home"
import Booking from "./pages/Booking"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"
import AdminSettings from "./pages/AdminSettings"
import Services from "./pages/Services"
import Gallery from "./components/Gallery"

function ProtectedRoute({ children }) {
  const isAdmin = localStorage.getItem("isAdmin") === "true"

  if (!isAdmin) {
    return <Navigate to="/admin" replace />
  }

  return children
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* Public Routes */}
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/booking" element={<PageTransition><Booking /></PageTransition>} />
        <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
        <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />

        {/* Admin Login (public) */}
        <Route path="/admin" element={<PageTransition><AdminLogin /></PageTransition>} />

        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard"element={<ProtectedRoute><PageTransition><AdminDashboard /></PageTransition></ProtectedRoute>}/>
        <Route path="/admin/settings"element={<ProtectedRoute><PageTransition><AdminSettings /></PageTransition></ProtectedRoute>}/>

      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AnimatedRoutes />
    </BrowserRouter>
  )
}