import { useEffect, useState } from "react"
import { supabase } from "../supabaseclient"

import { useNavigate } from "react-router-dom"

export default function Account() {
  const [user, setUser] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchMyBookings = async (email) => {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false })

    setBookings(data || [])
    setLoading(false)
  }

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate("/login")
      } else {
        setUser(user)
        fetchMyBookings(user.email)
      }
    }
    getUser()
  }, [])


  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  }

  const statusColors = {
    pending: "text-yellow-400",
    confirmed: "text-green-400",
    completed: "text-blue-400",
    cancelled: "text-red-400",
  }

  return (
    <div className="bg-black min-h-screen text-white py-16 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="font-elegant text-3xl text-gold">My Account</h1>
            <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="border border-gray-700 text-gray-400 px-4 py-2 rounded text-sm hover:border-gold hover:text-gold transition"
          >
            Logout
          </button>
        </div>

        {/* Welcome */}
        <div className="border border-gold/30 rounded-lg p-6 mb-8 bg-gold/5">
          <p className="text-gold text-sm tracking-widest uppercase mb-1">Welcome</p>
          <p className="text-white font-elegant text-2xl">
            {user?.user_metadata?.full_name || "Valued Customer"}
          </p>
        </div>

        {/* My Bookings */}
        <h2 className="font-elegant text-2xl text-white mb-4">My Bookings</h2>

        {loading ? (
          <p className="text-gray-400">Loading your bookings...</p>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 border border-gray-800 rounded-lg">
            <p className="text-gray-400 mb-4">You have no bookings yet.</p>
            <a href="/booking" className="bg-gold text-black px-6 py-2 rounded text-sm tracking-widest uppercase hover:opacity-90 transition">
              Book Now
            </a>


          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="border border-gray-800 rounded-lg p-6 hover:border-gold/30 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-elegant text-lg mb-1">{booking.service}</h3>
                    <p className="text-gray-400 text-sm">{booking.date} at {booking.time}</p>
                    {booking.notes && <p className="text-gray-500 text-xs mt-1">Note: {booking.notes}</p>}
                  </div>
                  <span className={`text-sm capitalize font-medium ${statusColors[booking.status]}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}