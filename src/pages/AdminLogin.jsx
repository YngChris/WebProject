import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setError("")
    if (!email || !password) return setError("Please fill in all fields.")

    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError("Invalid email or password.")
      return
    }

    // Check if the logged in user is the admin
    const adminEmail = "chriiisybumpkin@gmail.com" // change to client's email
    if (data.user.email !== adminEmail) {
      await supabase.auth.signOut()
      setError("You are not authorized to access this page.")
      return
    }

    navigate("/admin/dashboard")
  }

  return (
    <div className="bg-black min-h-screen flex justify-center items-center px-6">
      <div className="border border-gray-800 rounded-lg p-10 w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="font-elegant text-3xl text-gold mb-2">PinkStudio</h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase">Admin Portal</p>
        </div>

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
              placeholder="admin@luxenails.com"
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

      </div>
    </div>
  )
}