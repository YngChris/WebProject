const testimonials = [
  {
    name: "Ama Owusu",
    review: "Absolutely love my nails! The attention to detail is incredible. Will definitely be coming back.",
    rating: 5,
  },
  {
    name: "Efua Mensah",
    review: "Best nail experience I've ever had. The gel nails lasted over 3 weeks without chipping!",
    rating: 5,
  },
  {
    name: "Abena Asante",
    review: "The spa package was so relaxing. My hands and feet have never looked better. Highly recommend!",
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <section className="bg-white py-20 px-6">

      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-gold tracking-[0.3em] text-sm uppercase mb-2">
          Happy Clients
        </p>
        <h2 className="font-elegant text-4xl md:text-5xl text-black">
          Testimonials
        </h2>
        <div className="w-16 h-0.5 bg-gold mx-auto mt-4"></div>
      </div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, index) => (
          <div key={index} className="border border-gray-100 rounded-lg p-8 hover:shadow-lg transition-all duration-300">
            <div className="text-gold text-2xl mb-4">
              {"★".repeat(t.rating)}
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 italic">
              "{t.review}"
            </p>
            <p className="font-elegant text-black font-semibold">— {t.name}</p>
          </div>
        ))}
      </div>

    </section>
  )
}