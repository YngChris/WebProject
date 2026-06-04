import { useState } from "react"
import { supabase } from "../supabaseClient"
import { Link, useNavigate } from "react-router-dom"

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "", confirm: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async () => {
    setError("")

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      return setError("Please fill in all fields.")
    }
    if (formData.password !== formData.confirm) {
      return setError("Passwords do not match.")
    }
    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters.")
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.name,
          phone: formData.phone,
        }
      }
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      navigate("/login?registered=true")
    }
  }

  return (
    <div className="bg-black min-h-screen flex justify-center items-center px-6 py-16">
      <div className="border border-gray-800 rounded-lg p-10 w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="font-elegant text-3xl text-gold mb-2">LuxeNails</h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase">Create Account</p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-400 text-sm px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {[
            { label: "Full Name", key: "name", type: "text", placeholder: "Ama Owusu" },
            { label: "Email Address", key: "email", type: "email", placeholder: "ama@example.com" },
            { label: "Phone Number", key: "phone", type: "tel", placeholder: "+233 XX XXX XXXX" },
            { label: "Password", key: "password", type: "password", placeholder: "••••••••" },
            { label: "Confirm Password", key: "confirm", type: "password", placeholder: "••••••••" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="text-gold text-sm tracking-widest uppercase block mb-1">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                value={formData[key]}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded px-4 py-3 focus:outline-none focus:border-gold transition"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full mt-6 bg-gold text-black py-3 rounded tracking-widest uppercase text-sm hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-gold hover:underline">Login</Link>
        </p>

      </div>
    </div>
  )
}