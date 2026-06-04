import { Link } from "react-router-dom"

export default function Hero() {
  return (
    <section className="bg-black text-white min-h-screen flex flex-col justify-center items-center text-center px-6">
      
      <p className="text-gold tracking-[0.3em] text-sm mb-4 uppercase">
        Premium Nail Studio
      </p>

      <h1 className="font-elegant text-5xl md:text-7xl mb-6 leading-tight">
        Beauty at Your <br /> Fingertips
      </h1>

      <p className="text-gray-400 max-w-md mb-10 text-lg">
        Luxury nail care tailored just for you. Book your appointment today and treat yourself.
      </p>

      <div className="flex gap-4">
        <Link
          to="/booking"
          className="bg-gold text-black px-8 py-3 text-sm tracking-widest uppercase hover:opacity-90 transition rounded"
        >
          Book Now
        </Link>
        <Link
          to="/services"
          className="border border-gold text-gold px-8 py-3 text-sm tracking-widest uppercase hover:bg-gold hover:text-black transition rounded"
        >
          Our Services
        </Link>
      </div>

    </section>
  )
}