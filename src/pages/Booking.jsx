import { useState, useMemo } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useSearchParams } from "react-router-dom"
import { supabase } from "../supabaseClient"
import emailjs from "@emailjs/browser"

const servicesList = [
  { name: "Classic Manicure", price: "GH₵ 80", duration: "45 mins" },
  { name: "Gel Nails", price: "GH₵ 150", duration: "60 mins" },
  { name: "Acrylic Extensions", price: "GH₵ 200", duration: "90 mins" },
  { name: "Nail Art", price: "GH₵ 50+", duration: "30 mins" },
  { name: "Pedicure", price: "GH₵ 100", duration: "60 mins" },
  { name: "Spa Package", price: "GH₵ 280", duration: "120 mins" },
]

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM",
  "3:00 PM", "4:00 PM", "5:00 PM",
]

export default function Booking() {
  const [searchParams] = useSearchParams()

  const initialService = useMemo(() => {
    const serviceFromUrl = searchParams.get("service")
    if (!serviceFromUrl) return null
    return servicesList.find(s => s.name === serviceFromUrl) || null
  }, [searchParams])

  const [step, setStep] = useState(initialService ? 2 : 1)
  const [selectedService, setSelectedService] = useState(initialService)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", notes: "" })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const { error } = await supabase.from("bookings").insert([
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: selectedService.name,
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
      service: selectedService.name,
      date: selectedDate.toDateString(),
      time: selectedTime,
      price: selectedService.price,
      notes: formData.notes || "None",
    }

    try {
      await emailjs.send(
        "service_f8miyin",
        "template_t6magzb",
        templateParams,
        "ryrpoSP2GGj1MADwF"
      )
      await emailjs.send(
        "service_f8miyin",
        "template_b4g50hm",
        templateParams,
        "ryrpoSP2GGj1MADwF"
      )
      // Send WhatsApp notification to admin
    await fetch(
      "https://pkbtkzzhnldtciedncna.supabase.co/functions/v1/notify-admin",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          service: selectedService.name,
          date: selectedDate.toDateString(),
          time: selectedTime,
          phone: formData.phone,
        }),
      }
    )
    } catch (emailError) {
      console.error("Email failed:", emailError)
    }

    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-black min-h-screen flex flex-col justify-center items-center text-white text-center px-6">
        <div className="text-6xl mb-6">💅</div>
        <h2 className="font-elegant text-4xl text-gold mb-4">Booking Received!</h2>
        <div className="bg-green-900/30 border border-green-500/30 text-green-400 text-sm px-4 py-2 rounded mb-6">
          ✓ Confirmation email sent to {formData.email}
        </div>
        <p className="text-gray-400 max-w-md mb-2">
          Thank you, <span className="text-white">{formData.name}</span>!
        </p>
        <p className="text-gray-400 max-w-md mb-8">
          Your <span className="text-gold">{selectedService?.name}</span> appointment
          request for <span className="text-gold">{selectedDate?.toDateString()}</span> at{" "}
          <span className="text-gold">{selectedTime}</span> has been received. We will confirm shortly.
        </p>
        <button
          onClick={() => {
            setSubmitted(false)
            setStep(1)
            setSelectedService(null)
            setSelectedDate(null)
            setSelectedTime(null)
            setFormData({ name: "", email: "", phone: "", notes: "" })
          }}
          className="bg-gold text-black px-8 py-3 rounded tracking-widest uppercase text-sm hover:opacity-90 transition"
        >
          Book Another
        </button>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen py-16 px-6">

      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-gold tracking-[0.3em] text-sm uppercase mb-2">Schedule Your Visit</p>
        <h1 className="font-elegant text-4xl md:text-5xl text-white">Book an Appointment</h1>
        <div className="w-16 h-0.5 bg-gold mx-auto mt-4"></div>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-center gap-4 mb-12">
        {["Service", "Date & Time", "Your Details"].map((label, i) => (
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
      </div>

      <div className="max-w-4xl mx-auto">

        {/* Step 1: Select Service */}
        {step === 1 && (
          <div>
            <h2 className="text-white font-elegant text-2xl mb-6 text-center">Choose a Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {servicesList.map((service, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedService(service)}
                  className={`p-6 rounded-lg border cursor-pointer transition-all duration-300
                    ${selectedService?.name === service.name
                      ? "border-gold bg-gold/10"
                      : "border-gray-700 hover:border-gold"}`}
                >
                  <h3 className="text-white font-elegant text-lg mb-1">{service.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">{service.duration}</p>
                  <p className="text-gold font-semibold">{service.price}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <button
                onClick={() => selectedService && setStep(2)}
                className={`px-10 py-3 rounded tracking-widest uppercase text-sm transition
                  ${selectedService ? "bg-gold text-black hover:opacity-90" : "bg-gray-700 text-gray-500 cursor-not-allowed"}`}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {step === 2 && (
          <div>
            <h2 className="text-white font-elegant text-2xl mb-6 text-center">Pick a Date & Time</h2>

            {/* Show selected service */}
            {selectedService && (
              <div className="text-center mb-6">
                <span className="border border-gold/30 text-gold text-sm px-4 py-1 rounded-full">
                  {selectedService.name} — {selectedService.price}
                </span>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-8 justify-center">
              <div>
                <p className="text-gold text-sm tracking-widest uppercase mb-3">Select Date</p>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  minDate={new Date()}
                  inline
                />
              </div>
              <div>
                <p className="text-gold text-sm tracking-widest uppercase mb-3">Select Time</p>
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map((time, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedTime(time)}
                      className={`px-4 py-2 rounded text-sm border transition
                        ${selectedTime === time
                          ? "border-gold bg-gold text-black"
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
          </div>
        )}

        {/* Step 3: Personal Details */}
        {step === 3 && (
          <div className="max-w-lg mx-auto">
            <h2 className="text-white font-elegant text-2xl mb-6 text-center">Your Details</h2>

            {/* Booking Summary */}
            <div className="border border-gold/30 rounded-lg p-4 mb-6 bg-gold/5">
              <p className="text-gold text-sm tracking-widest uppercase mb-2">Booking Summary</p>
              <p className="text-white text-sm">Service: <span className="text-gold">{selectedService?.name}</span></p>
              <p className="text-white text-sm">Date: <span className="text-gold">{selectedDate?.toDateString()}</span></p>
              <p className="text-white text-sm">Time: <span className="text-gold">{selectedTime}</span></p>
              <p className="text-white text-sm">Price: <span className="text-gold">{selectedService?.price}</span></p>
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
          </div>
        )}

      </div>
    </div>
  )
}