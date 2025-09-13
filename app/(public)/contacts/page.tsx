"use client"
import React, { useState, useEffect } from "react"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useTheme } from '@/context/ThemeContext';

// Animation Hook
const useInView = () => {
  const [isInView, setIsInView] = useState(false)
  const [element, setElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [element])

  return [setElement, isInView] as const
}

// Testimonials Carousel Component
const TestimonialsCarousel = () => {
  const { isDark } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0)
  const [setRef, isInView] = useInView()

  const testimonials = [
    {
      name: "Sarah Johnson",
      position: "CEO, TechCorp Nigeria",
      content:
        "Lera Communications transformed our brand narrative completely. Their strategic approach and deep understanding of the Nigerian market helped us achieve unprecedented growth.",
      rating: 5,
    },
    {
      name: "Dr. Ahmed Bello",
      position: "Director, Health Initiative",
      content:
        "During our crisis communication challenge, Lera's team was exceptional. They managed the situation professionally and restored public confidence in our organization.",
      rating: 5,
    },
    {
      name: "Maria Okafor",
      position: "Founder, Green Energy Solutions",
      content:
        "The digital media solutions provided by Lera Communications significantly boosted our online presence. Their creativity and expertise are unmatched.",
      rating: 5,
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      ref={setRef}
      className={`bg-gradient-to-br from-green-600 via-green-500 to-green-700 dark:from-green-700 dark:via-green-600 dark:to-green-800 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden transform transition-all duration-1000 ${
        isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
      <h3 className="text-xl font-bold mb-6 text-center">What Our Clients Say</h3>

      <div className="relative min-h-[180px]">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? "opacity-100 transform translate-x-0 scale-100"
                : "opacity-0 transform translate-x-8 scale-95"
            }`}
          >
            <div className="text-center">
              <div className="flex justify-center mb-4 space-x-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-yellow-400 fill-current animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
              <blockquote className="text-sm italic mb-4 leading-relaxed font-medium">
                "{testimonial.content}"
              </blockquote>
              <div className="space-y-1">
                <p className="font-bold text-lg">{testimonial.name}</p>
                <p className="text-green-100 text-sm opacity-90">{testimonial.position}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={prevSlide}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-110"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-110"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

// Services Carousel Component
const ServicesCarousel = () => {
  const { isDark } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0)
  const [setRef, isInView] = useInView()

  const services = [
    {
      title: "Strategic Communications",
      description: "Comprehensive strategic planning and execution for your communication needs.",
      icon: "💡",
    },
    {
      title: "Media Relations & PR",
      description: "Building strong relationships with media outlets and managing public perception.",
      icon: "📰",
    },
    {
      title: "Crisis Communication",
      description: "Expert crisis management to protect and restore your organization's reputation.",
      icon: "🛡️",
    },
    {
      title: "Digital Media Solutions",
      description: "Innovative digital strategies to enhance your online presence and engagement.",
      icon: "📱",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % services.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + services.length) % services.length)
  }

  return (
    <div
      ref={setRef}
      className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transform transition-all duration-1000 ${
        isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white text-center">Our Services</h3>

      <div className="relative min-h-[140px]">
        {services.map((service, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? "opacity-100 transform translate-x-0 scale-100"
                : "opacity-0 transform translate-x-8 scale-95"
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-4 animate-bounce">{service.icon}</div>
              <h4 className="font-bold text-gray-800 dark:text-white mb-3 text-lg">{service.title}</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{service.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={prevSlide}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-110"
        >
          <ChevronLeft size={18} className="text-gray-600 dark:text-gray-300" />
        </button>

        <div className="flex gap-2">
          {services.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-green-600 dark:bg-green-500 scale-125"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-110"
        >
          <ChevronRight size={18} className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </div>
  )
}

// Google Maps Component
const GoogleMap = () => {
  const { isDark } = useTheme();
  const [setRef, isInView] = useInView()

  return (
    <div
      ref={setRef}
      className={`w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl overflow-hidden shadow-xl flex items-center justify-center transform transition-all duration-1000 ${
        isInView ? "translate-y-0 opacity-100 scale-100" : "translate-y-12 opacity-0 scale-95"
      }`}
    >
      <div className="text-center p-8">
        <div className="text-6xl mb-4 animate-pulse">🗺️</div>
        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">Interactive Map</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          No 72, Birnin Kebbi Crescent
          <br />
          Garki, Abuja, Nigeria
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">
          <MapPin size={16} />
          Visit Our Office
        </div>
      </div>
    </div>
  )
}

// Contact Hero Component
const ContactHome = () => {
  return (
    <div
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(16, 185, 129, 0.8), rgba(6, 95, 70, 0.9)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="animate-fade-in-up">
          <p className="font-bold uppercase text-green-300 tracking-wider text-sm mb-4 animate-pulse">Contact us</p>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-white">Let's hear from you</h1>
          <p className="text-xl text-gray-100 leading-relaxed max-w-2xl mx-auto">
            Ready to transform your communications strategy? Get in touch with our team of experts.
          </p>
        </div>
      </div>
    </div>
  )
}

// Contact Form Component with Firebase Integration
const ContactForm = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [setRef, isInView] = useInView()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Add document to Firebase Firestore
      await addDoc(collection(db, "contact"), {
        ...formData,
        timestamp: serverTimestamp(),
        status: "new",
      })

      setIsSubmitted(true)

      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          message: "",
        })
      }, 5000)
    } catch (err) {
      console.error("Error submitting form:", err)
      setError("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="animate-bounce">
            <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Thank You!</h3>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Your message has been sent successfully. We'll get back to you soon.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`py-20 px-6 md:px-12 lg:px-20 transition-colors duration-500 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div
          ref={setRef}
          className={`mb-12 transform transition-all duration-1000 ${
            isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="inline-block mb-6">
            <span className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wide ${
              isDark 
                ? 'bg-green-900 text-green-300' 
                : 'bg-green-100 text-green-700'
            }`}>
              Connect with us
            </span>
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>Get in Touch</h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {/* Form Section */}
          <div
            className={`p-8 lg:p-10 rounded-2xl shadow-2xl border transform transition-all duration-1000 delay-200 ${
              isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-100'
            } ${isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          >
            <h2 className={`text-2xl font-bold mb-8 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>Send us a message</h2>

            {error && (
              <div className={`mb-6 p-4 border rounded-lg ${
                isDark 
                  ? 'bg-red-900/20 border-red-800' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className={`text-sm ${
                  isDark ? 'text-red-400' : 'text-red-600'
                }`}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="group">
                  <label className={`block text-sm font-semibold mb-3 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-4 rounded-xl border-2 text-gray-700 dark:text-white focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 group-hover:border-gray-300 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 dark:group-hover:border-gray-500' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="group">
                  <label className={`block text-sm font-semibold mb-3 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-4 rounded-xl border-2 text-gray-700 dark:text-white focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 group-hover:border-gray-300 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 dark:group-hover:border-gray-500' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="group">
                <label className={`block text-sm font-semibold mb-3 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full p-4 rounded-xl border-2 text-gray-700 dark:text-white focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 group-hover:border-gray-300 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 dark:group-hover:border-gray-500' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                  placeholder="Enter your email address"
                />
              </div>

              <div className="group">
                <label className={`block text-sm font-semibold mb-3 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className={`w-full p-4 rounded-xl border-2 text-gray-700 dark:text-white focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 resize-none group-hover:border-gray-300 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 dark:group-hover:border-gray-500' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                  placeholder="Tell us about your project or inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-green-400 disabled:to-green-300 text-white font-bold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info Section */}
          <div className="space-y-8">
            {/* Company Info Card */}
            <div
              className={`p-8 lg:p-10 border-2 rounded-2xl shadow-2xl transform transition-all duration-1000 delay-300 ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-100'
              } ${isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
            >
              <h3 className={`text-2xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>About Lera Communications</h3>
              <p className={`text-sm leading-relaxed border-b pb-6 mb-8 ${
                isDark 
                  ? 'text-gray-300 border-gray-700' 
                  : 'text-gray-600 border-gray-200'
              }`}>
                Lera Communications is a strategic and development communications firm based in Nigeria. We offer
                comprehensive media and communication solutions to drive impactful narratives and innovative strategies
                for organizations across various sectors.
              </p>

              <div className="space-y-6">
                {[
                  { icon: MapPin, title: "Address", content: "No 72, Birnin Kebbi Crescent, Garki, Abuja, Nigeria" },
                  { icon: Phone, title: "Phone", content: "+234 806 775 0659" },
                  { icon: Mail, title: "Email", content: "info@leracommunications.com" },
                  {
                    icon: Clock,
                    title: "Business Hours",
                    content: "Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 2:00 PM",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className={`p-3 rounded-full ${
                      isDark 
                        ? 'bg-green-900 text-green-400 group-hover:bg-green-800' 
                        : 'bg-green-100 text-green-600 group-hover:bg-green-200'
                    } transition-colors duration-300`}>
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className={`font-bold mb-1 ${
                        isDark ? 'text-white' : 'text-gray-800'
                      }`}>{item.title}</p>
                      <p className={`text-sm leading-relaxed whitespace-pre-line ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Services Carousel */}
            <ServicesCarousel />

            {/* Testimonials Carousel */}
            <TestimonialsCarousel />
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Contact Page Component
export default function ContactPage() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'
    }`}>
      {/* Hero Section */}
      <ContactHome />

      {/* Contact Form and Info */}
      <ContactForm />

      {/* Map Section */}
      <div className={`py-20 px-6 md:px-12 lg:px-20 transition-colors duration-500 ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>Visit Our Office</h2>
            <p className={`max-w-3xl mx-auto text-lg leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Located in the heart of Abuja, our office is easily accessible and we welcome visitors by appointment.
              Contact us to schedule a meeting.
            </p>
          </div>
          <GoogleMap />
        </div>
      </div>

      {/* FAQ Section */}
      <div className={`py-20 px-6 md:px-12 lg:px-20 transition-colors duration-500 ${
        isDark ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <div className="max-w-5xl mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-16 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                question: "What services does Lera Communications offer?",
                answer:
                  "We provide comprehensive strategic communications, media relations, corporate communications, crisis management, content development, and digital media solutions.",
              },
              {
                question: "How quickly can you respond to communication crises?",
                answer:
                  "We offer 24/7 crisis communication support and can mobilize our team within hours to address urgent communication needs.",
              },
              {
                question: "Do you work with organizations outside Nigeria?",
                answer:
                  "Yes, while based in Nigeria, we work with clients across Africa and internationally, leveraging our local expertise and global perspective.",
              },
            ].map((faq, index) => {
              const [setRef, isInView] = useInView()
              return (
                <div
                  key={index}
                  ref={setRef}
                  className={`p-8 rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-500 transform ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-white border-gray-100'
                  } ${isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <h3 className={`font-bold mb-3 text-lg ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}>{faq.question}</h3>
                  <p className={`leading-relaxed ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>{faq.answer}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}