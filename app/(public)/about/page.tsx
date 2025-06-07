"use client";
import React, { useState, useEffect } from "react";
import { Target, Eye, Users, Lightbulb, Heart, Award, Zap, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// AboutHome Component
const AboutHome = () => {
  return (
    <motion.div
      className="about-home text-white flex md:justify-center justify-start items-end pt-28 md:px-28 px-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="pt-12">
        {/* About Header */}
        <div>
          <motion.h2
            className="text-3xl md:text-4xl font-light mb-2 md:text-center text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            About Lera
          </motion.h2>
          <motion.p
            className="leading-relaxed max-w-3xl mx-auto md:text-center text-left font-light text-sm"
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
        {/* Bottom */}
        <motion.div
          className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-t-white py-8 mt-14"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {/* Mission Section */}
          <div>
            <motion.div
              className="flex gap-4 items-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div
                className="w-12 h-12 text-white rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                <Target size={30} />
              </div>
              <h3 className="text-xl font-light">
                Our <br /> Mission
              </h3>
            </motion.div>
            <motion.p
              className="mt-2 font-light text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              To be the leading strategic communications and media consulting
              company in Nigeria, driving impactful narratives and innovative
              media solutions that inspire, inform, and transform societies.
            </motion.p>
          </div>

          {/* Vision Section */}
          <div>
            <motion.div
              className="flex gap-4 items-center"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div
                className="w-12 h-12 text-white rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                <Eye size={30} />
              </div>
              <h3 className="text-xl font-light">
                Our <br /> Vision
              </h3>
            </motion.div>
            <motion.p
              className="mt-2 font-light text-xs"
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
        </motion.div>
      </div>
    </motion.div>
  );
};

// CompanyValues Component
const CompanyValues = () => {
  const values = [
    {
      icon: <Lightbulb size={30} />,
      title: "Innovation",
      description: "We are creative, always learning, versatile, and cutting edge.",
    },
    {
      icon: <Heart size={30} />,
      title: "Integrity",
      description: "We maintain the highest ethical standards in all our communications.",
    },
    {
      icon: <Award size={30} />,
      title: "Excellence",
      description: "We deliver outstanding results that exceed client expectations.",
    },
    {
      icon: <Zap size={30} />,
      title: "Impact",
      description: "We create meaningful change through strategic communication.",
    },
  ];

  return (
    <motion.div
      className="bg-green-600 dark:bg-green-800 text-white py-12 md:px-16 px-8"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        className="md:text-center text-xl font-light mb-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Company Values
      </motion.h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-center justify-center">
        {values.map((value, index) => (
          <motion.div
            key={index}
            className={`px-5 ${index !== 0 && "md:border-l md:border-l-white"}`}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 * (index + 1), duration: 0.6 }}
          >
            <div
              className="w-14 h-14 text-white rounded-full flex items-center justify-center mb-4"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              }}
            >
              {value.icon}
            </div>
            <h3 className="text-lg font-bold">{value.title}</h3>
            <p className="text-xs mt-2">{value.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Team Component (with Carousel)
const Team = () => {
  const teamMembers = [
    {
      name: "John Doe",
      position: "CEO & Founder",
      bio: "Strategic communications expert with over 15 years of experience.",
    },
    {
      name: "Jane Smith",
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
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 py-16 md:px-16 px-8"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-light mb-2 text-center text-gray-800 dark:text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Our Team
        </motion.h2>
        <motion.p
          className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Meet the talented professionals who bring our vision to life through creativity, expertise, and dedication.
        </motion.p>
        <Slider {...settings}>
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="px-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center h-full">
                <div className="w-20 h-20 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={40} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{member.name}</h3>
                <p className="text-green-600 dark:text-green-400 font-medium mb-3">{member.position}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </Slider>
      </div>
    </motion.div>
  );
};

// Main About Page Component
export default function AboutPage() {
  const [theme, setTheme] = useState<"dark" | "light">("light");

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Theme Toggle Button - Centered at top */}
      <motion.div
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={toggleTheme}
          className="p-3 rounded-lg bg-green-600 text-white shadow-lg hover:bg-green-700 transition-colors duration-300"
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? <Moon size={24} /> : <Sun size={24} />}
        </button>
      </motion.div>

      {/* Hero Section with Background Image */}
      <div
        className="relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "600px",
        }}
      >
        <AboutHome />
      </div>

      {/* Company Values Section */}
      <CompanyValues />

      {/* Team Section */}
      <Team />

      {/* Call to Action Section */}
      <motion.div
        className="bg-gray-900 dark:bg-gray-800 text-white py-16 px-8 text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-3xl font-light mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Ready to Transform Your Communications?
          </motion.h2>
          <motion.p
            className="text-lg mb-8 text-gray-300"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Let's work together to create impactful narratives that drive results for your organization.
          </motion.p>
          <motion.button
            className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
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