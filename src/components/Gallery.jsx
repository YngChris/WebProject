const photos = [
  {
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=600&fit=crop",
    alt: "Nail design 1",
  },
  {
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=600&fit=crop",
    alt: "Nail design 2",
  },
  {
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=600&fit=crop",
    alt: "Nail design 3",
  },
  {
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=600&fit=crop",
    alt: "Nail design 4",
  },
  {
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=600&fit=crop",
    alt: "Nail design 5",
  },
  {
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=600&fit=crop",
    alt: "Nail design 6",
  },
]

export default function Gallery() {
  return (
    <section className="bg-black py-20 px-6">

      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-gold tracking-[0.3em] text-sm uppercase mb-2">
          Our Work
        </p>
        <h2 className="font-elegant text-4xl md:text-5xl text-white">
          Gallery
        </h2>
        <div className="w-16 h-0.5 bg-gold mx-auto mt-4"></div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <div key={index} className="overflow-hidden rounded-lg group">
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        ))}
      </div>

    </section>
  )
}