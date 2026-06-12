import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { supabase } from "../supabaseClient"
import { StaggerContainer, StaggerItem } from "../components/animations/AnimateIn"
import { formatPrice, normalizePrice } from "../utils/formatPrice"
import PageShell from "../components/PageShell"

const adminEmail = import.meta.env.VITE_ADMIN_EMAIL

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("services")
  const navigate = useNavigate()
  
  // Services state
  const [services, setServices] = useState([])
  const [editingService, setEditingService] = useState(null)
  const [serviceForm, setServiceForm] = useState({
    title: "",
    description: "",
    fullDescription: "",
    duration: "",
    price: "",
    image: "",
    includes: ""
  })
  const [serviceImageFile, setServiceImageFile] = useState(null)
  const [uploadingServiceImage, setUploadingServiceImage] = useState(false)
  
  // Gallery state
  const [galleryImages, setGalleryImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  // Testimonials state
  const [testimonials, setTestimonials] = useState([])
  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    review: "",
    rating: 5,
  })
  const [editingTestimonial, setEditingTestimonial] = useState(null)

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== adminEmail) {
        navigate("/admin")
      } else {
        fetchServices()
        fetchGalleryImages()
        fetchTestimonials()
      }
    }
    checkAdmin()
  }, [])
  
  const fetchServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: true })
    
    if (!error && data) {
      setServices(data)
    }
  }

  const fetchGalleryImages = async () => {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false })
    
    if (!error && data) {
      setGalleryImages(data)
    }
  }

  const fetchTestimonials = async () => {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false })

  if (!error && data) setTestimonials(data)
}

  const handleServiceEdit = (service) => {
    setEditingService(service)
    setServiceForm({
      title: service.title,
      description: service.description,
      fullDescription: service.fullDescription,
      duration: service.duration,
      price: service.price,
      image: service.image,
      includes: service.includes ? service.includes.join(", ") : ""
    })
  }

  const handleServiceImageUpload = async () => {
    if (!serviceImageFile) return
    
    setUploadingServiceImage(true)
    const fileExt = serviceImageFile.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(filePath, serviceImageFile)

    if (uploadError) {
      setUploadingServiceImage(false)
      console.error("Upload error:", uploadError)
      alert(`Error uploading image: ${uploadError.message}`)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath)

    setServiceForm({ ...serviceForm, image: publicUrl })
    setServiceImageFile(null)
    setUploadingServiceImage(false)
  }

  const handleServiceSave = async () => {
    const includesArray = serviceForm.includes.split(",").map(item => item.trim()).filter(item => item)
    const price = normalizePrice(serviceForm.price)
    
    if (editingService) {
      const { error } = await supabase
        .from("services")
        .update({
          title: serviceForm.title,
          description: serviceForm.description,
          fullDescription: serviceForm.fullDescription,
          duration: serviceForm.duration,
          price,
          image: serviceForm.image,
          includes: includesArray
        })
        .eq("id", editingService.id)
      
      if (!error) {
        fetchServices()
        setEditingService(null)
        setServiceForm({
          title: "",
          description: "",
          fullDescription: "",
          duration: "",
          price: "",
          image: "",
          includes: ""
        })
        setServiceImageFile(null)
      }
    } else {
      const { error } = await supabase
        .from("services")
        .insert({
          title: serviceForm.title,
          description: serviceForm.description,
          fullDescription: serviceForm.fullDescription,
          duration: serviceForm.duration,
          price,
          image: serviceForm.image,
          includes: includesArray
        })
      
      if (!error) {
        fetchServices()
        setServiceForm({
          title: "",
          description: "",
          fullDescription: "",
          duration: "",
          price: "",
          image: "",
          includes: ""
        })
        setServiceImageFile(null)
      }
    }
  }

  const handleServiceDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", id)
    
    if (!error) fetchServices()
  }

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0])
  }

  const handleImageUpload = async () => {
    if (!selectedFile) return
    
    setUploading(true)
    const fileExt = selectedFile.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(filePath, selectedFile)

    if (uploadError) {
      setUploading(false)
      alert("Error uploading image")
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath)

    const { error: dbError } = await supabase
      .from("gallery")
      .insert({
        src: publicUrl,
        alt: selectedFile.name
      })

    if (!dbError) {
      fetchGalleryImages()
      setSelectedFile(null)
    }

    setUploading(false)
  }

  const handleGalleryDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return
    
    const image = galleryImages.find(img => img.id === id)
    if (image && image.src) {
      const fileName = image.src.split('/').pop()
      await supabase.storage
        .from('gallery')
        .remove([fileName])
    }

    const { error } = await supabase
      .from("gallery")
      .delete()
      .eq("id", id)
    
    if (!error) fetchGalleryImages()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/admin")
  }
