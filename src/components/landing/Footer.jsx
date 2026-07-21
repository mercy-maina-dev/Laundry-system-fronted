import { Phone, Mail, MapPin, Clock } from "lucide-react";
import logoImg from "../../assets/images/logo.png";

const Footer = () => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logoImg} alt="Smart Laundry" className="h-8 w-auto" />
              <span className="text-xl font-bold text-white">SmartLaundry</span>
            </div>
            <p className="text-sm text-gray-400">
              Clean clothes, happy life. We take care of your laundry, so you can focus on what really matters.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => scrollTo("hero")} className="hover:text-blue-400 transition">Home</button></li>
              <li><button onClick={() => scrollTo("about")} className="hover:text-blue-400 transition">About Us</button></li>
              <li><button onClick={() => scrollTo("services")} className="hover:text-blue-400 transition">Services</button></li>
              <li><button onClick={() => scrollTo("contact")} className="hover:text-blue-400 transition">Contact Us</button></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-3">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>Wash & Fold</li>
              <li>Machine Wash</li>
              <li>Dry Cleaning</li>
              <li>Ironing Service</li>
              <li>Linen & Home Care</li>
              <li>Shoe Cleaning</li>
              <li>Pickup & Delivery</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5" /><span>+254 712 345 678</span></li>
              <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5" /><span>info@smartlaundry.co.ke</span></li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5" /><span>Nyeri, Kenya</span></li>
              <li className="flex items-start gap-2"><Clock className="w-4 h-4 mt-0.5" /><span>Mon - Sat: 8:00 AM - 8:00 PM</span></li>
              <li className="flex items-start gap-2"><Clock className="w-4 h-4 mt-0.5" /><span>Sun: 9:00 AM - 5:00 PM</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
          &copy; 2026 Smart Laundry. All Rights Reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;