import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import { FadeIn, StaggerContainer, StaggerItem } from "./animations/AnimateIn"
import PageShell from "./PageShell"

export default function Gallery() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGallery = async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (!error && data) {
        setPhotos(data)
      }
      setLoading(false)
    }
    fetchGallery()
  }, [])

  if (loading) {
    return (
      <PageShell variant="gallery" theme="dark" className="py-20 px-6 min-h-screen flex items-center justify-center">
        <FadeIn>
          <p className="text-gray-400">Loading gallery...</p>
        </FadeIn>
      </PageShell>
    )
  }

  return (
    <PageShell variant="gallery" theme="dark" className="py-20 px-6 min-h-screen">

      <FadeIn className="text-center mb-14">
        <p className="text-gold tracking-[0.3em] text-sm uppercase mb-2">
          Our Work
        </p>
        <h2 className="font-elegant text-4xl md:text-5xl text-white">
          Gallery
        </h2>
        <div className="w-16 h-0.5 bg-gold mx-auto mt-4"></div>
      </FadeIn>

      <StaggerContainer className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-3" stagger={0.08}>
        {photos.map((photo) => (
          <StaggerItem key={photo.id}>
            <div className="overflow-hidden rounded-lg group">
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

    </PageShell>
  )
}