const handleTestimonialSave = async () => {
  if (!testimonialForm.name || !testimonialForm.review) return

  if (editingTestimonial) {
    const { error } = await supabase
      .from("testimonials")
      .update({
        name: testimonialForm.name,
        review: testimonialForm.review,
        rating: testimonialForm.rating,
      })
      .eq("id", editingTestimonial.id)

    if (!error) {
      fetchTestimonials()
      setEditingTestimonial(null)
      setTestimonialForm({ name: "", review: "", rating: 5 })
    }
  } else {
    const { error } = await supabase
      .from("testimonials")
      .insert({
        name: testimonialForm.name,
        review: testimonialForm.review,
        rating: testimonialForm.rating,
      })

    if (!error) {
      fetchTestimonials()
      setTestimonialForm({ name: "", review: "", rating: 5 })
    }
  }
}

const handleTestimonialEdit = (t) => {
  setEditingTestimonial(t)
  setTestimonialForm({
    name: t.name,
    review: t.review,
    rating: t.rating,
  })
}

const handleTestimonialDelete = async (id) => {
  if (!window.confirm("Delete this testimonial?")) return
  const { error } = await supabase
    .from("testimonials")
    .delete()
    .eq("id", id)

  if (!error) fetchTestimonials()
}
  return (
    <PageShell variant="admin-settings" theme="dark" className="min-h-screen text-white">

      {/* Top Bar */}
      <div className="bg-black/70 backdrop-blur-md border-b border-gold/15 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="font-elegant text-2xl text-gold">PinkStudio Settings</h1>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="text-gray-400 text-sm hover:text-gold transition"
          >
            ← Back to Dashboard
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="text-gray-400 text-sm hover:text-gold transition"
        >
          Logout
        </button>
      </div>

      <div className="px-6 py-8 max-w-7xl mx-auto">

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-800 pb-4">
          <button
            onClick={() => setActiveTab("services")}
            className={`px-4 py-2 rounded text-sm capitalize transition
              ${activeTab === "services"
                ? "bg-gold text-black"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-4 py-2 rounded text-sm capitalize transition
              ${activeTab === "gallery"
                ? "bg-gold text-black"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
          >
            Gallery
          </button>
          <button
             onClick={() => setActiveTab("testimonials")}
            className={`px-4 py-2 rounded text-sm capitalize transition
              ${activeTab === "testimonials"
                 ? "bg-gold text-black"
                 : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
>
            Testimonials
          </button>
        </div>

        <AnimatePresence mode="wait">
        {activeTab === "services" && (
          <motion.div
            key="services"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Add/Edit Service Form */}
            <div className="bg-black/55 backdrop-blur-sm border border-gold/15 rounded-lg p-6 mb-8">
              <h2 className="font-elegant text-xl text-gold mb-4">
                {editingService ? "Edit Service" : "Add New Service"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Title</label>
                  <input
                    type="text"
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({...serviceForm, title: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Price</label>
                  <input
                    type="text"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-gold focus:outline-none"
                    placeholder="GH₵ 50"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Duration</label>
                  <input
                    type="text"
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm({...serviceForm, duration: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-gold focus:outline-none"
                    placeholder="45 mins"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-400 text-sm mb-2">Service Image</label>
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setServiceImageFile(e.target.files[0])}
                        className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-gold focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={handleServiceImageUpload}
                      disabled={!serviceImageFile || uploadingServiceImage}
                      className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition disabled:opacity-50"
                    >
                      {uploadingServiceImage ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                  {serviceForm.image && (
                    <div className="mt-2">
                      <p className="text-gray-400 text-xs mb-1">Current image:</p>
                      <img
                        src={serviceForm.image}
                        alt="Service preview"
                        className="h-20 w-20 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-400 text-sm mb-2">Short Description</label>
                  <textarea
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-gold focus:outline-none h-20"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-400 text-sm mb-2">Full Description</label>
                  <textarea
                    value={serviceForm.fullDescription}
                    onChange={(e) => setServiceForm({...serviceForm, fullDescription: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-gold focus:outline-none h-32"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-400 text-sm mb-2">Includes (comma-separated)</label>
                  <textarea
                    value={serviceForm.includes}
                    onChange={(e) => setServiceForm({...serviceForm, includes: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-gold focus:outline-none h-20"
                    placeholder="Nail shaping, Cuticle care, Hand massage"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleServiceSave}
                  className="bg-gold text-black px-6 py-2 rounded font-semibold hover:opacity-90 transition"
                >
                  {editingService ? "Update Service" : "Add Service"}
                </button>
                {editingService && (
                  <button
                    onClick={() => {
                      setEditingService(null)
                      setServiceForm({
                        title: "",
                        description: "",
                        fullDescription: "",
                        duration: "",
                        price: "",
                        image: "",
                        includes: ""
                      })
                    }}
                    className="bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Services List */}
            <div className="bg-black/55 backdrop-blur-sm border border-gold/15 rounded-lg p-6">
              <h2 className="font-elegant text-xl text-gold mb-4">Current Services</h2>
              {services.length === 0 ? (
                <p className="text-gray-400">No services found. Add your first service above.</p>
              ) : (
                <StaggerContainer className="space-y-4" stagger={0.06}>
                  {services.map((service) => (
                    <StaggerItem key={service.id}>
                    <div className="border border-gray-800 rounded p-4 flex justify-between items-start">
                      <div className="flex gap-4">
                        {service.image && (
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-20 h-20 object-cover rounded"
                          />
                        )}
                        <div>
                          <h3 className="text-white font-semibold">{service.title}</h3>
                          <p className="text-gold">{formatPrice(service.price)}</p>
                          <p className="text-gray-400 text-sm">{service.duration}</p>
                          <p className="text-gray-500 text-sm mt-1">{service.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleServiceEdit(service)}
                          className="px-3 py-1 bg-blue-900/30 border border-blue-500/30 text-blue-400 rounded text-xs hover:bg-blue-900/60 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleServiceDelete(service.id)}
                          className="px-3 py-1 bg-red-900/30 border border-red-500/30 text-red-400 rounded text-xs hover:bg-red-900/60 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "gallery" && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Upload Form */}
            <div className="bg-black/55 backdrop-blur-sm border border-gold/15 rounded-lg p-6 mb-8">
              <h2 className="font-elegant text-xl text-gold mb-4">Upload New Image</h2>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-gray-400 text-sm mb-2">Select Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-gold focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleImageUpload}
                  disabled={!selectedFile || uploading}
                  className="bg-gold text-black px-6 py-2 rounded font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="bg-black/55 backdrop-blur-sm border border-gold/15 rounded-lg p-6">
              <h2 className="font-elegant text-xl text-gold mb-4">Current Gallery</h2>
              {galleryImages.length === 0 ? (
                <p className="text-gray-400">No images found. Upload your first image above.</p>
              ) : (
                <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4" stagger={0.06}>
                  {galleryImages.map((image) => (
                    <StaggerItem key={image.id}>
                    <div className="relative group">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-48 object-cover rounded"
                      />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 rounded">
                        <button
                          onClick={() => handleGalleryDelete(image.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              )}
            </div>
          </motion.div>
        )}
        {activeTab === "testimonials" && (
          <div>
          {/* Add/Edit Form */}
          <div className="bg-black border border-gray-800 rounded-lg p-6 mb-8">
            <h2 className="font-elegant text-xl text-gold mb-4">
              {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Customer Name</label>
                <input
                  type="text"
                  value={testimonialForm.name}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                  placeholder="Ama Owusu"
                  className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Review</label>
                  <textarea
                    value={testimonialForm.review}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, review: e.target.value })}
                    placeholder="Write the customer's review here..."
                    rows={4}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-gold focus:outline-none"
                  />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setTestimonialForm({ ...testimonialForm, rating: star })}
                      className={`text-2xl transition ${
                        star <= testimonialForm.rating ? "text-gold" : "text-gray-600"
                      }`}
                      >
                      ★
                    </button>
        ))}
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleTestimonialSave}
          disabled={!testimonialForm.name || !testimonialForm.review}
          className="bg-gold text-black px-6 py-2 rounded font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {editingTestimonial ? "Update Testimonial" : "Add Testimonial"}
        </button>
        {editingTestimonial && (
          <button
            onClick={() => {
              setEditingTestimonial(null)
              setTestimonialForm({ name: "", review: "", rating: 5 })
            }}
            className="bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </div>

    {/* Testimonials List */}
    <div className="bg-black border border-gray-800 rounded-lg p-6">
      <h2 className="font-elegant text-xl text-gold mb-4">Current Testimonials</h2>
      {testimonials.length === 0 ? (
        <p className="text-gray-400">No testimonials yet. Add your first one above.</p>
      ) : (
        <div className="space-y-4">
          {testimonials.map((t) => (
            <div key={t.id} className="border border-gray-800 rounded p-4 flex justify-between items-start">
              <div>
                <p className="text-gold text-lg">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</p>
                <p className="text-white font-semibold mt-1">{t.name}</p>
                <p className="text-gray-400 text-sm mt-1 italic">"{t.review}"</p>
              </div>
              <div className="flex gap-2 ml-4 shrink-0">
                <button
                  onClick={() => handleTestimonialEdit(t)}
                  className="px-3 py-1 bg-blue-900/30 border border-blue-500/30 text-blue-400 rounded text-xs hover:bg-blue-900/60 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleTestimonialDelete(t.id)}
                  className="px-3 py-1 bg-red-900/30 border border-red-500/30 text-red-400 rounded text-xs hover:bg-red-900/60 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}
        </AnimatePresence>

      </div>
    </PageShell>
  )
}
