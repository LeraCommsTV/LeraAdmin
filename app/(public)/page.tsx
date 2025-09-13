"use client";

import Image from "next/image";
import { Metadata } from 'next';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SliderClient from "@/components/SliderClient";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { useTheme } from '@/context/ThemeContext';

const metadata: Metadata = {
  title: "Lera Communications - Transforming Narratives, Elevating Impact",
  description: "Empowering Your Brand with Strategic Communication and Innovative Media Solutions",
  keywords: "strategic communication, media solutions, social development, community engagement, CSR initiatives",
  openGraph: {
    title: "Lera Communications - Strategic Communication Solutions",
    description: "Empowering Your Brand with Strategic Communication and Innovative Media Solutions",
    type: "website"
  }
};

// Hero Section with Carousel
function HeroSection() {
  const { isDark } = useTheme();
  const heroSlides = [
    {
      title: "Transforming Narratives, Elevating Impact",
      description: "Empowering your brand with strategic communication and innovative media solutions that drive meaningful change across communities and industries.",
      image: "/images/heroBg.png",
      cta: "Discover Our Solutions"
    },
    {
      title: "Driving Social Change Through Communication",
      description: "Partnering with communities and organizations to create sustainable impact through targeted messaging and authentic storytelling.",
      image: "/images/afro.jpg",
      cta: "Our Impact Stories"
    },
    {
      title: "Innovative Storytelling for Modern Brands",
      description: "Crafting compelling narratives that inspire action, build trust, and connect your brand with audiences that matter most.",
      image: "/images/aboutBg.png",
      cta: "View Our Work"
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    fade: true,
    adaptiveHeight: false,
    pauseOnHover: true,
    dotsClass: "slick-dots custom-dots",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          dots: true,
          arrows: true,
          autoplaySpeed: 5000,
        },
      },
    ],
  };

  return (
    <motion.div
      className="relative w-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <div className="h-screen min-h-[600px] max-h-[900px]">
        <Slider {...settings}>
          {heroSlides.map((slide, index) => (
            <div key={index} className="relative w-full h-full">
              <div
                className="hero-slide text-white flex flex-col justify-center items-center sm:items-start px-4 sm:px-8 md:px-16 lg:px-20 xl:px-24 py-12 sm:py-16 md:py-20 h-screen min-h-[600px] max-h-[900px]"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${slide.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <motion.div
                  className="w-full max-w-5xl text-center sm:text-left z-10"
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 1 }}
                >
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] mb-6 sm:mb-8 tracking-tight text-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="font-light text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-3xl mb-8 sm:mb-10 opacity-95">
                    {slide.description}
                  </p>
                  <motion.button
                    className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 md:py-4 md:px-10 rounded-full text-sm md:text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {slide.cta}
                  </motion.button>
                </motion.div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </motion.div>
  );
}

