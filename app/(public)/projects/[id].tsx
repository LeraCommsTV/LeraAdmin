"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, ArrowLeft } from "lucide-react";
import { db } from "@/lib/firebase"; // Adjust path to your firebase.ts file
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation"; // For App Router (Next.js 13+)

// Interface for project data from Firestore
interface ProjectDetail {
  id: string; // Firestore document ID
  title: string;
  description: string;
  imageUrl: string; // Derived from imageUrls array (Cloudinary URL)
  fullDescription: string;
  objectives: string[];
  outcomes: string[];
  duration: string;
  location: string;
  createdAt?: any; // For ordering, can be Firebase Timestamp
  status?: string; // e.g., 'active', 'completed', 'draft'
}

const ProjectDetailPage = ({ params }: { params: { id: string } }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch project data from Firestore
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const projectRef = doc(db, "projects", params.id);
        const projectSnap = await getDoc(projectRef);

        if (projectSnap.exists()) {
          const data = projectSnap.data();
          // Use first Cloudinary URL from imageUrls, no fallback
          const imageUrl = Array.isArray(data.imageUrls) && data.imageUrls.length > 0 
            ? data.imageUrls[0].url 
            : data.imageUrl || "";
          setProject({
            id: projectSnap.id,
            title: data.title || "",
            description: data.description || "",
            imageUrl,
            fullDescription: data.fullDescription || data.description || "",
            objectives: Array.isArray(data.objectives) ? data.objectives : [],
            outcomes: Array.isArray(data.outcomes) ? data.outcomes : [],
            duration: data.duration || "",
            location: data.location || "",
            createdAt: data.createdAt,
            status: data.status || "active"
          });
        } else {
          setError("Project not found.");
        }
      } catch (err) {
        console.error("Error fetching project from Firestore:", err);
        setError("Failed to load project. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleBackToProjects = () => {
    router.push("/projects");
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="text-center max-w-md mx-auto p-6">
          <p className={`text-lg mb-4 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{error || "Project not found."}</p>
          <button
            onClick={handleBackToProjects}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 left-4 md:top-4 md:right-4 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5 text-yellow-500 transition-transform duration-300 hover:rotate-180" />
        ) : (
          <Moon className="w-5 h-5 text-gray-700 transition-transform duration-300 hover:rotate-12" />
        )}
      </button>

      <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Back Button */}
        <div className="px-8 md:px-20 pt-20 pb-8">
          <button
            onClick={handleBackToProjects}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
              isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Projects</span>
          </button>
        </div>

        {/* Hero Section */}
        <section className="relative h-96 w-full overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: project.imageUrl ? `url(${project.imageUrl})` : 'none',
              backgroundColor: !project.imageUrl ? (isDarkMode ? '#1f2937' : '#f3f4f6') : 'transparent'
            }}
          />
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/80' : 'bg-black/70'}`} />
          
          <div className="relative h-full w-full flex flex-col justify-center px-8 md:px-20 text-white">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{project.title}</h1>
              <p className="text-xl font-light font-mona leading-relaxed">{project.description}</p>
            </div>
          </div>
        </section>

        {/* Project Details */}
        <section className={`px-8 md:px-20 py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="max-w-4xl mx-auto">
            {/* Project Info Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Duration
                </h3>
                <p className={`font-mona ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {project.duration || 'Not specified'}
                </p>
              </div>
              <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Location
                </h3>
                <p className={`font-mona ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {project.location || 'Not specified'}
                </p>
              </div>
            </div>

            {/* Full Description */}
            <div className="mb-12">
              <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Project Overview
              </h2>
              <p className={`text-base font-mona leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {project.fullDescription || project.description}
              </p>
            </div>

            {/* Objectives */}
            {project.objectives && project.objectives.length > 0 && (
              <div className="mb-12">
                <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Key Objectives
                </h2>
                <ul className="space-y-3">
                  {project.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                      <p className={`text-base font-mona ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {objective}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Outcomes */}
            {project.outcomes && project.outcomes.length > 0 && (
              <div>
                <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Expected Outcomes
                </h2>
                <ul className="space-y-3">
                  {project.outcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <p className={`text-base font-mona ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {outcome}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectDetailPage;