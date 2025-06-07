"use client";

import Image from "next/image";
import { Metadata } from 'next';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import SliderClient from "@/components/SliderClient";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";

const metadata: Metadata = {
  title: "Lera Communications - Transforming Narratives, Elevating Impact",
  description: "Empowering Your Brand with Strategic Communication and Innovative Media Solutions",
};

// Hero Section with Carousel
function HeroSection() {
  const heroSlides = [
    {
      title: "Transforming Narratives, Elevating Impact",
      description: "Empowering Your Brand with Strategic Communication and Innovative Media Solutions",
      image: "/images/heroBg.png",
    },
    {
      title: "Driving Social Change",
      description: "Partnering with communities for sustainable impact",
      image: "/images/afro.jpg",
    },
    {
      title: "Innovative Storytelling",
      description: "Crafting compelling narratives that inspire action",
      image: "/images/aboutBg.png",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
  };

  return (
    <motion.div
      className="relative min-h-screen w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Slider {...settings}>
        {heroSlides.map((slide, index) => (
          <div key={index} className="relative min-h-screen">
            <div
              className="hero-slide text-white flex flex-col justify-center md:px-20 px-4"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minHeight: "100vh",
              }}
            >
              <motion.div
                className="md:w-[40%] w-[80%]"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-4">{slide.title}</h1>
                <p className="font-mono text-sm md:text-base font-light">{slide.description}</p>
              </motion.div>
            </div>
          </div>
        ))}
      </Slider>
    </motion.div>
  );
}

// About Us Section
function AboutUs() {
  return (
    <motion.section
      className="py-16 md:px-8 px-4 bg-white dark:bg-white"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="w-full bg-white dark:bg-gray-800 flex flex-col md:flex-row items-center justify-between p-6 md:p-8 rounded-2xl shadow-md">
        <motion.div
          className="w-full md:w-[48%] space-y-4 mb-8 md:mb-0"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Image
            src="/images/whoAreWeText.svg"
            alt="Strategic Communication"
            width={300}
            height={100}
            className="rounded-lg"
          />
          <h2 className="text-2xl md:text-3xl font-medium text-primary dark:text-green-400">
            We are a Strategic Communication firm
          </h2>
          <p className="leading-relaxed font-mono text-xs md:text-sm font-semibold text-gray-900 dark:text-gray-300">
            Driven by values of integrity, passion, care, innovation, and
            excellence, Lera focuses on the central role of strategic
            communication to impact behaviors, build brands, and provide
            technical leadership in health and social development.
          </p>
          <button className="bg-primary dark:bg-green-500 text-white font-medium py-2 px-8 rounded-full font-mono md:block hidden hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-200">
            About Us
          </button>
        </motion.div>

        <motion.div
          className="relative w-full md:w-[48%] flex items-center justify-end"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Image
            src="/images/about-us.png"
            alt="Strategic Communication"
            width={500}
            height={400}
            className="rounded-lg"
          />
        </motion.div>
      </div>
    </motion.section>
  );
}

// What's Happening Section with Event Slider
function WhatsHappening() {
  const events = [
    {
      title: "Lera CSR at Jahi Primary School, Keffi",
      subtitle: "EVENT · FEATURED",
      image: "/images/assets/events/Event1.jpeg",
    },
    {
      title: "Lera Renew Commitment to Gender Equality",
      subtitle: "EVENT · FEATURED",
      image: "/images/assets/events/Event2.jpeg",
    },
    {
      title: "Lera Supports Community Development",
      subtitle: "EVENT · FEATURED",
      image: "/images/assets/events/Event3.jpeg",
    },
    {
      title: "Lera Empowering Women Entrepreneurs",
      subtitle: "EVENT · FEATURED",
      image: "/images/assets/events/Event4.jpeg",
    },
  ];

  const eventSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3.5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1.5,
        },
      },
    ],
  };

  return (
    <motion.section
      className="py-16 bg-white dark:bg-white md:px-8 px-4"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        className="text-xl md:text-4xl font-bold text-black dark:text-black md:text-center text-left mb-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        What's Happening at Lera
      </motion.h2>
      <motion.p
        className="text-black dark:text-black leading-relaxed max-w-3xl mx-auto md:text-center text-left font-mono font-semibold text-xs md:text-sm mb-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        We believe in the power of collaboration and community-driven solutions.
        That's why we partner with local leaders and communities to deeply
        understand their unique challenges and opportunities. By listening to
        their voices and insights, we co-create tailored approaches that address
        their most pressing needs and priorities. Our partnerships are built on
        trust, mutual respect, and a shared commitment to driving positive
        change.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <SliderClient events={events} settings={eventSettings} isEventSlider />
      </motion.div>
    </motion.section>
  );
}

