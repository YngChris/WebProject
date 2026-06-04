import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
  }, [])

  return (
    <nav className="bg-black text-white px-8 py-4 flex justify-between items-center">
      <Link to="/">
        <h1 className="text-2xl text-gold tracking-widest font-elegant">LuxeNails</h1>
      </Link>

      {/* Desktop Links */}
      <ul className="hidden md:flex gap-8 text-sm items-center">
        {["Home", "Services", "Gallery"].map(page => (
          <li key={page}>
            <Link to={page === "Home" ? "/" : `/${page.toLowerCase()}`}
              className="hover:text-gold transition-colors">
              {page}
            </Link>
          </li>
        ))}
        {user ? (
          <li>
            <Link to="/account" className="hover:text-gold transition-colors">My Account</Link>
          </li>
        ) : (
          <li>
            <Link to="/login" className="hover:text-gold transition-colors">Login</Link>
          </li>
        )}
        <li>
          <Link to="/booking" className="bg-gold text-black px-4 py-2 rounded hover:opacity-90 transition">
            Book Now
          </Link>
        </li>
      </ul>

      {/* Mobile Toggle */}
      <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      {menuOpen && (
        <ul className="absolute top-16 left-0 w-full bg-black flex flex-col items-center gap-4 py-6 text-sm z-50">
          {["Home", "Services", "Gallery"].map(page => (
            <li key={page}>
              <Link to={page === "Home" ? "/" : `/${page.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="hover:text-gold">
                {page}
              </Link>
            </li>
          ))}
          <li>
            <Link to={user ? "/account" : "/login"}
              onClick={() => setMenuOpen(false)}
              className="hover:text-gold">
              {user ? "My Account" : "Login"}
            </Link>
          </li>
          <li>
            <Link to="/booking" onClick={() => setMenuOpen(false)}
              className="bg-gold text-black px-4 py-2 rounded">
              Book Now
            </Link>
          </li>
        </ul>
      )}
    </nav>
  )
}