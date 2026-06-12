import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { supabase } from "../supabaseClient"
import { FadeIn, StaggerContainer, StaggerItem } from "../components/animations/AnimateIn"
import PageShell from "../components/PageShell"

const adminEmail = import.meta.env.VITE_ADMIN_EMAIL

const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const navigate = useNavigate()

  const fetchBookings = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error) setBookings(data)
    setLoading(false)
  }

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== adminEmail) {
        navigate("/admin")
      } else {
        fetchBookings()
      }
    }
    checkAdmin()
  }, [])

  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id)

    if (!error) fetchBookings()
  }

  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return
    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id)

    if (!error) fetchBookings()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem("isAdmin")
    navigate("/admin")
  }

  const filtered = filter === "all"
    ? bookings
    : bookings.filter(b => b.status === filter)

  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    completed: bookings.filter(b => b.status === "completed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
  }

  return (
    <PageShell variant="admin-dashboard" theme="dark" className="min-h-screen text-white">

      {/* Top Bar */}
      <div className="bg-black/70 backdrop-blur-md border-b border-gold/15 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="font-elegant text-2xl text-gold">PinkStudio Admin</h1>
          <button
            onClick={() => navigate("/admin/settings")}
            className="text-gray-400 text-sm hover:text-gold transition"
          >
            Settings
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="text-gray-400 text-sm hover:text-gold transition"
        >
          Logout
        </button>
      </div>

      <div className="px-6 py-8 max-w-7xl mx-auto">

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" stagger={0.08}>
          {[
            { label: "Total Bookings", value: counts.all, color: "text-white" },
            { label: "Pending", value: counts.pending, color: "text-yellow-400" },
            { label: "Confirmed", value: counts.confirmed, color: "text-green-400" },
            { label: "Completed", value: counts.completed, color: "text-blue-400" },
          ].map((stat, i) => (
            <StaggerItem key={i}>
              <div className="bg-black/55 backdrop-blur-sm border border-gold/15 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "pending", "confirmed", "completed", "cancelled"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded text-sm capitalize border transition
                ${filter === f
                  ? "bg-gold text-black border-gold"
                  : "border-gray-700 text-gray-400 hover:border-gold"}`}
            >
              {f} ({counts[f] ?? 0})
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-gray-400 py-20"
          >
            Loading bookings...
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-gray-400 py-20"
          >
            No bookings found.
          </motion.div>
        ) : (
          <FadeIn key="table" className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-left">
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Service</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Time</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((booking, i) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
                    className="border-b border-gray-800/50 hover:bg-gray-900/50 transition"
                  >
                    <td className="py-4 pr-4">
                      <p className="text-white font-medium">{booking.name}</p>
                      <p className="text-gray-400 text-xs">{booking.email}</p>
                      <p className="text-gray-400 text-xs">{booking.phone}</p>
                    </td>
                    <td className="py-4 pr-4 text-gray-300">{booking.service}</td>
                    <td className="py-4 pr-4 text-gray-300">{booking.date}</td>
                    <td className="py-4 pr-4 text-gray-300">{booking.time}</td>
                    <td className="py-4 pr-4">
                      <span className={`px-3 py-1 rounded-full text-xs border capitalize ${statusColors[booking.status]}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2 flex-wrap">
                        {booking.status !== "confirmed" && (
                          <button
                            onClick={() => updateStatus(booking.id, "confirmed")}
                            className="px-3 py-1 bg-green-900/30 border border-green-500/30 text-green-400 rounded text-xs hover:bg-green-900/60 transition"
                          >
                            Confirm
                          </button>
                        )}
                        {booking.status !== "completed" && (
                          <button
                            onClick={() => updateStatus(booking.id, "completed")}
                            className="px-3 py-1 bg-blue-900/30 border border-blue-500/30 text-blue-400 rounded text-xs hover:bg-blue-900/60 transition"
                          >
                            Complete
                          </button>
                        )}
                        {booking.status !== "cancelled" && (
                          <button
                            onClick={() => updateStatus(booking.id, "cancelled")}
                            className="px-3 py-1 bg-yellow-900/30 border border-yellow-500/30 text-yellow-400 rounded text-xs hover:bg-yellow-900/60 transition"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() => deleteBooking(booking.id)}
                          className="px-3 py-1 bg-red-900/30 border border-red-500/30 text-red-400 rounded text-xs hover:bg-red-900/60 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </FadeIn>
        )}
        </AnimatePresence>
      </div>
    </PageShell>
  )
}