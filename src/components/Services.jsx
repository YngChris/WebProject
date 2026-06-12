import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import { formatPrice } from "../utils/formatPrice"

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: true })
      
      if (!error && data) {
        setServices(data)
      }
      setLoading(false)
    }
    fetchServices()
  }, [])

  if (loading) {
    return (
      <section className="bg-white py-20 px-6">
        <div className="text-center">
          <p className="text-gray-400">Loading services...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white py-20 px-6">

      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-gold tracking-[0.3em] text-sm uppercase mb-2">
          What We Offer
        </p>
        <h2 className="font-elegant text-4xl md:text-5xl text-black">
          Our Services
        </h2>
        <div className="w-16 h-0.5 bg-gold mx-auto mt-4"></div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-8x2 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="rounded-lg overflow-hidden shadow hover:shadow-xl transition-all duration-300 group"
          >
            {/* Image */}
            <div className="overflow-hidden h-52">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Text */}
            <div className="p-6 border border-gray-100 border-t-0">
              <h3 className="font-elegant text-xl text-black mb-2 group-hover:text-gold transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                {service.description}
              </p>
              <p className="text-gold font-semibold text-lg">{formatPrice(service.price)}</p>
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}