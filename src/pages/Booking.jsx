import { useState, useMemo, useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useSearchParams } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { supabase } from "../supabaseClient"
import emailjs from "@emailjs/browser"
import { FadeIn, FadeInOnMount } from "../components/animations/AnimateIn"
import { formatPrice } from "../utils/formatPrice"
import PageShell from "../components/PageShell"

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM",
  "3:00 PM", "4:00 PM", "5:00 PM",
]

export default function Booking() {
  const [searchParams] = useSearchParams()
  const [servicesList, setServicesList] = useState([])

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: true })
      if (!error && data) setServicesList(data)
    }
    fetchServices()
  }, [])

  const initialService = useMemo(() => {
    const serviceFromUrl = searchParams.get("service")
    if (!serviceFromUrl || servicesList.length === 0) return null
    return servicesList.find(s =>
      s.name === serviceFromUrl || s.title === serviceFromUrl
    ) || null
  }, [searchParams, servicesList])

  const [step, setStep] = useState(() => {
    const serviceFromUrl = searchParams.get("service")
    return serviceFromUrl ? 2 : 1
  })

  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", notes: "" })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialService) {
      setSelectedService(initialService)
      setStep(2)
    }
  }, [initialService])

  const serviceName = selectedService?.title || selectedService?.name || ""
  const servicePrice = selectedService?.price || ""

  const handleSubmit = async () => {
    setLoading(true)

    const { error } = await supabase.from("bookings").insert([
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: serviceName,
        date: selectedDate.toISOString().split("T")[0],
        time: selectedTime,
        notes: formData.notes,
        status: "pending",
      },
    ])

    if (error) {
      alert("Something went wrong. Please try again.")
      console.error(error)
      setLoading(false)
      return
    }

    const templateParams = {
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      service: serviceName,
      date: selectedDate.toDateString(),
      time: selectedTime,
      price: formatPrice(servicePrice),
      notes: formData.notes || "None",
    }

    try {
      await emailjs.send(
        "service_f8miyin",
        "template_b4g50hm",
        templateParams,
        "ryrpoSP2GGj1MADwF"
      )
    } catch (emailError) {
      console.error("Email failed:", emailError)
    }

    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <PageShell variant="booking" theme="dark" className="min-h-screen flex flex-col justify-center items-center text-white text-center px-6">
        <FadeInOnMount>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="text-6xl mb-6"
          >
            💅
          </motion.div>
        </FadeInOnMount>
        <FadeInOnMount delay={0.3}>
          <h2 className="font-elegant text-4xl text-gold mb-4">Booking Received!</h2>
        </FadeInOnMount>
        <FadeInOnMount delay={0.4}>
          <div className="bg-green-900/30 border border-green-500/30 text-green-400 text-sm px-4 py-2 rounded mb-6">
            ✓ Details sent to Admin
          </div>
        </FadeInOnMount>
        <FadeInOnMount delay={0.5}>
          <p className="text-gray-400 max-w-md mb-2">
            Thank you, <span className="text-white">{formData.name}</span>!
          </p>
        </FadeInOnMount>
        <FadeInOnMount delay={0.6}>
          <p className="text-gray-400 max-w-md mb-8">
            Your <span className="text-gold">{serviceName}</span> appointment
            request for <span className="text-gold">{selectedDate?.toDateString()}</span> at{" "}
            <span className="text-gold">{selectedTime}</span> has been received. We will confirm shortly.
          </p>
        </FadeInOnMount>
        <FadeInOnMount delay={0.7}>
          <button
            onClick={() => {
              setSubmitted(false)
              setStep(1)
              setSelectedService(null)
              setSelectedDate(null)
              setSelectedTime(null)
              setFormData({ name: "", email: "", phone: "", notes: "" })
              window.location.href = "/services"
            }}
            className="bg-gold text-black px-8 py-3 rounded tracking-widest uppercase text-sm hover:opacity-90 transition"
          >
            Book Another
          </button>
        </FadeInOnMount>
      </PageShell>
    )
  }

  return (
    <PageShell variant="booking" theme="dark" className="min-h-screen py-16 px-6 text-white">

      <FadeIn className="text-center mb-12">
        <p className="text-gold tracking-[0.3em] text-sm uppercase mb-2">Schedule Your Visit</p>
        <h1 className="font-elegant text-4xl md:text-5xl text-white">Book an Appointment</h1>
        <div className="w-16 h-0.5 bg-gold mx-auto mt-4"></div>
      </FadeIn>

      {/* Step Indicator */}
      <FadeIn delay={0.15} className="flex justify-center gap-4 mb-12">
        {["Choose Service", "Date & Time", "Your Details"].map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
              ${step === i + 1 ? "bg-gold text-black" : step > i + 1 ? "bg-gold text-black opacity-60" : "border border-gray-600 text-gray-600"}`}>
              {i + 1}
            </div>
            <span className={`text-sm hidden md:block ${step === i + 1 ? "text-gold" : "text-gray-600"}`}>
              {label}
            </span>
            {i < 2 && <div className="w-8 h-0.5 bg-gray-700 mx-2"></div>}
          </div>
        ))}
      </FadeIn>

      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">

          {/* Step 1: Select Service */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="text-white font-elegant text-2xl mb-6 text-center">Choose a Service</h2>
              {servicesList.length === 0 ? (
                <p className="text-center text-gray-400">Loading services...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {servicesList.map((service, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedService(service)}
                      className={`p-6 rounded-lg border cursor-pointer transition-all duration-300
                        ${selectedService?.id === service.id || selectedService?.title === service.title
                          ? "border-gold bg-gold/10"
                          : "border-gray-700 hover:border-gold"}`}
                    >
                      {service.image && (
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                      )}
                      <h3 className="text-white font-elegant text-lg mb-1">
                        {service.title || service.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3">{service.duration}</p>
                      <p className="text-gold font-semibold">{formatPrice(service.price)}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="text-center mt-8">
                <button
                  onClick={() => selectedService && setStep(2)}
                  className={`px-10 py-3 rounded tracking-widest uppercase text-sm transition
                    ${selectedService ? "bg-gold text-black hover:opacity-90" : "bg-gray-700 text-gray-500 cursor-not-allowed"}`}
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="text-white font-elegant text-2xl mb-6 text-center">Pick a Date & Time</h2>

              {selectedService && (
                <div className="text-center mb-6">
                  <span className="border border-gold/30 text-gold text-sm px-4 py-1 rounded-full">
                    {serviceName} — {formatPrice(servicePrice)}
                  </span>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-8 justify-center">
                <div>
                  <p className="text-white text-sm tracking-widest uppercase mb-3 text-center font-bold">Select Date</p>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    minDate={new Date()}
                    inline
                  />
                </div>
                <div>
                  <p className="text-white text-sm tracking-widest uppercase mb-3 text-center font-bold">Select Time</p>
                  <div className="grid grid-cols-3 gap-3 mt-10">
                    {timeSlots.map((time, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedTime(time)}
                        className={`px-4 py-2 rounded text-sm border transition
                          ${selectedTime === time
                            ? "border-gold bg-gold text-white"
                            : "border-gray-700 text-gray-400 hover:border-gold"}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="px-8 py-3 border border-gray-700 text-gray-400 rounded tracking-widest uppercase text-sm hover:border-gold transition"
                >
                  Back
                </button>
                <button
                  onClick={() => selectedDate && selectedTime && setStep(3)}
                  className={`px-10 py-3 rounded tracking-widest uppercase text-sm transition
                    ${selectedDate && selectedTime ? "bg-gold text-black hover:opacity-90" : "bg-gray-700 text-gray-500 cursor-not-allowed"}`}
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Your Details */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-lg mx-auto"
            >
              <h2 className="text-white font-elegant text-2xl mb-6 text-center">Your Details</h2>

              {/* Booking Summary */}
              <div className="border border-gold/30 rounded-lg p-4 mb-6 bg-gold/5">
                <p className="text-gold text-sm tracking-widest uppercase mb-2">Booking Summary</p>
                <p className="text-white text-sm">Service: <span className="text-gold">{serviceName || "Not selected"}</span></p>
                <p className="text-white text-sm">Date: <span className="text-gold">{selectedDate?.toDateString() || "Not selected"}</span></p>
                <p className="text-white text-sm">Time: <span className="text-gold">{selectedTime || "Not selected"}</span></p>
                <p className="text-white text-sm">Price: <span className="text-gold">{formatPrice(servicePrice) || "-"}</span></p>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Full Name", key: "name", type: "text", placeholder: "Ama Owusu" },
                  { label: "Email Address", key: "email", type: "email", placeholder: "ama@example.com" },
                  { label: "Phone Number", key: "phone", type: "tel", placeholder: "+233 XX XXX XXXX" },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="text-gold text-sm tracking-widest uppercase block mb-1">{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={formData[key]}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 text-white rounded px-4 py-3 focus:outline-none focus:border-gold transition"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-gold text-sm tracking-widest uppercase block mb-1">Special Notes</label>
                  <textarea
                    placeholder="Any special requests..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded px-4 py-3 focus:outline-none focus:border-gold transition"
                  />
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="px-8 py-3 border border-gray-700 text-gray-400 rounded tracking-widest uppercase text-sm hover:border-gold transition"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.name || !formData.email || !formData.phone || loading}
                  className={`px-10 py-3 rounded tracking-widest uppercase text-sm transition
                    ${formData.name && formData.email && formData.phone && !loading
                      ? "bg-gold text-black hover:opacity-90"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"}`}
                >
                  {loading ? "Submitting..." : "Confirm Booking"}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </PageShell>
  )
}