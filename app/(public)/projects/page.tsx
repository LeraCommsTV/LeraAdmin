"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react";
import { db } from "@/lib/firebase"; // Adjust path to your firebase.ts file
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation"; // For App Router (Next.js 13+)
import { uploadToCloudinary } from "@/lib/cloudinary"; // Your Cloudinary upload function

// Interface for project data from Firestore
interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  imageUrl: string; // Cloudinary URL from Firebase
  fullDescription: string;
  objectives: string[];
  outcomes: string[];
  duration: string;
  location: string;
  createdAt?: any;
  status?: string;
}

// Interface for carousel items from Firestore
interface CarouselItem {
  id: string;
  title: string;
  description: string;
  image: string; // Cloudinary URL from Firebase
  order?: number;
  isActive?: boolean;
}

interface CardProps {
  title: string;
  description: string;
  imageUrl: string;
  isDarkMode?: boolean;
  index: number;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ title, description, imageUrl, isDarkMode, index, onClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 200); // Stagger animation

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      onClick={onClick}
      className={`relative bg-cover bg-center h-64 text-white rounded-lg overflow-hidden shadow-lg group cursor-pointer transform transition-all duration-700 ease-out ${
        isVisible 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-8 opacity-0 scale-95'
      } hover:scale-105 hover:shadow-2xl hover:-translate-y-2`}
      style={{ 
        backgroundImage: imageError ? 'none' : (imageUrl ? `url(${imageUrl})` : "url('/friends.png')")
      }}
    >
      {/* Hidden image to detect loading errors */}
      <img
        src={imageUrl}
        alt=""
        className="hidden"
        onError={() => setImageError(true)}
        onLoad={() => setImageError(false)}
      />
      
      {/* Animated overlay */}
      <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70 group-hover:via-black/40 group-hover:to-black/80 transition-all duration-500 ${
        isDarkMode ? 'to-black/90 group-hover:to-black/95' : ''
      }`} />
      
      {/* Content with slide-up animation */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 transform transition-transform duration-500 group-hover:translate-y-[-4px]">
        <h3 className="text-sm font-bold font-mona mb-3 transform transition-all duration-500 group-hover:text-yellow-300">
          {title}
        </h3>
        <p className="text-xs font-mona leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity duration-500">
          {description}
        </p>
      </div>

      {/* Animated border effect */}
      <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-yellow-400/50 transition-all duration-500" />
    </div>
  );
};

const Carousel: React.FC<{ items: CarouselItem[], isDarkMode: boolean }> = ({ items, isDarkMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageErrors, setImageErrors] = useState<boolean[]>([]);

  useEffect(() => {
    setImageErrors(new Array(items.length).fill(false));
  }, [items]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
  };

  useEffect(() => {
    if (isAutoPlaying && items.length > 1) {
      const interval = setInterval(nextSlide, 4000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, isAutoPlaying, items.length]);

  if (items.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-lg">
        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          No featured projects available
        </p>
      </div>
    );
  }

  return (
    <div 
      className="relative overflow-hidden rounded-lg"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div 
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div key={item.id || index} className="w-full flex-shrink-0">
            <div
              className="relative h-96 bg-cover bg-center"
              style={{ 
                backgroundImage: imageErrors[index] ? "url('/friends.png')" : (item.image ? `url(${item.image})` : "url('/friends.png')")
              }}
            >
              <img
                src={item.image}
                alt=""
                className="hidden"
                onError={() => handleImageError(index)}
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-8`}>
                <div className="text-white transform transition-all duration-700 delay-300">
                  <h3 className="text-2xl font-bold mb-4 animate-fade-in-up">{item.title}</h3>
                  <p className="text-sm font-mona opacity-90 animate-fade-in-up animation-delay-200">{item.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons - only show if more than 1 item */}
      {items.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full transition-all duration-300 hover:scale-110 ${
              isDarkMode 
                ? 'bg-gray-800/80 hover:bg-gray-700 text-white' 
                : 'bg-white/80 hover:bg-white text-gray-800'
            } shadow-lg backdrop-blur-sm`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={nextSlide}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full transition-all duration-300 hover:scale-110 ${
              isDarkMode 
                ? 'bg-gray-800/80 hover:bg-gray-700 text-white' 
                : 'bg-white/80 hover:bg-white text-gray-800'
            } shadow-lg backdrop-blur-sm`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index 
                    ? 'bg-yellow-400 scale-125' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ProjectsPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch projects from Firestore
        const projectsCollection = collection(db, "projects");
        const projectsQuery = query(projectsCollection, orderBy("createdAt", "desc"));
        const projectsSnapshot = await getDocs(projectsQuery);
        
        const projectsData: ProjectDetail[] = projectsSnapshot.docs.map((doc) => {
          const data = doc.data();
          const imageUrl = Array.isArray(data.imageUrls) && data.imageUrls.length > 0 
            ? data.imageUrls[0].url
            : data.imageUrl || "/friends.png"; // Default to friends.png if no image
          return {
            id: doc.id,
            title: data.title || "Untitled Project",
            description: data.description || "No description available",
            imageUrl: imageUrl,
            fullDescription: data.fullDescription || data.description || "No detailed description available",
            objectives: Array.isArray(data.objectives) ? data.objectives : [],
            outcomes: Array.isArray(data.outcomes) ? data.outcomes : [],
            duration: data.duration || "",
            location: data.location || "",
            createdAt: data.createdAt,
            status: data.status || "active"
          };
        });
        
        const activeProjects = projectsData.filter(project => project.status !== 'draft');
        setProjects(activeProjects);

        // Fetch carousel items from Firestore
        const carouselCollection = collection(db, "carouselItems");
        const carouselQuery = query(carouselCollection, orderBy("order", "asc"));
        const carouselSnapshot = await getDocs(carouselQuery);
        
        const carouselData: CarouselItem[] = carouselSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "Featured Project",
            description: data.description || "No description available",
            image: data.image || data.imageUrl || "/friends.png", // Default to friends.png if no image
            order: data.order || 0,
            isActive: data.isActive !== false
          };
        });
        
        const activeCarouselItems = carouselData.filter(item => item.isActive);
        setCarouselItems(activeCarouselItems);

        console.log(`Loaded ${activeProjects.length} projects and ${activeCarouselItems.length} carousel items`);
        
      } catch (err) {
        console.error("Error fetching data from Firestore:", err);
        setError("Failed to load projects. Please check your Firebase configuration and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const heroTimer = setTimeout(() => setHeroVisible(true), 100);
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const sectionElement = document.getElementById('projects-section');
    if (sectionElement) {
      observer.observe(sectionElement);
    }

    return () => {
      clearTimeout(heroTimer);
      observer.disconnect();
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleCardClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="text-center max-w-md mx-auto p-6">
          <p className={`text-lg mb-4 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>

      <button
        onClick={toggleTheme}
        className="fixed top-4 left-60 md:top-4 md:right-160 md:left-auto z-50 p-3 rounded-lg bg-green-600 dark:bg-green-700 shadow-lg border border-green-600 dark:border-green-700 hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5 text-white transition-transform duration-300 hover:rotate-180" />
        ) : (
          <Moon className="w-5 h-5 text-white transition-transform duration-300 hover:rotate-12" />
        )}
      </button>

      <main className={`transition-colors duration-500 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Hero Section with Background Image */}
        <section className="relative md:h-[80vh] min-h-[70vh] w-full overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110 transition-transform duration-1000 hover:scale-105"
            style={{
              backgroundImage: "url('/images/projectBg.jpeg')"
            }}
          />
          
          <div className={`absolute inset-0 transition-all duration-700 ${
            isDarkMode ? 'bg-black/80' : 'bg-black/70'
          } ${heroVisible ? 'opacity-100' : 'opacity-0'}`} />
          
          <div className="relative h-full w-full flex flex-col justify-center md:px-20 px-8 md:pt-28 md:pb-28 pt-52 pb-10 text-white">
            <div className="md:w-[40%]">
              <h1 className={`text-3xl font-bold leading-8 mb-4 transform transition-all duration-1000 ${
                heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                Projects
              </h1>
              <p className={`font-light text-xs font-mona leading-5 transform transition-all duration-1000 delay-300 ${
                heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                Lera approaches all implementation and execution of tasks from an
                evidence-based standpoint, conducting research, and analysing
                findings from a consumer perspective to inform the development and
                innovative deployment of coherent communication strategies. Lera's
                experience spans different thematic issues around health and social
                development, pursuing the most efficient and effective solutions
                that produce optimum, and impactful results.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Projects Carousel */}
        {carouselItems.length > 0 && (
          <section className={`px-8 md:px-20 py-16 transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <div className={`mb-8 transform transition-all duration-800 ${
              sectionVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <h2 className={`text-2xl font-bold mb-4 text-center ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Featured Projects
              </h2>
            </div>
            <Carousel items={carouselItems} isDarkMode={isDarkMode} />
          </section>
        )}

        {/* Project Listings Section */}
        <section 
          id="projects-section"
          className={`px-8 md:px-20 pt-16 pb-24 transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
          }`}
        >
          <div className={`mb-12 text-center transform transition-all duration-800 ${
            sectionVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Our Impact Projects
            </h2>
            <p className={`text-sm font-mona max-w-2xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Discover how we're driving positive change through evidence-based research and strategic communication across various sectors.
            </p>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <Card
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  imageUrl={project.imageUrl}
                  isDarkMode={isDarkMode}
                  index={index}
                  onClick={() => handleCardClick(project.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No projects available at the moment.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ProjectsPage;