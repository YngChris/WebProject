import { Link } from "react-router-dom"
import { FadeInOnMount } from "./animations/AnimateIn"
import DoodleWallpaper from "./DoodleWallpaper"

export default function Hero() {
  return (
    <section className="relative text-white min-h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden">
      <DoodleWallpaper variant="home-hero" theme="dark" />

      <div className="relative z-10 flex flex-col items-center">
      <FadeInOnMount delay={0.1}>
        <p className="text-gold tracking-[0.3em] text-sm mb-4 uppercase">
          Premium Nail Studio
        </p>
      </FadeInOnMount>

      <FadeInOnMount delay={0.25}>
        <h1 className="font-elegant text-5xl md:text-7xl mb-6 leading-tight">
          Beauty at Your <br /> Fingertips
        </h1>
      </FadeInOnMount>

      <FadeInOnMount delay={0.4}>
        <p className="text-gray-400 max-w-md mb-10 text-lg">
          Luxury nail care tailored just for you. Book your appointment today and treat yourself.
        </p>
      </FadeInOnMount>

      <FadeInOnMount delay={0.55}>
        <div className="flex gap-4">
          <Link
            to="/services"
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
      </FadeInOnMount>
      </div>

    </section>
  )
}
