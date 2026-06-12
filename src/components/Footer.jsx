import { Link } from "react-router-dom"
import { FadeIn, StaggerContainer, StaggerItem } from "./animations/AnimateIn"
import DoodleWallpaper from "./DoodleWallpaper"

export default function Footer() {
  return (
    <footer className="relative text-white py-18 px-0 overflow-hidden">
      <DoodleWallpaper variant="home-footer" theme="dark"/>
      <StaggerContainer className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-40 py-5">

        <StaggerItem>
          <h4 className="font-elegant text-2x2 text-gold mb-4 font-bold">PinkStudio</h4>
          <p className="text-gray-300 text-sm leading-relaxed">
            Premium nail care tailored just for you. Beauty at your fingertips.
          </p>
        </StaggerItem>

        <StaggerItem>
          <h4 className="font-elegant text-2x2 text-gold tracking-widest text-sm uppercase mb-4 font-bold">Quick Links</h4>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><Link to="/" className="hover:text-gold transition-colors">Home</Link></li>
            <li><Link to="/services" className="hover:text-gold transition-colors">Services</Link></li>
            <li><Link to="/booking" className="hover:text-gold transition-colors">Book Now</Link></li>
          </ul>
        </StaggerItem>

        <StaggerItem>
          <h4 className="font-elegant text-2x2 text-gold tracking-widest text-sm uppercase mb-4 font-bold" >Contact Us</h4>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>📍 KNUST CAMPUS, GHANA</li>
            <li>📞 +233 50 355 2705</li>
            <li>📧 janiecedarko18@gmail.com</li>
            <li>⏰ Mon - Sat: 9am - 7pm</li>
          </ul>
        </StaggerItem>

      </StaggerContainer>

      <FadeIn delay={0.2} className="relative z-10 border-t border-gray-800 mt-4 pt-3 text-center text-gray-300 text-sm">
        © 2026 PinkStudio. All rights reserved.
      </FadeIn>
    </footer>
  )
}
