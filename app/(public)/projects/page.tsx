// pages/ProjectViewPage.tsx
"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { X, Search, Filter, Grid, List, Calendar, MapPin, Tag, SortAsc, SortDesc } from "lucide-react";
import { ProjectDetail } from '@/types';
import { Pagination } from '@/components/ui/Pagination';
import { CircularProjectCard } from '@/components/cards/CircularProjectCard';
import { usePagination } from '@/hooks/usePagination';
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useTheme } from '@/context/ThemeContext';

type SortField = 'title' | 'date' | 'category' | 'location';
type SortOrder = 'asc' | 'desc';

interface FilterState {
  categories: string[];
  locations: string[];
  dateRange: {
    start: string;
    end: string;
  };
}

const ProjectViewPage = () => {
  const { isDark } = useTheme();
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    locations: [],
    dateRange: { start: '', end: '' }
  });

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

  // Get unique categories and locations for filter options
  const filterOptions = useMemo(() => {
    const categories = [...new Set(projects.map(p => p.category).filter(Boolean))];
    const locations = [...new Set(projects.map(p => p.location).filter(Boolean))];
    return { categories, locations };
  }, [projects]);

  // Filter and search logic
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location?.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = filters.categories.length === 0 || 
        (project.category && filters.categories.includes(project.category));

      // Location filter
      const matchesLocation = filters.locations.length === 0 || 
        (project.location && filters.locations.includes(project.location));

      // Date range filter
      const matchesDateRange = (() => {
        if (!filters.dateRange.start && !filters.dateRange.end) return true;
        if (!project.date) return false;
        
        const projectDate = new Date(project.date);
        const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
        const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null;
        
        if (startDate && projectDate < startDate) return false;
        if (endDate && projectDate > endDate) return false;
        return true;
      })();

      return matchesSearch && matchesCategory && matchesLocation && matchesDateRange;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'title':
          aValue = a.title?.toLowerCase() || '';
          bValue = b.title?.toLowerCase() || '';
          break;
        case 'date':
          aValue = a.date ? new Date(a.date) : new Date(0);
          bValue = b.date ? new Date(b.date) : new Date(0);
          break;
        case 'category':
          aValue = a.category?.toLowerCase() || '';
          bValue = b.category?.toLowerCase() || '';
          break;
        case 'location':
          aValue = a.location?.toLowerCase() || '';
          bValue = b.location?.toLowerCase() || '';
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [projects, searchTerm, filters, sortField, sortOrder]);

  const projectPagination = usePagination(filteredAndSortedProjects, displayMode === 'grid' ? 6 : 10);

  // Filter handlers
  const handleCategoryToggle = useCallback((category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  }, []);

  const handleLocationToggle = useCallback((location: string) => {
    setFilters(prev => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter(l => l !== location)
        : [...prev.locations, location]
    }));
  }, []);

  const handleDateRangeChange = useCallback((field: 'start' | 'end', value: string) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { ...prev.dateRange, [field]: value }
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      categories: [],
      locations: [],
      dateRange: { start: '', end: '' }
    });
    setSearchTerm('');
  }, []);

  const handleProjectClick = (project: ProjectDetail) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const activeFiltersCount = filters.categories.length + filters.locations.length + 
    (filters.dateRange.start ? 1 : 0) + (filters.dateRange.end ? 1 : 0);

  return (
    <div className={isDark ? "dark" : ""}>
      <main className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-900" : "bg-white"}`}>
        {/* Header Section */}
        <section className={`px-8 md:px-20 pt-24 pb-16 transition-colors duration-300 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
          <div className="relative max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className={`text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-green-400"}`}>
                  Our Projects
                </h1>
                <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Explore our collection of projects
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setDisplayMode(displayMode === 'grid' ? 'list' : 'grid')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-white hover:bg-gray-50 text-gray-700 border'
                  }`}
                  title={displayMode === 'grid' ? 'List View' : 'Grid View'}
                >
                  {displayMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`} />
                  <input
                    type="text"
                    placeholder="Search projects by title, description, category, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 ${
                      isDark 
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500" 
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500"
                    } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                  />
                </div>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 ${
                    showFilters || activeFiltersCount > 0
                      ? (isDark ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white')
                      : (isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-white hover:bg-gray-50 text-gray-700 border')
                  }`}
                >
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-white text-green-600 text-xs rounded-full px-2 py-1 font-semibold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className={`p-6 rounded-lg border transition-all duration-300 ${
                  isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"
                }`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Categories Filter */}
                    <div>
                      <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}>
                        <Tag className="w-4 h-4" />
                        Categories
                      </h3>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {filterOptions.categories
                          .filter((category): category is string => typeof category === "string")
                          .map(category => (
                          <label key={category} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.categories.includes(category)}
                              onChange={() => handleCategoryToggle(category)}
                              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                              {category}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Locations Filter */}
                    <div>
                      <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}>
                        <MapPin className="w-4 h-4" />
                        Locations
                      </h3>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {filterOptions.locations.map(location => (
                          <label key={location} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.locations.includes(location)}
                              onChange={() => handleLocationToggle(location)}
                              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                              {location}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Date Range Filter */}
                    <div>
                      <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}>
                        <Calendar className="w-4 h-4" />
                        Date Range
                      </h3>
                      <div className="space-y-2">
                        <input
                          type="date"
                          placeholder="Start Date"
                          value={filters.dateRange.start}
                          onChange={(e) => handleDateRangeChange('start', e.target.value)}
                          className={`w-full px-3 py-2 text-sm rounded border ${
                            isDark 
                              ? "bg-gray-600 border-gray-500 text-white" 
                              : "bg-white border-gray-300 text-gray-900"
                          } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                        />
                        <input
                          type="date"
                          placeholder="End Date"
                          value={filters.dateRange.end}
                          onChange={(e) => handleDateRangeChange('end', e.target.value)}
                          className={`w-full px-3 py-2 text-sm rounded border ${
                            isDark 
                              ? "bg-gray-600 border-gray-500 text-white" 
                              : "bg-white border-gray-300 text-gray-900"
                          } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                        />
                      </div>
                    </div>

                    {/* Sort Options */}
                    <div>
                      <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}>
                        {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                        Sort By
                      </h3>
                      <div className="space-y-2">
                        {(['title', 'date', 'category', 'location'] as SortField[]).map(field => (
                          <button
                            key={field}
                            onClick={() => toggleSort(field)}
                            className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                              sortField === field
                                ? (isDark ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700')
                                : (isDark ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-100 text-gray-600')
                            }`}
                          >
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                            {sortField === field && (
                              <span className="ml-2">
                                {sortOrder === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {activeFiltersCount > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <button
                        onClick={clearAllFilters}
                        className={`text-sm px-4 py-2 rounded transition-colors ${
                          isDark 
                            ? 'text-gray-300 hover:bg-gray-600' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Clear All Filters
                      </button>
                    </div>
                  )}
                </div>
              )}
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
            <div className="flex items-center justify-between mb-8">
              <h2 className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                Projects ({filteredAndSortedProjects.length})
                {searchTerm && (
                  <span className={`text-lg font-normal ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {" "}for "{searchTerm}"
                  </span>
                )}
              </h2>
              
              {filteredAndSortedProjects.length === 0 && !loading && (
                <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  <p className="text-lg mb-2">No projects found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
            
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

            {filteredAndSortedProjects.length > (displayMode === 'grid' ? 6 : 10) && (
              <Pagination
                currentPage={projectPagination.currentPage}
                totalPages={projectPagination.totalPages}
                onPageChange={projectPagination.handlePageChange}
                isDark={isDark}
                variant="blue"
              />
            )}
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