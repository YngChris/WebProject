import { FadeIn, StaggerContainer, StaggerItem } from "./animations/AnimateIn"
import DoodleWallpaper from "./DoodleWallpaper"

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
    <section className="relative py-20 px-6 overflow-hidden">
      <DoodleWallpaper variant="home-testimonials" theme="light" />

      <FadeIn className="relative z-10 text-center mb-14">
        <p className="text-gold tracking-[0.3em] text-sm uppercase mb-2">
          Happy Clients
        </p>
        <h2 className="font-elegant text-4xl md:text-5xl text-black">
          Testimonials
        </h2>
        <div className="w-16 h-0.5 bg-gold mx-auto mt-4"></div>
      </FadeIn>

      <StaggerContainer className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, index) => (
          <StaggerItem key={index}>
            <div className="bg-white/85 backdrop-blur-sm border border-white/60 rounded-lg p-8 hover:shadow-lg transition-all duration-300 h-full">
              <div className="text-gold text-2xl mb-4">
                {"★".repeat(t.rating)}
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 italic">
                "{t.review}"
              </p>
              <p className="font-elegant text-black font-semibold">— {t.name}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

    </section>
  )
}
