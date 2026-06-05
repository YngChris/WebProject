const services = [
  {
    title: "Classic Manicure",
    description: "A timeless treatment including shaping, cuticle care, and polish.",
    image: "https://pkbtkzzhnldtciedncna.supabase.co/storage/v1/object/public/services/Eyelash.jpeg",
  },
  {
    title: "Gel Nails",
    description: "Long-lasting gel polish that stays flawless for up to 3 weeks.",
    image: "https://pkbtkzzhnldtciedncna.supabase.co/storage/v1/object/public/services/Nail.jpeg",
  },
  {
    title: "Acrylic Extensions",
    description: "Full set of acrylic nails customized to your desired length and shape.",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
  },
]

export default function Services() {
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
        {services.map((service, index) => (
          <div
            key={index}
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
              <p className="text-gold font-semibold text-lg">{service.price}</p>
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}