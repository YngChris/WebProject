import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Brand */}
        <div>
          <h3 className="font-elegant text-2xl text-gold mb-4">LuxeNails</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Premium nail care tailored just for you. Beauty at your fingertips.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-gold tracking-widest text-sm uppercase mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link to="/" className="hover:text-gold transition-colors">Home</Link></li>
            <li><Link to="/services" className="hover:text-gold transition-colors">Services</Link></li>
            <li><Link to="/booking" className="hover:text-gold transition-colors">Book Now</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-gold tracking-widest text-sm uppercase mb-4">Contact Us</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>📍 Kumasi, Ghana</li>
            <li>📞 +233 XX XXX XXXX</li>
            <li>📧 info@luxenails.com</li>
            <li>⏰ Mon - Sat: 9am - 7pm</li>
          </ul>
        </div>

      </div>

      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-600 text-sm">
        © 2026 LuxeNails. All rights reserved.
      </div>
    </footer>
  )
}