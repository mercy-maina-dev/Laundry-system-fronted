import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, ArrowRight, Clock,
  Truck, Sparkles, Home, Star, Calendar, MapPin,
  Phone, Mail, Package, WashingMachine,
  Users, Award
} from 'lucide-react'
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'
import { useAuth } from '../../hooks/useAuth'
import logoImg from '../../assets/images/logo.png'
import coverImg from '../../assets/images/cover.png'

import service1 from '../../assets/images/service1.png'
import service2 from '../../assets/images/service2.png'
import service3 from '../../assets/images/service3.png'
import service4 from '../../assets/images/service4.png'
import service5 from '../../assets/images/service5.png'
import service6 from '../../assets/images/service6.png'

const Landing = () => {
  const { user } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setIsMenuOpen(false)
    }
  }

  const services = [
    { id: 1, img: service1, alt: 'Wash & Fold' },
    { id: 2, img: service2, alt: 'Dry Cleaning' },
    { id: 3, img: service3, alt: 'Dry Clean & Press' },
    { id: 4, img: service4, alt: 'Shoe Clean & Press' },
    { id: 5, img: service5, alt: 'Pickup & Delivery' },
    { id: 6, img: service6, alt: 'Linen & Home Care' },
  ]

  const testimonials = [
    { id: 1, name: 'Wanjiku M.', location: 'Nairobi', text: 'Smart Laundry has been a game changer for me. Super convenient, on time and my clothes always come back fresh and clean!', rating: 5 },
    { id: 2, name: 'Brian K.', location: 'Karaitina', text: 'Excellent service! The pickup and delivery is so easy and the team is very professional.', rating: 5 },
    { id: 3, name: 'Amina H.', location: 'Nyeri', text: 'I love how they take care of my delicate fabrics. Highly recommend Smart Laundry!', rating: 5 },
  ]

  const steps = [
    { icon: Calendar, title: 'Book Online', desc: 'Schedule a pickup at your convenience.' },
    { icon: Truck, title: 'We Pickup', desc: 'We come to your doorstep.' },
    { icon: WashingMachine, title: 'We Clean', desc: 'Professional wash & care.' },
    { icon: Home, title: 'We Deliver', desc: 'Fresh laundry back to you.' },
  ]

  const stats = [
    { icon: Package, value: '500+', label: 'Orders Completed' },
    { icon: Users, value: '150+', label: 'Happy Customers' },
    { icon: Star, value: '4.9', label: 'Average Rating' },
    { icon: Award, value: '100%', label: 'Satisfaction' },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans overflow-x-hidden">
      
      {/* ====== NAVBAR ====== */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex items-center gap-2 group">
              <img src={logoImg} alt="Smart Laundry" className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105" />
              <span className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
                Smart<span className="text-blue-600 dark:text-blue-400">Laundry</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700 dark:text-gray-300">
              {['Home', 'Services', 'How It Works', 'Pricing', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item === 'Home' ? 'hero' : item.toLowerCase().replace(/\s/g, ''))}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full" />
                </button>
              ))}
              {user ? (
                <Link
                  to={user.role === 'ADMIN' ? '/admin' : user.role === 'DRIVER' ? '/driver' : '/dashboard'}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition shadow-lg hover:shadow-xl hover:scale-105 transform duration-300"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition shadow-lg hover:shadow-xl hover:scale-105 transform duration-300"
                >
                  Book Now
                </Link>
              )}
            </nav>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden bg-white dark:bg-gray-900 rounded-b-2xl shadow-lg overflow-hidden"
              >
                <div className="flex flex-col p-4 space-y-3 text-gray-700 dark:text-gray-300">
                  {['Home', 'Services', 'How It Works', 'Pricing', 'Contact'].map((item) => (
                    <button
                      key={item}
                      onClick={() => scrollTo(item === 'Home' ? 'hero' : item.toLowerCase().replace(/\s/g, ''))}
                      className="text-left py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition"
                    >
                      {item}
                    </button>
                  ))}
                  {user ? (
                    <Link
                      to={user.role === 'ADMIN' ? '/admin' : user.role === 'DRIVER' ? '/driver' : '/dashboard'}
                      className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-full transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-full transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Book Now
                    </Link>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ====== HERO ====== */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={coverImg} alt="Clean laundry" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>

        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">Premium Laundry Service</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight">
              <span className="block">Clean Clothes.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 animate-gradient">
                Fresh Life.
              </span>
            </h1>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 px-6 py-2.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Truck className="w-5 h-5" /> We Pickup.
              </div>
              <div className="flex items-center gap-2 px-6 py-2.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Sparkles className="w-5 h-5" /> We Clean.
              </div>
              <div className="flex items-center gap-2 px-6 py-2.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Home className="w-5 h-5" /> We Deliver.
              </div>
            </div>

            <p className="mt-8 max-w-2xl mx-auto text-lg sm:text-xl text-white/90 leading-relaxed">
              Fast, reliable and affordable pickup and delivery laundry services right at your doorstep.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/login"
                className="px-10 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition shadow-2xl hover:shadow-blue-500/25 text-sm font-semibold flex items-center gap-2 group"
              >
                Book a Pickup
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => scrollTo('services')}
                className="px-10 py-3.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 rounded-full transition"
              >
                Our Services
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm flex flex-col items-center gap-1"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* ====== STATS COUNTERS ====== */}
      <section className="py-16 bg-blue-600 dark:bg-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center text-white"
              >
                <stat.icon className="w-10 h-10 mx-auto mb-3 opacity-80" />
                <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
                <div className="text-sm opacity-80 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section id="howitworks" className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">How It Works</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">Four simple steps to fresh, clean laundry.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition group"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <step.icon className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{step.title}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">{step.desc}</p>
                <div className="mt-4 w-12 h-1 bg-blue-600 rounded-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== SERVICES ====== */}
      <section id="services" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Our Services</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">Laundry & More, We Do It All</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={service.img}
                  alt={service.alt}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <button
                    onClick={() => scrollTo('contact')}
                    className="px-6 py-2.5 bg-white text-gray-900 rounded-full font-medium text-sm hover:bg-gray-100 transition flex items-center gap-2"
                  >
                    Learn More <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => scrollTo('contact')}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition shadow-md hover:shadow-lg"
            >
              View All Services
            </button>
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">What Our Customers Say</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">Real reviews from real people.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{t.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.location}</p>
                  </div>
                </div>
                <div className="flex text-yellow-400 text-lg mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm italic">"{t.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA BANNER ====== */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold">Get 10% Off Your First Order!</h2>
            <p className="mt-2 text-blue-100 text-lg">Book your first pickup today and enjoy the discount.</p>
            <Link
              to="/login"
              className="mt-6 inline-block px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              Book Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={logoImg} alt="Smart Laundry" className="h-8 w-auto" />
                <span className="text-xl font-bold text-white">SmartLaundry</span>
              </div>
              <p className="text-sm text-gray-400">
                Clean clothes, happy life. We take care of your laundry, so you can focus on what really matters.
              </p>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white transition"><FaFacebook className="w-5 h-5" /></a>
                <a href="#" className="text-gray-400 hover:text-white transition"><FaTwitter className="w-5 h-5" /></a>
                <a href="#" className="text-gray-400 hover:text-white transition"><FaInstagram className="w-5 h-5" /></a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollTo('hero')} className="hover:text-blue-400 transition">Home</button></li>
                <li><button onClick={() => scrollTo('services')} className="hover:text-blue-400 transition">Services</button></li>
                <li><button onClick={() => scrollTo('howitworks')} className="hover:text-blue-400 transition">How It Works</button></li>
                <li><button onClick={() => scrollTo('contact')} className="hover:text-blue-400 transition">Contact</button></li>
              </ul>
            </div>

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

            <div>
              <h4 className="text-white font-semibold mb-3">Contact Us</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5" /><span>+254 712 345 678</span></li>
                <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5" /><span>info@smartlaundry.co.ke</span></li>
                <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5" /><span>Nyeri, Kenya</span></li>
                <li className="flex items-start gap-2"><Clock className="w-4 h-4 mt-0.5" /><span>Mon - Sat: 8AM - 8PM</span></li>
                <li className="flex items-start gap-2"><Clock className="w-4 h-4 mt-0.5" /><span>Sun: 9AM - 5PM</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
            &copy; 2025 Smart Laundry. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing