import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import DoodleWallpaper from "./DoodleWallpaper"

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false })

      if (!error && data) setTestimonials(data)
      setLoading(false)
    }
    fetchTestimonials()
  }, [])

  if (loading) return null

  if (testimonials.length === 0) return null

  return (
  <section className="relative py-20 px-6 overflow-hidden">
    <DoodleWallpaper variant="testimonials" theme="light" />

    <div className="relative z-10">
      <div className="text-center mb-14">
        <p className="text-gold tracking-[0.3em] text-sm uppercase mb-2">
          Happy Clients
        </p>
        <h2 className="font-elegant text-4xl md:text-5xl text-black">
          Testimonials
        </h2>
        <div className="w-16 h-0.5 bg-gold mx-auto mt-4"></div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="border border-gray-100 rounded-lg p-8 hover:shadow-lg transition-all duration-300 bg-white/80"
          >
            <div className="text-gold text-2xl mb-4">
              {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 italic">
              "{t.review}"
            </p>
            <p className="font-elegant text-black font-semibold">
              — {t.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
)
}