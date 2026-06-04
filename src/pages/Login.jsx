import { useState } from "react"
import { supabase } from "../supabaseClient"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const justRegistered = searchParams.get("registered")

  const handleLogin = async () => {
    setError("")
    if (!email || !password) return setError("Please fill in all fields.")

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      navigate("/account")
    }
  }

  return (
    <div className="bg-black min-h-screen flex justify-center items-center px-6">
      <div className="border border-gray-800 rounded-lg p-10 w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="font-elegant text-3xl text-gold mb-2">LuxeNails</h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase">Welcome Back</p>
        </div>

        {justRegistered && (
          <div className="bg-green-900/30 border border-green-500 text-green-400 text-sm px-4 py-3 rounded mb-6">
            Account created! Please check your email to confirm, then log in.
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-400 text-sm px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-gold text-sm tracking-widest uppercase block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ama@example.com"
              className="w-full bg-gray-900 border border-gray-700 text-white rounded px-4 py-3 focus:outline-none focus:border-gold transition"
            />
          </div>
          <div>
            <label className="text-gold text-sm tracking-widest uppercase block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-900 border border-gray-700 text-white rounded px-4 py-3 focus:outline-none focus:border-gold transition"
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-6 bg-gold text-black py-3 rounded tracking-widest uppercase text-sm hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-gold hover:underline">Register</Link>
        </p>

      </div>
    </div>
  )
}