// Community Engagement Section
function CommunityEngagement() {
  return (
    <motion.div
      className="relative text-white w-full flex flex-col justify-center items-end md:px-20 px-4 md:pt-16 md:pb-16 pb-8 pt-40"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/images/largeCommunityBg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="md:w-[50%] w-full md:mt-0 mt-20"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold leading-8 mb-4">
          Community Engagement
        </h1>
        <p className="font-mono text-xs md:text-sm font-light">
          Community engagement and advocacy services include community outreach
          programs, advocacy campaigns, stakeholder engagement, CSR initiatives,
          and public policy advocacy. Community outreach programs design and
          implement initiatives to engage and benefit local communities,
          fostering positive relationships and social impact.
        </p>
      </motion.div>
    </motion.div>
  );
}

// Flagship Section
function FlagShip() {
  return (
    <motion.section
      className="md:py-16 py-10 md:px-8 px-4 bg-white dark:bg-white"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        className="md:px-28 px-0 md:mb-8 mb-4 text-2xl md:text-4xl font-medium text-gray-900 dark:text-white text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Flagship CSR Initiative: RUGAN ARDO "WASH" PROJECT
      </motion.h2>
      <div className="w-full flex flex-col md:flex-row items-start justify-between p-6 md:p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-md">
        <motion.div
          className="relative w-full md:w-[38%] flex items-center justify-end mb-6 md:mb-0"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Image
            src="/images/businessman.jpg"
            alt="Flag Ship"
            width={400}
            height={300}
            className="rounded-lg"
          />
        </motion.div>
        <motion.div
          className="w-full md:w-[58%] space-y-4"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <p className="leading-relaxed font-mono text-xs md:text-sm font-semibold text-gray-900 dark:text-gray-300">
            Many public health challenges such as malnutrition, malaria, water
            borne diseases, etc., faced by communities in Nigeria are largely
            preventable. Several rural communities in Nigeria lack access to
            safe drinking water, sanitation, and hygiene services; malaria
            prevention and treatment services; as well as access to family
            planning (FP)/childbirth spacing (CBS) services. Women in rural
            areas are more likely to marry earlier than their urban
            counterparts, increasing the need for modern family planning.
            However, women in rural areas are less likely to use modern
            contraceptives compared to their urban counterparts.
          </p>
          <button className="text-primary dark:text-green-400 font-medium py-1 px-4 font-mono border-b-2 border-yellow-600 dark:border-yellow-400 hover:text-green-700 dark:hover:text-green-300 transition-colors duration-200">
            Read more
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}

// Partners Section
function Partners() {
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
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <motion.section
      className="py-16 bg-white dark:bg-gray-900 md:px-8 px-4"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Our Partners
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <SliderClient partners={partners} settings={partnerSettings} />
      </motion.div>
    </motion.section>
  );
}

// Main Page Component
export default function HomePage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
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
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <main className="bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Theme Toggle Button - Centered at top */}
      <motion.div
        className="fixed top-4 left-60 md:top-4 md:right-160 md:left-auto transform -translate-x-1/2 z-50"
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

      <HeroSection />
      <AboutUs />
      <WhatsHappening />
      <CommunityEngagement />
      <FlagShip />
      <Partners />
    </main>
  );
}