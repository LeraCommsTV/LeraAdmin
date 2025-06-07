"use client"
import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Sun, Moon, ChevronLeft, ChevronRight, Star } from 'lucide-react';

// Theme Context
const ThemeContext = React.createContext<{ isDark: boolean; toggleTheme: () => void }>({
  isDark: false,
  toggleTheme: () => {},
});

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={isDark ? 'dark' : ''}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// Theme Toggle Component
const ThemeToggle = () => {
  const { isDark, toggleTheme } = React.useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className=" rounded-lg bg-green-600 text-white shadow-lg hover:bg-green-700 transition-colors duration-300 fixed top-6 left-60 md:top-4 md:right-160 md:left-auto z-50 p-3 rounded-lg bg-green-600 dark:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-600 dark:border-green-700"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun size={20} className="text-white" />
      ) : (
        <Moon size={20} className="text-white" />
      )}
    </button>
  );
};

// Testimonials Carousel Component
const TestimonialsCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const testimonials = [
    {
      name: "Sarah Johnson",
      position: "CEO, TechCorp Nigeria",
      content: "Lera Communications transformed our brand narrative completely. Their strategic approach and deep understanding of the Nigerian market helped us achieve unprecedented growth.",
      rating: 5
    },
    {
      name: "Dr. Ahmed Bello",
      position: "Director, Health Initiative",
      content: "During our crisis communication challenge, Lera's team was exceptional. They managed the situation professionally and restored public confidence in our organization.",
      rating: 5
    },
    {
      name: "Maria Okafor",
      position: "Founder, Green Energy Solutions",
      content: "The digital media solutions provided by Lera Communications significantly boosted our online presence. Their creativity and expertise are unmatched.",
      rating: 5
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-green-600 dark:bg-green-700 text-white p-8 rounded-xl shadow-lg relative overflow-hidden">
      <h3 className="text-xl font-semibold mb-6 text-center">What Our Clients Say</h3>
      
      <div className="relative min-h-[200px]">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-500 ${
              index === currentSlide ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-full'
            }`}
          >
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-sm italic mb-4 leading-relaxed">
                "{testimonial.content}"
              </blockquote>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-green-100 text-xs">{testimonial.position}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={prevSlide}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// Services Carousel Component
const ServicesCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const services = [
    {
      title: "Strategic Communications",
      description: "Comprehensive strategic planning and execution for your communication needs.",
      icon: "💡"
    },
    {
      title: "Media Relations & PR",
      description: "Building strong relationships with media outlets and managing public perception.",
      icon: "📰"
    },
    {
      title: "Crisis Communication",
      description: "Expert crisis management to protect and restore your organization's reputation.",
      icon: "🛡️"
    },
    {
      title: "Digital Media Solutions",
      description: "Innovative digital strategies to enhance your online presence and engagement.",
      icon: "📱"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % services.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + services.length) % services.length);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white text-center">Our Services</h3>
      
      <div className="relative min-h-[150px]">
        {services.map((service, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-500 ${
              index === currentSlide ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-full'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">{service.title}</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{service.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={prevSlide}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <ChevronLeft size={16} className="text-gray-600 dark:text-gray-300" />
        </button>
        
        <div className="flex gap-2">
          {services.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide 
                  ? 'bg-green-600 dark:bg-green-500' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <ChevronRight size={16} className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
};

// Extend Window interface for initMap
declare global {
  interface Window {
    initMap: () => void;
  }
}

// Google Maps Component
const GoogleMap = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  
  useEffect(() => {
    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    window.initMap = () => {
      const mapElement = document.getElementById('map');
      if (!mapElement) return;
      const map = new window.google.maps.Map(mapElement, {
        center: { lat: 9.0579, lng: 7.4951 }, // Garki, Abuja coordinates
        zoom: 15,
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry.fill',
            stylers: [{ color: '#f5f5f5' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#c9c9c9' }]
          }
        ]
      });

      const marker = new window.google.maps.Marker({
        position: { lat: 9.0579, lng: 7.4951 },
        map: map,
        title: 'Lera Communications',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#16a34a" stroke="white" stroke-width="2"/>
              <path d="M20 8c-4.4 0-8 3.6-8 8 0 5.3 8 16 8 16s8-10.7 8-16c0-4.4-3.6-8-8-8zm0 11c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" fill="white"/>
            </svg>
          `)
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; font-family: Arial, sans-serif;">
            <h3 style="margin: 0 0 5px 0; color: #16a34a;">Lera Communications</h3>
            <p style="margin: 0; font-size: 14px;">No 72, Birnin Kebbi Crescent<br>Garki, Abuja, Nigeria</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      setMapLoaded(true);
    };

    if (!window.google) {
      document.head.appendChild(script);
    } else {
      window.initMap();
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  if (!mapLoaded && !window.google) {
    return (
      <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading Google Maps...</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Note: Replace YOUR_API_KEY with your actual Google Maps API key
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden shadow-lg">
      <div id="map" className="w-full h-full"></div>
    </div>
  );
};

// Contact Hero Component
const ContactHome = () => {
  return (
    <div 
      className="relative min-h-[60vh] flex items-center justify-start"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="w-full flex flex-col justify-center items-start md:px-20 px-8 text-white">
        <div className="max-w-2xl">
          <p className="font-bold uppercase text-green-400 tracking-wider text-xs mb-4">
            Contact us
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Let's hear from you
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed">
            Ready to transform your communications strategy? Get in touch with our team of experts.
          </p>
        </div>
      </div>
    </div>
  );
};

// Contact Form Component
const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
      });
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Thank You!</h3>
          <p className="text-gray-600 dark:text-gray-300">Your message has been sent successfully. We'll get back to you soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-14 px-12 md:px-28 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div>
        <div className="mb-6">
          <button className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold uppercase">
            CONNECT WITH US
          </button>
        </div>
        <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white">Get in Touch</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl w-full">
        {/* Form Section */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transition-colors">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Send us a message</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Enter your email address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                placeholder="Tell us about your project or inquiry..."
              />
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </button>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="space-y-8">
          {/* Company Info Card */}
          <div className="bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg transition-colors">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">About Lera Communications</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
              Lera Communications is a strategic and development communications firm based in Nigeria. 
              We offer comprehensive media and communication solutions to drive impactful narratives 
              and innovative strategies for organizations across various sectors.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white text-sm">Address</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">No 72, Birnin Kebbi Crescent, Garki, Abuja, Nigeria</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white text-sm">Phone</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">+234 806 775 0659</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white text-sm">Email</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">info@leracommunications.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white text-sm">Business Hours</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Saturday: 10:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services Carousel */}
          <ServicesCarousel />

          {/* Testimonials Carousel */}
          <TestimonialsCarousel />
        </div>
      </div>
    </div>
  );
};

// Main Contact Page Component
export default function ContactPage() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <ThemeToggle />
        
        {/* Hero Section */}
        <ContactHome />
        
        {/* Contact Form and Info */}
        <ContactForm />
        
        {/* Map Section */}
        <div className="py-16 px-12 md:px-28 bg-white dark:bg-gray-900 transition-colors">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Visit Our Office</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Located in the heart of Abuja, our office is easily accessible and we welcome 
                visitors by appointment. Contact us to schedule a meeting.
              </p>
            </div>
            <GoogleMap />
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="bg-gray-50 dark:bg-gray-800 py-16 px-12 md:px-28 transition-colors">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  question: "What services does Lera Communications offer?",
                  answer: "We provide comprehensive strategic communications, media relations, corporate communications, crisis management, content development, and digital media solutions."
                },
                {
                  question: "How quickly can you respond to communication crises?",
                  answer: "We offer 24/7 crisis communication support and can mobilize our team within hours to address urgent communication needs."
                },
                {
                  question: "Do you work with organizations outside Nigeria?",
                  answer: "Yes, while based in Nigeria, we work with clients across Africa and internationally, leveraging our local expertise and global perspective."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow transition-colors">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{faq.question}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}