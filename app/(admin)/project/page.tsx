// ProjectManagementPage.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { ProjectDetail } from '@/types';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Pagination } from '@/components/ui/Pagination';
import { ProjectForm } from '@/components/forms/ProjectForm';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { useImageUpload } from '@/hooks/useImageUpload';
import { usePagination } from '@/hooks/usePagination';
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface ProjectFormData {
  id: number;
  title: string;
  description: string;
  imageUrls: { url: string; publicId: string }[];
  location: string;
}

const ProjectManagementPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');

  const [projectForm, setProjectForm] = useState<ProjectFormData>({
    id: 0,
    title: "",
    description: "",
    imageUrls: [],
    location: "",
  });

  const projectImageUpload = useImageUpload(5);
  const projectPagination = usePagination(projects, displayMode === 'grid' ? 6 : 10);

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
        setError("Failed to load data from Firestore.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleProjectInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProjectSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    setError(null);

    try {
      let imageUrls = [...projectForm.imageUrls];
      if (projectImageUpload.files.length > 0) {
        const uploadResults = await Promise.all(
          projectImageUpload.files.map(async (file) => {
            const result = await uploadToCloudinary(file);
            return { url: result.url, publicId: result.publicId };
          })
        );
        imageUrls = [...imageUrls, ...uploadResults];
      }

      const updatedProject = {
        ...projectForm,
        imageUrls,
      };

      if (editingProjectId) {
        const projectRef = doc(db, "projects", editingProjectId);
        await updateDoc(projectRef, updatedProject);
        setProjects(projects.map((p) => (p.docId === editingProjectId ? { ...updatedProject, id: p.id, docId: editingProjectId } : p)));
        setEditingProjectId(null);
      } else {
        const docRef = await addDoc(collection(db, "projects"), updatedProject);
        setProjects([...projects, { ...updatedProject, id: projects.length + 1, docId: docRef.id }]);
      }

      handleCancelProject();
    } catch (error) {
      console.error("Error saving project:", error);
      setError("Failed to save project. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteProject = async (docId: string) => {
    try {
      await deleteDoc(doc(db, "projects", docId));
      setProjects(projects.filter((p) => p.docId !== docId));
    } catch (error) {
      console.error("Error deleting project:", error);
      setError("Failed to delete project. Please try again.");
    }
  };

  const editProject = (project: ProjectDetail) => {
    setProjectForm(project);
    setEditingProjectId(project.docId);
    setShowCreateProject(true);
    projectImageUpload.resetFiles();
  };

  const handleCancelProject = () => {
    projectImageUpload.resetFiles();
    setProjectForm({
      id: 0,
      title: "",
      description: "",
      imageUrls: [],
      location: "",
    });
    setShowCreateProject(false);
    setEditingProjectId(null);
  };

  const handleCreateProject = () => {
    setShowCreateProject(true);
    setEditingProjectId(null);
    setProjectForm({
      id: 0,
      title: "",
      description: "",
      imageUrls: [],
      location: "",
    });
    projectImageUpload.resetFiles();
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <main className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
        <section className={`px-8 md:px-20 py-16 transition-colors duration-300 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
          <div className="relative max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Project Management
                </h1>
                <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Manage your projects with ease
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setDisplayMode(displayMode === 'grid' ? 'list' : 'grid')}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all"
                >
                  {displayMode === 'grid' ? 'List View' : 'Grid View'}
                </button>
                <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
              </div>
            </div>
            {error && (
              <p className={`text-red-500 text-sm mt-4 ${isDarkMode ? "text-red-400" : ""}`}>
                {error}
              </p>
            )}
            {loading && (
              <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Loading data...
              </p>
            )}
          </div>
        </section>

        <section className={`px-8 md:px-20 py-8 transition-colors duration-300 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
          <div className="max-w-6xl mx-auto">
            <button
              onClick={handleCreateProject}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Create Project
            </button>
          </div>
        </section>

        <section className={`px-8 md:px-20 py-16 transition-colors duration-300 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-3xl font-bold mb-8 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Projects ({projects.length})
            </h2>
            
            <div className={displayMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              : "space-y-4 mb-8"
            }>
              {projectPagination.paginatedData.map((project) => (
                <ProjectCard
                  key={project.docId}
                  project={project}
                  isDarkMode={isDarkMode}
                  onEdit={editProject}
                  onDelete={deleteProject}
                  displayMode={displayMode}
                />
              ))}
            </div>

            <Pagination
              currentPage={projectPagination.currentPage}
              totalPages={projectPagination.totalPages}
              onPageChange={projectPagination.handlePageChange}
              isDark={isDarkMode}
              variant="blue"
            />
          </div>
        </section>

        {showCreateProject && (
          <ProjectForm
            formData={projectForm}
            files={projectImageUpload.files}
            previews={projectImageUpload.previews}
            isUploading={isUploading}
            isDarkMode={isDarkMode}
            isEditing={!!editingProjectId}
            onInputChange={handleProjectInputChange}
            onFileChange={projectImageUpload.handleFileChange}
            onRemoveFile={projectImageUpload.removeFile}
            onSubmit={handleProjectSubmit}
            onCancel={handleCancelProject}
          />
        )}
      </main>
    </div>
  );
};

export default ProjectManagementPage;