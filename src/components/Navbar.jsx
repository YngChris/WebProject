import { Link } from "react-router-dom"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-black text-white px-8 py-4 flex justify-between items-center relative"
    >
      <Link to="/">
        <h1 className="text-2xl text-gold tracking-widest font-elegant">PinkStudio</h1>
      </Link>

      <ul className="hidden md:flex gap-8 text-sm items-center">
        {["Home", "Services", "Gallery"].map(page => (
          <li key={page}>
            <Link to={page === "Home" ? "/" : `/${page.toLowerCase()}`}
              className="hover:text-gold transition-colors">
              {page}
            </Link>
          </li>
        ))}
        <li>
          <Link to="/services" className="bg-gold text-black px-4 py-2 rounded hover:opacity-90 transition">
            Book Now
          </Link>
        </li>
      </ul>

      <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>☰</button>

      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-0 w-full bg-black flex flex-col items-center gap-4 py-6 text-sm z-50 overflow-hidden"
          >
            {["Home", "Services", "Gallery"].map((page, i) => (
              <motion.li
                key={page}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={page === "Home" ? "/" : `/${page.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-gold">
                  {page}
                </Link>
              </motion.li>
            ))}
            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Link to="/services" onClick={() => setMenuOpen(false)}
                className="bg-gold text-black px-4 py-2 rounded">
                Book Now
              </Link>
            </motion.li>
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
