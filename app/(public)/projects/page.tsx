// pages/ProjectViewPage.tsx
"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ProjectDetail } from '@/types';
import { Pagination } from '@/components/ui/Pagination';
import { CircularProjectCard } from '@/components/cards/CircularProjectCard';
import { usePagination } from '@/hooks/usePagination';
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useTheme } from '@/context/ThemeContext';

const ProjectViewPage = () => {
  const { isDark } = useTheme();
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);

  const projectPagination = usePagination(projects, displayMode === 'grid' ? 6 : 10);

  // Fetch projects from Firebase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const projectsSnapshot = await getDocs(collection(db, "projects"));
        const projectsData = projectsSnapshot.docs.map((doc, index) => ({
          id: index + 1,
          docId: doc.id,
          ...doc.data(),
        })) as ProjectDetail[];
        setProjects(projectsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load projects from Firestore.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleProjectClick = (project: ProjectDetail) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <main className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-900" : "bg-white"}`}>
        {/* Header Section */}
        <section className={`px-8 md:px-20 pt-24 pb-16 transition-colors duration-300 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
          <div className="relative max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Our Projects
                </h1>
                <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Explore our collection of projects
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setDisplayMode(displayMode === 'grid' ? 'list' : 'grid')}
                  className={`px-4 py-2 rounded-lg text-white transition-all duration-300 ${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {displayMode === 'grid' ? 'List View' : 'Grid View'}
                </button>
              </div>
            </div>
            {error && (
              <p className={`text-sm mt-4 ${
                isDark ? "text-red-400" : "text-red-500"
              }`}>
                {error}
              </p>
            )}
            {loading && (
              <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Loading projects...
              </p>
            )}
          </div>
        </section>

        {/* Projects Section */}
        <section className={`px-8 md:px-20 py-16 transition-colors duration-300 ${isDark ? "bg-gray-900" : "bg-white"}`}>
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-3xl font-bold mb-8 ${isDark ? "text-white" : "text-gray-900"}`}>
              Projects ({projects.length})
            </h2>
            
            <div className={displayMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              : "space-y-4 mb-8"
            }>
              {projectPagination.paginatedData.map((project) => (
                <div
                  key={project.docId}
                  onClick={() => handleProjectClick(project)}
                  className="cursor-pointer"
                >
                  <CircularProjectCard
                    project={project}
                    isDark={isDark}
                    displayMode={displayMode}
                  />
                </div>
              ))}
            </div>

            <Pagination
              currentPage={projectPagination.currentPage}
              totalPages={projectPagination.totalPages}
              onPageChange={projectPagination.handlePageChange}
              isDark={isDark}
              variant="blue"
            />
          </div>
        </section>

        {/* Project Detail Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}>
              <div className={`sticky top-0 flex items-center justify-between p-6 border-b ${
                isDark 
                  ? "border-gray-700 bg-gray-800" 
                  : "border-gray-200 bg-white"
              }`}>
                <h2 className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>
                  {selectedProject.title}
                </h2>
                <button
                  onClick={closeModal}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark 
                      ? "text-gray-400 hover:bg-gray-700" 
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* Images */}
                {selectedProject.imageUrls && selectedProject.imageUrls.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedProject.imageUrls.map((image, index) => (
                      <img
                        key={index}
                        src={typeof image === "string" ? image : image.url}
                        alt={`${selectedProject.title} ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
                {/* Description */}
                {selectedProject.description && (
                  <div>
                    <h3 className={`text-lg font-semibold ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}>
                      Description
                    </h3>
                    <p className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}>
                      {selectedProject.description}
                    </p>
                  </div>
                )}
                {/* Location */}
                {selectedProject.location && (
                  <div>
                    <h3 className={`text-lg font-semibold ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}>
                      Location
                    </h3>
                    <p className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}>
                      {selectedProject.location}
                    </p>
                  </div>
                )}
                {/* Additional Project Details */}
                {selectedProject.date && (
                  <div>
                    <h3 className={`text-lg font-semibold ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}>
                      Date
                    </h3>
                    <p className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}>
                      {new Date(selectedProject.date).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {selectedProject.category && (
                  <div>
                    <h3 className={`text-lg font-semibold ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}>
                      Category
                    </h3>
                    <p className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}>
                      {selectedProject.category}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectViewPage;