import { useState } from "react"
import { Link } from "react-router-dom"

const services = [
  {
    title: "Classic Manicure",
    description: "A timeless treatment including shaping, cuticle care, and polish.",
    fullDescription: "Our Classic Manicure is the perfect way to maintain healthy, beautiful nails. The treatment includes nail shaping and filing, cuticle care and moisturizing, a relaxing hand massage, and your choice of polish color from our extensive collection. Ideal for those who love a clean, polished look.",
    duration: "45 mins",
    image: "https://pkbtkzzhnldtciedncna.supabase.co/storage/v1/object/public/service-page/WhatsApp%20Image%202026-06-04%20at%2011.19.10%20AM.jpeg",
    includes: ["Nail shaping & filing", "Cuticle care", "Hand massage", "Polish of choice"],
  },
  {
    title: "Gel Nails",
    description: "Long-lasting gel polish that stays flawless for up to 3 weeks.",
    fullDescription: "Our Gel Nails service uses premium gel polish that stays chip-free and glossy for up to 3 weeks. Perfect for busy people who want low-maintenance beautiful nails. The gel is cured under UV light for a hard, durable finish that won't smudge or fade.",
    duration: "60 mins",
    image: "https://pkbtkzzhnldtciedncna.supabase.co/storage/v1/object/public/service-page/WhatsApp%20Image%202026-06-04%20at%2011.19.13%20AM.jpeg",
    includes: ["Nail prep & shaping", "Base coat", "Gel color application", "UV curing", "Top coat"],
  },
  {
    title: "Acrylic Extensions",
    description: "Full set of acrylic nails customized to your desired length and shape.",
    fullDescription: "Transform your nails with our Acrylic Extensions service. We apply a full set of acrylic nails customized to your desired length, shape, and style. Whether you want coffin, stiletto, almond, or square — we've got you covered. Great for adding strength and length to natural nails.",
    duration: "90 mins",
    image: "https://pkbtkzzhnldtciedncna.supabase.co/storage/v1/object/public/service-page/WhatsApp%20Image%202026-06-04%20at%2011.19.14%20AM.jpeg",
    includes: ["Nail prep", "Acrylic application", "Shaping & filing", "Polish or gel finish", "Cuticle care"],
  },
  {
    title: "Nail Art",
    description: "Creative designs, patterns, and embellishments for a unique look.",
    fullDescription: "Express your personality with our custom Nail Art service. From minimalist designs to bold statement nails, our skilled technicians bring your vision to life. We offer freehand art, stamping patterns, gradient/ombre effects, gems, and embellishments.",
    duration: "30 mins+",
    image: "https://pkbtkzzhnldtciedncna.supabase.co/storage/v1/object/public/service-page/WhatsApp%20Image%202026-06-04%20at%2011.19.83%20AM.jpeg",
    includes: ["Custom designs", "Freehand art", "Gems & embellishments", "Stamping patterns", "Gradient/ombre"],
  },
  {
    title: "Pedicure",
    description: "Relaxing foot soak, exfoliation, shaping, and polish application.",
    fullDescription: "Treat your feet to our luxurious Pedicure service. We begin with a relaxing warm foot soak, followed by exfoliation to remove dead skin, nail shaping, cuticle care, and a moisturizing massage. Finished with your choice of polish for perfectly pampered feet.",
    duration: "60 mins",
    image: "https://pkbtkzzhnldtciedncna.supabase.co/storage/v1/object/public/service-page/WhatsApp%20Image%202026-06-04%20at%2011.39.14%20AM.jpeg",
    includes: ["Foot soak", "Exfoliation scrub", "Nail shaping", "Cuticle care", "Polish of choice"],
  },
  {
    title: "Spa Package",
    description: "Full mani-pedi combo with scrub, massage, and premium polish.",
    fullDescription: "The ultimate luxury nail experience. Our Spa Package combines a full manicure and pedicure with premium scrubs, extended massages, and your choice of gel or regular polish. Perfect for a self-care day or a special treat. This is the complete LuxeNails experience.",
    duration: "120 mins",
    image: "https://pkbtkzzhnldtciedncna.supabase.co/storage/v1/object/public/service-page/WhatsApp%20Image%202026-96-04%20at%2011.19.13%20AM.jpeg",
    includes: ["Full manicure", "Full pedicure", "Premium scrub", "Extended massage", "Gel or regular polish"],
  },
]

export default function Services() {
  const [selectedService, setSelectedService] = useState(null)

  return (
    <div className="bg-white min-h-screen">

      {/* Header */}
      <div className="text-center py-16 px-6">
        <p className="text-gold tracking-[0.3em] text-sm uppercase mb-2">What We Offer</p>
        <h1 className="font-elegant text-4xl md:text-5xl text-black">Our Services</h1>
        <div className="w-16 h-0.5 bg-gold mx-auto mt-4"></div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              onClick={() => setSelectedService(service)}
              className="rounded-lg overflow-hidden shadow hover:shadow-xl transition-all duration-300 group cursor-pointer"
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
                  <p className="text-gold font-semibold text-lg">{service.price}</p>
                  <span className="text-xs tracking-widest uppercase border border-gold text-gold px-3 py-1 rounded hover:bg-gold hover:text-black transition">
                    View
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Popup */}
      {selectedService && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center px-4"
          onClick={() => setSelectedService(null)}
        >
          <div
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
                <span className="text-gold font-semibold text-xl">{selectedService.price}</span>
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
          </div>
        </div>
      )}

    </div>
  )
}