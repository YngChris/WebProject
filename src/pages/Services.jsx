import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { supabase } from "../supabaseClient"
import { FadeIn, StaggerContainer, StaggerItem } from "../components/animations/AnimateIn"
import { formatPrice } from "../utils/formatPrice"
import PageShell from "../components/PageShell"

export default function Services() {
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
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
      <PageShell variant="services" theme="light" className="min-h-screen flex items-center justify-center">
        <FadeIn>
          <p className="text-gray-400">Loading services...</p>
        </FadeIn>
      </PageShell>
    )
  }

  return (
    <PageShell variant="services" theme="light" className="min-h-screen">

      <FadeIn className="text-center py-16 px-6">
        <p className="text-gold tracking-[0.3em] text-sm uppercase mb-2">What We Offer</p>
        <h1 className="font-elegant text-4xl md:text-5xl text-black">Our Services</h1>
        <div className="w-16 h-0.5 bg-gold mx-auto mt-4"></div>
      </FadeIn>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" stagger={0.1}>
          {services.map((service) => (
            <StaggerItem key={service.id}>
            <div
              onClick={() => setSelectedService(service)}
              className="rounded-lg overflow-hidden shadow hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white/90 backdrop-blur-sm"
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
                <h3 className="font-elegant text-xl text-black mb-1 group-hover:text-gold transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-xs mb-2">{service.duration}</p>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                  {service.description}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-gold font-semibold text-lg">{formatPrice(service.price)}</p>
                  <span className="text-xs tracking-widest uppercase border border-gold text-gold px-3 py-1 rounded hover:bg-gold hover:text-black transition">
                    View
                  </span>
                </div>
              </div>
            </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      <AnimatePresence>
      {selectedService && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center px-4"
          onClick={() => setSelectedService(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="h-64 overflow-hidden relative">
              <img
                src={selectedService.image}
                alt={selectedService.title}
                className="w-full h-full object-cover"
              />
              {/* Close button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-3 right-3 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black transition"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="font-elegant text-2xl text-black">{selectedService.title}</h2>
                  <p className="text-gray-400 text-sm">{selectedService.duration}</p>
                </div>
                <span className="text-gold font-semibold text-xl">{formatPrice(selectedService.price)}</span>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {selectedService.fullDescription}
              </p>

              {/* Includes */}
              <div className="mb-6">
                <p className="text-gold text-xs tracking-widest uppercase mb-2">Includes</p>
                <ul className="grid grid-cols-2 gap-1">
                  {selectedService.includes.map((item, i) => (
                    <li key={i} className="text-gray-500 text-sm flex items-center gap-1">
                      <span className="text-gold text-xs">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Book Button */}
              <Link
                to={`/booking?service=${encodeURIComponent(selectedService.title)}`}
                className="block text-center bg-gold text-black py-3 rounded tracking-widest uppercase text-sm hover:opacity-90 transition"
                onClick={() => setSelectedService(null)}
              >
                Book This Service
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

    </PageShell>
  )
}