// About Us Section
function AboutUs() {
  const { isDark } = useTheme();
  return (
    <motion.section
      className={`py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 transition-colors duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto max-w-7xl">
        <div className={`w-full rounded-3xl shadow-xl p-6 sm:p-8 md:p-12 lg:p-16 transition-colors duration-300 ${
          isDark ? 'bg-gray-800 shadow-gray-900/20' : 'bg-white shadow-gray-200/50'
        }`}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            <motion.div
              className="w-full lg:w-[50%] space-y-6 mb-8 lg:mb-0"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              <div className="mb-6">
                <Image
                  src="/images/whoAreWeText.svg"
                  alt="Who We Are"
                  width={320}
                  height={80}
                  className="w-full max-w-[280px] sm:max-w-[320px] h-auto"
                />
              </div>
              <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 ${
                isDark ? 'text-green-400' : 'text-primary'
              }`}>
                Strategic Communication Excellence
              </h2>
              <p className={`leading-relaxed text-sm sm:text-base md:text-lg font-medium mb-6 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Driven by unwavering values of integrity, passion, care, innovation, and 
                excellence, Lera Communications stands at the forefront of strategic 
                communication. We specialize in behavioral impact, brand building, and 
                technical leadership across health and social development sectors.
              </p>
              <div className={`text-sm md:text-base ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <p className="mb-4">Our expertise encompasses:</p>
                <ul className="space-y-2 mb-8">
                  <li>• Strategic brand positioning and messaging</li>
                  <li>• Community engagement and advocacy</li>
                  <li>• Health communication and behavior change</li>
                  <li>• Digital transformation and media innovation</li>
                </ul>
              </div>
              <motion.button 
                className={`w-full sm:w-auto  font-semibold py-3 px-8 md:py-4 md:px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                  isDark 
                    ? 'bg-green-500 hover:bg-green-400 text-white' 
                    : 'bg-primary hover:bg-primary-dark text-green-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More About Us
              </motion.button>
            </motion.div>

            <motion.div
              className="relative w-full lg:w-[45%] flex items-center justify-center"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              <div className="relative">
                <Image
                  src="/images/about-us.png"
                  alt="Strategic Communication Team"
                  width={600}
                  height={500}
                  className="w-full max-w-[400px] md:max-w-[500px] lg:max-w-none rounded-2xl object-cover shadow-2xl"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/10 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

// What's Happening Section with Event Slider
function WhatsHappening() {
  const { isDark } = useTheme();
  const events = [
    {
      title: "Community Health Initiative at Jahi Primary School",
      subtitle: "CSR · HEALTH · EDUCATION",
      description: "Implementing comprehensive health and wellness programs for students and community members in Keffi.",
      image: "/images/assets/events/Event1.jpeg",
      date: "March 2024"
    },
    {
      title: "Gender Equality Summit: Empowering Women in Leadership",
      subtitle: "ADVOCACY · GENDER · LEADERSHIP",
      description: "Renewing our commitment to gender equality through strategic partnerships and community engagement.",
      image: "/images/assets/events/Event2.jpeg",
      date: "February 2024"
    },
    {
      title: "Sustainable Development Goals Community Workshop",
      subtitle: "DEVELOPMENT · COMMUNITY · SUSTAINABILITY",
      description: "Supporting local communities in achieving sustainable development through targeted interventions.",
      image: "/images/assets/events/Event3.jpeg",
      date: "January 2024"
    },
    {
      title: "Women Entrepreneurs Business Acceleration Program",
      subtitle: "BUSINESS · EMPOWERMENT · INNOVATION",
      description: "Providing resources, mentorship, and strategic support to women-led businesses across Nigeria.",
      image: "/images/assets/events/Event4.jpeg",
      date: "December 2023"
    },
  ];

  const eventSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1.2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    centerMode: false,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          dots: true,
          arrows: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1.5,
          arrows: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2.2,
          arrows: true,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3.2,
          arrows: true,
        },
      },
    ],
  };

  return (
    <motion.section
      className={`py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 transition-colors duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 lg:mb-16">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-green-400 font-bold mb-6 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            What's Happening at Lera
          </motion.h2>
          <motion.p
            className={`text-base sm:text-lg md:text-xl leading-relaxed max-w-4xl mx-auto font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            We believe in the transformative power of collaboration and community-driven solutions.
            Our approach centers on partnering with local leaders and communities to deeply
            understand their unique challenges and opportunities. Through active listening and
            collaborative design, we co-create tailored strategies that address pressing needs
            while building lasting partnerships founded on trust, mutual respect, and shared
            commitment to positive change.
          </motion.p>
        </div>
        <motion.div
          className="w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <SliderClient 
            events={events} 
            settings={eventSettings} 
            isEventSlider 
          />
        </motion.div>
      </div>
    </motion.section>
  );
}

// Community Engagement Section
function CommunityEngagement() {
  const { isDark } = useTheme();
  return (
    <motion.div
      className="relative text-white w-full flex flex-col justify-center items-center sm:items-end px-4 sm:px-6 md:px-16 lg:px-20 xl:px-24 py-16 sm:py-20 md:py-24 lg:py-32 min-h-[600px]"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url(/images/largeCommunityBg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="w-full sm:w-[85%] md:w-[70%] lg:w-[60%] text-center sm:text-right z-10"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-green-400 leading-tight mb-6 lg:mb-8 tracking-tight text-shadow-lg">
          Community Engagement & Advocacy
        </h1>
        <p className="text-base sm:text-lg md:text-xl font-light leading-relaxed mb-8 opacity-95 max-w-3xl mx-auto sm:mx-0 sm:ml-auto">
          Our comprehensive community engagement and advocacy services encompass strategic
          community outreach programs, impactful advocacy campaigns, meaningful stakeholder
          engagement, innovative CSR initiatives, and influential public policy advocacy.
        </p>
        <div className="text-sm sm:text-base md:text-lg leading-relaxed mb-8 opacity-90 max-w-3xl mx-auto sm:mx-0 sm:ml-auto">
          <p className="mb-4">We excel in:</p>
          <ul className="space-y-2 text-left sm:text-right">
            <li>• Designing community outreach programs that create lasting impact</li>
            <li>• Building stakeholder relationships across diverse sectors</li>
            <li>• Implementing CSR initiatives that drive meaningful change</li>
            <li>• Advocating for policy reforms that benefit communities</li>
          </ul>
        </div>
        <motion.button
          className="bg-white text-green-600 font-semibold py-3 px-8 md:py-4 md:px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Our Community Work
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// Flagship Section
function FlagShip() {
  const { isDark } = useTheme();
  return (
    <motion.section
      className={`py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 transition-colors duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-green-400 font-bold mb-6 tracking-tight leading-tight">
            Flagship CSR Initiative
          </h2>
          <h3 className={`text-2xl sm:text-3xl md:text-4xl font-semibold ${
            isDark ? 'text-white' : 'text-primary'
          }`}>
            RUGAN ARDO "WASH" PROJECT
          </h3>
        </motion.div>
        
        <div className={`w-full rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 shadow-xl transition-colors duration-300 ${
          isDark ? 'bg-gray-800 shadow-gray-900/20' : 'bg-white shadow-gray-200/50'
        }`}>
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12">
            <motion.div
              className="relative w-full lg:w-[40%] flex items-center justify-center mb-8 lg:mb-0"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              <div className="relative">
                <Image
                  src="/images/businessman.jpg"
                  alt="WASH Project Implementation"
                  width={500}
                  height={400}
                  className="w-full max-w-[400px] md:max-w-[450px] lg:max-w-none rounded-2xl object-cover shadow-2xl"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/10 to-transparent"></div>
              </div>
            </motion.div>
            
            <motion.div
              className="w-full lg:w-[55%] space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <div className={`text-base sm:text-lg leading-relaxed space-y-4 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <p>
                  Many public health challenges facing Nigerian communities—including malnutrition, 
                  malaria, and waterborne diseases—are largely preventable through strategic 
                  intervention and community engagement.
                </p>
                <p>
                  Rural communities across Nigeria face significant barriers to accessing essential 
                  services: safe drinking water, sanitation and hygiene (WASH) facilities, malaria 
                  prevention and treatment, and family planning/childbirth spacing services.
                </p>
                <p>
                  Our research indicates that women in rural areas face unique challenges, with 
                  earlier marriage rates increasing the need for modern family planning services, 
                  yet having significantly lower access to contraceptives compared to their urban 
                  counterparts.
                </p>
              </div>
              
              <div className={`border-l-4 pl-6 my-8 ${
                isDark ? 'border-green-400 bg-gray-700/30' : 'border-text-green-400 bg-primary/5'
              } py-4 rounded-r-lg`}>
                <h4 className={`text-lg font-semibold mb-2 ${
                  isDark ? 'text-green-400' : 'text-green-400'
                }`}>
                  Project Impact Areas:
                </h4>
                <ul className={`space-y-1 text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <li>• Water, Sanitation & Hygiene (WASH) infrastructure</li>
                  <li>• Malaria prevention and treatment programs</li>
                  <li>• Family planning and reproductive health services</li>
                  <li>• Community health education and behavior change</li>
                </ul>
              </div>
              
              <motion.button 
                className={` font-semibold py-3 px-8 md:py-4 md:px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                  isDark 
                    ? 'bg-green-500 hover:bg-green-400 text-white' 
                    : 'bg-primary hover:bg-primary-dark text-green-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More About This Project
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

// Partners Section
function Partners() {
  const { isDark } = useTheme();
  const partners = [
    "/images/assets/patners/Patner1.svg",
    "/images/assets/patners/Patner2.svg",
    "/images/assets/patners/Patner3.svg",
    "/images/assets/patners/Patner1.svg",
    "/images/assets/patners/Patner2.svg",
    "/images/assets/patners/Patner3.svg",
    "/images/assets/patners/Patner1.svg",
  ];

  const partnerSettings = {
    dots: true,
    infinite: true,
    speed: 200,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
    arrows: false,
    centerMode: true,
    centerPadding: "30px",
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.5,
          centerPadding: "20px",
          dots: false,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          centerPadding: "25px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          centerPadding: "30px",
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          centerPadding: "40px",
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
          centerPadding: "50px",
        },
      },
    ],
  };

  return (
    <motion.section
      className={`py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 transition-colors duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-green-400 font-bold mb-6 tracking-tight">
            Strategic Partners
          </h2>
          <p className={`text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Collaborating with leading organizations to amplify impact and drive sustainable change across communities.
          </p>
        </motion.div>
        <motion.div
          className="w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <SliderClient 
            partners={partners} 
            settings={partnerSettings} 
          />
        </motion.div>
      </div>
    </motion.section>
  );
}

// Main Page Component
export default function HomePage() {
  const { isDark } = useTheme();

  return (
    <main className={`transition-colors duration-300 min-h-screen ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <HeroSection />
      <AboutUs />
      <WhatsHappening />
      <CommunityEngagement />
      <FlagShip />
      <Partners />
    </main>
  );
}