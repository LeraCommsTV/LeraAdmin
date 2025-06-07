"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Sun, Moon, Trash2, Edit, Plus, ChevronLeft, ChevronRight, X } from "lucide-react";
import { db } from "@/lib/firebase"; // Firebase Firestore instance
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore"; // Firestore methods
import { uploadToCloudinary } from "@/lib/cloudinary"; // Your Cloudinary upload function

interface ProjectDetail {
  id: number;
  docId: string;
  title: string;
  description: string;
  imageUrls: { url: string; publicId: string }[];
  fullDescription: string;
  objectives: string[];
  outcomes: string[];
  duration: string;
  location: string;
}

interface CarouselItem {
  docId: string;
  title: string;
  description: string;
  image:  { url: string; publicId: string }[];
}

const ProjectManagementPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [projectForm, setProjectForm] = useState({
    id: 0,
    title: "",
    description: "",
    imageUrls: [] as { url: string; publicId: string }[],
    fullDescription: "",
    objectives: [] as string[],
    outcomes: [] as string[],
    duration: "",
    location: "",
  });
  const [carouselForm, setCarouselForm] = useState({
    title: "",
    description: "",
    image: [] as { url: string; publicId: string }[],
  });
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingCarouselId, setEditingCarouselId] = useState<string | null>(null);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateCarousel, setShowCreateCarousel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [carouselCurrentPage, setCarouselCurrentPage] = useState(1);
  const [carouselItemsPerPage] = useState(4);

  // Calculate pagination
  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const indexOfLastCarousel = carouselCurrentPage * carouselItemsPerPage;
  const indexOfFirstCarousel = indexOfLastCarousel - carouselItemsPerPage;
  const currentCarouselItems = carouselItems.slice(indexOfFirstCarousel, indexOfLastCarousel);
  const carouselTotalPages = Math.ceil(carouselItems.length / carouselItemsPerPage);

  // Fetch projects and carousel items from Firestore
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch projects
        const projectsSnapshot = await getDocs(collection(db, "projects"));
        const projectsData = projectsSnapshot.docs.map((doc, index) => ({
          id: index + 1,
          docId: doc.id,
          ...doc.data(),
        })) as ProjectDetail[];
        setProjects(projectsData);

        // Fetch carousel items
        const carouselSnapshot = await getDocs(collection(db, "carouselItems"));
        const carouselData = carouselSnapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        })) as CarouselItem[];
        setCarouselItems(carouselData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data from Firestore.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Handle file selection and preview
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalFiles = files.length + newFiles.length;
      if (totalFiles > 7) {
        alert("You can only upload up to 7 images.");
        return;
      }
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setFiles((prev) => [...prev, ...newFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
      return () => {
        newPreviews.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [files]);

  // Remove file and its preview
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const url = prev[index];
      URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleProjectInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (type: string, value: string) => {
    const items = value.split(",").map((item) => item.trim()).filter((item) => item);
    setProjectForm((prev) => ({ ...prev, [type]: items }));
  };

  const handleCarouselInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCarouselForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle project submission with Cloudinary and Firestore
  const handleProjectSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    setError(null);

    try {
      let imageUrls = [...projectForm.imageUrls]; // Keep existing images if editing
      if (files.length > 0) {
        // Upload new images to Cloudinary
        const uploadResults = await Promise.all(
          files.map(async (file) => {
            const result = await uploadToCloudinary(file); // Assumes this returns { url, public_id }
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
        // Update existing project in Firestore
        const projectRef = doc(db, "projects", editingProjectId);
        await updateDoc(projectRef, updatedProject);
        setProjects(projects.map((p) => (p.docId === editingProjectId ? { ...updatedProject, id: p.id, docId: editingProjectId } : p)));
        setEditingProjectId(null);
      } else {
        // Add new project to Firestore
        const docRef = await addDoc(collection(db, "projects"), updatedProject);
        setProjects([...projects, { ...updatedProject, id: projects.length + 1, docId: docRef.id }]);
      }

      // Clean up previews
      previews.forEach((url) => URL.revokeObjectURL(url));
      setProjectForm({
        id: 0,
        title: "",
        description: "",
        imageUrls: [],
        fullDescription: "",
        objectives: [],
        outcomes: [],
        duration: "",
        location: "",
      });
      setFiles([]);
      setPreviews([]);
      setShowCreateProject(false);
    } catch (error) {
      console.error("Error saving project:", error);
      setError("Failed to save project. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle carousel submission with Firestore
  const handleCarouselSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!carouselForm.image) {
      setError("Please provide an image URL for the carousel item.");
      return;
    }

    try {
      const updatedItem = { ...carouselForm };

      if (editingCarouselId) {
        // Update existing carousel item in Firestore
        const carouselRef = doc(db, "carouselItems", editingCarouselId);
        await updateDoc(carouselRef, updatedItem);
        setCarouselItems(carouselItems.map((item) => (item.docId === editingCarouselId ? { ...updatedItem, docId: editingCarouselId } : item)));
        setEditingCarouselId(null);
      } else {
        // Add new carousel item to Firestore
        const docRef = await addDoc(collection(db, "carouselItems"), updatedItem);
        setCarouselItems([...carouselItems, { ...updatedItem, docId: docRef.id }]);
      }

      setCarouselForm({ title: "", description: "", image: [] });
      setShowCreateCarousel(false);
    } catch (error) {
      console.error("Error saving carousel item:", error);
      setError("Failed to save carousel item. Please try again.");
    }
  };

  // Delete project from Firestore
  const deleteProject = async (docId: string) => {
    try {
      await deleteDoc(doc(db, "projects", docId));
      setProjects(projects.filter((p) => p.docId !== docId));
    } catch (error) {
      console.error("Error deleting project:", error);
      setError("Failed to delete project. Please try again.");
    }
  };

  // Delete carousel item from Firestore
  const deleteCarouselItem = async (docId: string) => {
    try {
      await deleteDoc(doc(db, "carouselItems", docId));
      setCarouselItems(carouselItems.filter((item) => item.docId !== docId));
    } catch (error) {
      console.error("Error deleting carousel item:", error);
      setError("Failed to delete carousel item. Please try again.");
    }
  };

  const editProject = (project: ProjectDetail) => {
    setProjectForm(project);
    setEditingProjectId(project.docId);
    setShowCreateProject(true);
    setFiles([]);
    setPreviews([]);
  };

  const editCarouselItem = (item: CarouselItem) => {
    setCarouselForm(item);
    setEditingCarouselId(item.docId);
    setShowCreateCarousel(true);
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const carouselPaginate = (pageNumber: number) => {
    setCarouselCurrentPage(pageNumber);
  };

  // Clean up previews on component unmount
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <main className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
        {/* Header Section */}
        <section className={`px-8 md:px-20 py-16 transition-colors duration-300 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
          <div className="relative max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Project Management
                </h1>
                <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Manage your projects and carousel items with ease
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="p-3 rounded-lg bg-blue-600 hover:bg-blue-700 shadow-lg transition-all duration-300 hover:scale-110"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className="w-6 h-6 text-white transition-transform duration-300" />
                ) : (
                  <Moon className="w-6 h-6 text-white transition-transform duration-300" />
                )}
              </button>
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

        {/* Action Buttons */}
        <section className={`px-8 md:px-20 py-8 transition-colors duration-300 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
          <div className="max-w-6xl mx-auto flex flex-wrap gap-4">
            <button
              onClick={() => {
                setShowCreateProject(true);
                setEditingProjectId(null);
                setProjectForm({
                  id: 0,
                  title: "",
                  description: "",
                  imageUrls: [],
                  fullDescription: "",
                  objectives: [],
                  outcomes: [],
                  duration: "",
                  location: "",
                });
                setFiles([]);
                setPreviews([]);
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Create Project
            </button>
            <button
              onClick={() => {
                setShowCreateCarousel(true);
                setEditingCarouselId(null);
                setCarouselForm({ title: "", description: "", image: [] });
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Create Carousel Item
            </button>
          </div>
        </section>

        {/* Projects Grid */}
        <section className={`px-8 md:px-20 py-16 transition-colors duration-300 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-3xl font-bold mb-8 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Projects ({projects.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentProjects.map((project) => (
                <div key={project.docId} className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                  {project.imageUrls.length > 0 && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={project.imageUrls[0].url} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      {project.title}
                    </h3>
                    <p className={`text-sm mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {project.description}
                    </p>
                    <div className={`text-xs mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      <p><strong>Duration:</strong> {project.duration}</p>
                      <p><strong>Location:</strong> {project.location}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editProject(project)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-sm transition-all duration-300 hover:scale-105"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProject(project.docId)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition-all duration-300 hover:scale-105"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Projects Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    currentPage === 1
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                  } ${isDarkMode ? 'text-white' : 'text-gray-700'}`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      currentPage === index + 1
                        ? 'bg-blue-600 text-white'
                        : isDarkMode
                        ? 'text-white hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    currentPage === totalPages
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                  } ${isDarkMode ? 'text-white' : 'text-gray-700'}`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Carousel Items Grid */}
        <section className={`px-8 md:px-20 py-16 transition-colors duration-300 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-3xl font-bold mb-8 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Carousel Items ({carouselItems.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {currentCarouselItems.map((item) => (
                <div key={item.docId} className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
                  <div className="h-32 overflow-hidden">
                    <img 
                      src={item.image && item.image.length > 0 ? item.image[0].url : ""} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
                    />
                  </div>
                  <div className="p-4">
                    <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      {item.title}
                    </h3>
                    <p className={`text-sm mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {item.description}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editCarouselItem(item)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-sm transition-all duration-300 hover:scale-105"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCarouselItem(item.docId)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition-all duration-300 hover:scale-105"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Pagination */}
            {carouselTotalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => carouselPaginate(carouselCurrentPage - 1)}
                  disabled={carouselCurrentPage === 1}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    carouselCurrentPage === 1
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                  } ${isDarkMode ? 'text-white' : 'text-gray-700'}`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {[...Array(carouselTotalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => carouselPaginate(index + 1)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      carouselCurrentPage === index + 1
                        ? 'bg-purple-600 text-white'
                        : isDarkMode
                        ? 'text-white hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => carouselPaginate(carouselCurrentPage + 1)}
                  disabled={carouselCurrentPage === carouselTotalPages}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    carouselCurrentPage === carouselTotalPages
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                  } ${isDarkMode ? 'text-white' : 'text-gray-700'}`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Project Form Modal */}
        {showCreateProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className={`sticky top-0 flex items-center justify-between p-6 border-b ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
                <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {editingProjectId ? "Edit Project" : "Create New Project"}
                </h2>
                <button
                  onClick={() => {
                    previews.forEach((url) => URL.revokeObjectURL(url));
                    setFiles([]);
                    setPreviews([]);
                    setShowCreateProject(false);
                  }}
                  className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleProjectSubmit} className="p-6 space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Upload Images (Max 7)
                  </label>
                  <div className={`p-6 border-2 border-dashed rounded-lg text-center transition-colors duration-300 ${isDarkMode ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-gray-50"}`}>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className={`cursor-pointer text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                    >
                      Click to select images or drag and drop here
                    </label>
                  </div>
                  {previews.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {previews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="h-24 w-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {editingProjectId && projectForm.imageUrls.length > 0 && (
                    <div className="mt-4">
                      <p className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Existing Images:
                      </p>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        {projectForm.imageUrls.map((img, index) => (
                          <div key={index} className="relative">
                            <img
                              src={img.url}
                              alt={`Existing ${index + 1}`}
                              className="h-24 w-full object-cover rounded-lg"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={projectForm.title}
                    onChange={handleProjectInputChange}
                    className={`w-full p-3 rounded-lg border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={projectForm.description}
                    onChange={handleProjectInputChange}
                    className={`w-full p-3 rounded-lg border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Full Description
                  </label>
                  <textarea
                    name="fullDescription"
                    value={projectForm.fullDescription}
                    onChange={handleProjectInputChange}
                    className={`w-full p-3 rounded-lg border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Duration
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={projectForm.duration}
                      onChange={handleProjectInputChange}
                      className={`w-full p-3 rounded-lg border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={projectForm.location}
                      onChange={handleProjectInputChange}
                      className={`w-full p-3 rounded-lg border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Objectives (comma-separated)
                  </label>
                  <textarea
                    name="objectives"
                    value={projectForm.objectives.join(", ")}
                    onChange={(e) => handleArrayInputChange("objectives", e.target.value)}
                    className={`w-full p-3 rounded-lg border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Outcomes (comma-separated)
                  </label>
                  <textarea
                    name="outcomes"
                    value={projectForm.outcomes.join(", ")}
                    onChange={(e) => handleArrayInputChange("outcomes", e.target.value)}
                    className={`w-full p-3 rounded-lg border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    rows={3}
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:scale-105 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    {isUploading ? "Saving..." : editingProjectId ? "Update Project" : "Create Project"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      previews.forEach((url) => URL.revokeObjectURL(url));
                      setFiles([]);
                      setPreviews([]);
                      setShowCreateProject(false);
                    }}
                    className={`px-6 py-3 rounded-lg border transition-all duration-300 hover:scale-105 ${isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Carousel Form Modal */}
        {showCreateCarousel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`max-w-md w-full rounded-xl shadow-2xl ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {editingCarouselId ? "Edit Carousel Item" : "Create Carousel Item"}
                </h2>
                <button
                  onClick={() => setShowCreateCarousel(false)}
                  className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleCarouselSubmit} className="p-6 space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={carouselForm.title}
                    onChange={handleCarouselInputChange}
                    className={`w-full p-3 rounded-lg border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={carouselForm.description}
                    onChange={handleCarouselInputChange}
                    className={`w-full p-3 rounded-lg border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    rows={3}
                    required
                  />
                </div>

               <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  </label>
                  <div className={`p-6 border-2 border-dashed rounded-lg text-center transition-colors duration-300 ${isDarkMode ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-gray-50"}`}>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className={`cursor-pointer text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                    >
                      Click to select images or drag and drop here
                    </label>
                  </div>
                  {previews.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {previews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="h-24 w-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* No existing images to display for carouselForm, since it only supports a single image field */}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="w-4 h-4" />
                    {editingCarouselId ? "Update Item" : "Create Item"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateCarousel(false)}
                    className={`px-6 py-3 rounded-lg border transition-all duration-300 hover:scale-105 ${isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectManagementPage;