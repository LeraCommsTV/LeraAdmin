"use client";
import React, { useState, useEffect } from "react";
import { Target, Eye, Users, Lightbulb, Heart, Award, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTheme } from '@/context/ThemeContext';

// AboutHome Component
const AboutHome = () => {
  return (
    <motion.div
      className="about-home text-white flex flex-col md:flex-row md:justify-center justify-start items-end pt-12 md:pt-28 px-4 sm:px-8 md:px-28 min-h-[500px] md:min-h-[600px]"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="w-full md:w-auto pt-8 md:pt-12">
        {/* About Header */}
        <div className="text-left md:text-center mb-8 md:mb-0">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-light mb-2 leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            About Lera
          </motion.h2>
          <motion.p
            className="leading-relaxed max-w-3xl mx-auto text-sm sm:text-base font-light tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Lera Communications is a strategic and development communications
            firm based in Nigeria. We offer a wide range of media and
            communication solutions to individuals, corporate organizations, and
            various industries, including government, corporate, film, and news.
            Our team is composed of highly creative and detail-oriented
            professionals, and we provide extensive training to ensure top-tier
            service delivery
          </motion.p>
        </div>
        {/* Bottom Mission/Vision */}
        <motion.div
          className="w-full relative container mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 border-t border-t-white/80 py-6 sm:py-8 mt-8 sm:mt-14 bg-black/50 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {/* Mission Section */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center py-2">
            <motion.div
              className="flex-shrink-0"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 text-white rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                <Target size={24} className="sm:w-6 sm:h-6" />
              </div>
            </motion.div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-light leading-tight">
                Our <br className="sm:hidden" /> Mission
              </h3>
              <motion.p
                className="mt-1 sm:mt-2 font-light text-xs sm:text-sm leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                To be the leading strategic communications and media consulting
                company in Nigeria, driving impactful narratives and innovative
                media solutions that inspire, inform, and transform societies.
              </motion.p>
            </div>
          </div>

          {/* Vision Section */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center py-2">
            <motion.div
              className="flex-shrink-0"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 text-white rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                <Eye size={24} className="sm:w-6 sm:h-6" />
              </div>
            </motion.div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-light leading-tight">
                Our <br className="sm:hidden" /> Vision
              </h3>
              <motion.p
                className="mt-1 sm:mt-2 font-light text-xs sm:text-sm leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                Leveraging technology and storytelling to engage audiences,
                foster social progress, build impactful partnerships, and
                continuously develop our team's talent for excellence,
                innovation, and integrity.
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// CompanyValues Component
const CompanyValues = () => {
  const { isDark } = useTheme();
  const values = [
    {
      icon: <Lightbulb size={24} className="sm:w-6 sm:h-6" />,
      title: "Innovation",
      description: "We are creative, always learning, versatile, and cutting edge.",
    },
    {
      icon: <Heart size={24} className="sm:w-6 sm:h-6" />,
      title: "Integrity",
      description: "We maintain the highest ethical standards in all our communications.",
    },
    {
      icon: <Award size={24} className="sm:w-6 sm:h-6" />,
      title: "Excellence",
      description: "We deliver outstanding results that exceed client expectations.",
    },
    {
      icon: <Zap size={24} className="sm:w-6 sm:h-6" />,
      title: "Impact",
      description: "We create meaningful change through strategic communication.",
    },
  ];

  return (
    <motion.div
      className={`text-white py-8 sm:py-12 px-4 sm:px-8 md:px-16 transition-colors duration-300 ${
        isDark ? 'bg-green-800' : 'bg-green-600'
      }`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        className="text-center text-xl sm:text-2xl md:text-3xl font-light mb-6 sm:mb-8 tracking-wide"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Company Values
      </motion.h2>
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 items-start justify-items-center">
        {values.map((value, index) => (
          <motion.div
            key={index}
            className={`w-full px-3 sm:px-5 text-center ${
              index !== 0 && "hidden md:block border-l border-white/50"
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 * (index + 1), duration: 0.6 }}
          >
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 text-white rounded-full flex items-center justify-center mb-3 sm:mb-4 mx-auto"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              }}
            >
              {value.icon}
            </div>
            <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2 leading-tight">{value.title}</h3>
            <p className="text-xs sm:text-sm leading-relaxed">{value.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Team Component (with Carousel)
const Team = () => {
  const { isDark } = useTheme();
  const teamMembers = [
    {
      name: "Charles Doke",
      position: "CEO & Founder",
      bio: "Strategic communications expert with over 15 years of experience.",
    },
    {
      name: "Kelechi Obinna",
      position: "Creative Director",
      bio: "Award-winning creative professional specializing in brand storytelling.",
    },
    {
      name: "Mike Johnson",
      position: "Media Relations Manager",
      bio: "Experienced journalist with deep media industry connections.",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Start with 1 for mobile
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false, // Hide arrows on mobile for cleaner look
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          arrows: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          arrows: true,
        },
      },
    ],
  };

  return (
    <motion.div
      className={`py-12 sm:py-16 px-4 sm:px-8 md:px-16 transition-colors duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto max-w-6xl">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-light mb-2 text-center tracking-wide"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Our Team
        </motion.h2>
        <motion.p
          className={`text-center text-sm sm:text-base mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Meet the talented professionals who bring our vision to life through creativity, expertise, and dedication.
        </motion.p>
        <div className="px-2 sm:px-4"> {/* Add padding for mobile slider */}
          <Slider {...settings}>
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="px-2 sm:px-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className={`rounded-lg shadow-lg p-4 sm:p-6 text-center h-full transition-colors duration-300 ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-4">
                    <Users size={32} className="sm:w-10 sm:h-10 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 leading-tight">{member.name}</h3>
                  <p className={`font-medium mb-3 text-sm sm:text-base ${
                    isDark ? 'text-green-400' : 'text-green-600'
                  }`}>{member.position}</p>
                  <p className={`text-sm leading-relaxed ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </Slider>
        </div>
      </div>
    </motion.div>
  );
};

// Main About Page Component
export default function AboutPage() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-white'
    }`}>
      {/* Hero Section with Background Image */}
      <AboutHome />

      {/* Company Values Section */}
      <CompanyValues />

      {/* Team Section */}
      <Team />

      {/* Call to Action Section */}
      <motion.div
        className={`py-12 sm:py-16 px-4 sm:px-8 text-center transition-colors duration-300 ${
          isDark ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'
        }`}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-2xl sm:text-3xl font-light mb-4 leading-tight"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Ready to Transform Your Communications?
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg mb-6 sm:mb-8 text-gray-300 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Let's work together to create impactful narratives that drive results for your organization.
          </motion.p>
          <motion.button
            className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold py-3 px-6 sm:px-8 rounded-lg transition-all duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            Get In Touch
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}