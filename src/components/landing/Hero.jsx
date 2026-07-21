import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Truck, Sparkles, Home } from 'lucide-react'
import coverImg from '../../assets/images/cover.png'

const Hero = () => {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={coverImg}
          alt="Clean laundry hero"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Decorative floating shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <span className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4 border border-white/20">
            Premium Laundry Service
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
            <span className="block">Clean Clothes.</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 animate-gradient">
              Fresh Life.
            </span>
          </h1>

          <div className="mt-6 flex flex-wrap justify-center gap-4 text-lg sm:text-xl font-medium">
            <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full border border-white/10">
              <Truck className="w-5 h-5" /> We Pickup.
            </span>
            <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full border border-white/10">
              <Sparkles className="w-5 h-5" /> We Clean.
            </span>
            <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full border border-white/10">
              <Home className="w-5 h-5" /> We Deliver.
            </span>
          </div>

          <p className="mt-8 max-w-2xl mx-auto text-base sm:text-lg text-white/90 leading-relaxed">
            Fast, reliable and affordable pickup and delivery laundry services right at your doorstep.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/login"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition shadow-lg hover:shadow-xl text-sm font-semibold flex items-center gap-2 group"
            >
              Book a Pickup
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={() => scrollTo('services')}
              className="px-8 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 rounded-full transition"
            >
              Our Services
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm flex flex-col items-center gap-1"
      >
        <span className="text-xs uppercase tracking-wider">Scroll</span>
        <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  )
}

export default Hero