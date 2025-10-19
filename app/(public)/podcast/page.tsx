"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Play, Clock, Eye, Calendar, Search, Filter, Pause, SkipForward, SkipBack, Volume2, Loader2 } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useTheme } from '@/context/ThemeContext';

interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: string;
  publishedAt: string;
  category: string;
  youtubeId: string;
  createdAt?: any;
}

const PodcastPage = () => {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(episodes[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const { isDark } = useTheme();

  // Real-time listener for episodes from Firebase
  useEffect(() => {
    const q = query(collection(db, 'episodes'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const episodesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PodcastEpisode[];
      
      setEpisodes(episodesData);
      setLoading(false);
      
      // Set first episode as selected if none selected
      if (!selectedEpisode && episodesData.length > 0) {
        setSelectedEpisode(episodesData[0]);
      }
    }, (error) => {
      console.error('Error fetching episodes:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Memoized filtered episodes for better performance
  const filteredEpisodes = useMemo(() => {
    let filtered = episodes;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(episode => episode.category === selectedCategory);
    }
    
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(episode =>
        episode.title.toLowerCase().includes(searchLower) ||
        episode.description.toLowerCase().includes(searchLower) ||
        episode.category.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }, [episodes, selectedCategory, searchTerm]);

  // Memoized categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        episodes
          .map(ep => ep.category)
          .filter(cat => cat && cat.trim() && cat !== '') // Explicitly exclude empty strings
      )
    );
    return ['All', ...uniqueCategories];
  }, [episodes]);

  // Optimized handlers with useCallback
  const handleEpisodeSelect = useCallback((episode: PodcastEpisode) => {
    setSelectedEpisode(episode);
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  const formatDuration = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Memoized component for better performance
  const SidebarEpisodeCard = React.memo(({ episode }: { episode: PodcastEpisode }) => (
    <article
      onClick={() => handleEpisodeSelect(episode)}
      className={`rounded-lg shadow-md overflow-hidden mb-4 cursor-pointer transition-all duration-300 hover:shadow-lg focus-within:ring-2 focus-within:ring-green-500
        ${isDark 
          ? `bg-gray-800 hover:bg-gray-750 ${selectedEpisode?.id === episode.id ? 'ring-2 ring-green-500 bg-gray-700' : ''}` 
          : `bg-white hover:bg-gray-50 ${selectedEpisode?.id === episode.id ? 'ring-2 ring-green-500 bg-green-50' : ''}`
        }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleEpisodeSelect(episode)}
      aria-label={`Play episode: ${episode.title}`}
    >
      <div className="flex">
        <div className="relative flex-shrink-0 w-24 h-14">
          <img
            src={episode.thumbnail}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white px-1 py-0.5 text-xs rounded">
            {episode.duration}
          </div>
        </div>
        <div className="p-3 flex-1 min-w-0">
          <h4 className={`font-semibold text-sm line-clamp-2 mb-1 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
            {episode.title}
          </h4>
          <div className={`flex items-center text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <Eye size={12} className="mr-1 flex-shrink-0" aria-hidden="true" />
            <span>{episode.views}</span>
          </div>
          <div className={`flex items-center text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <Calendar size={12} className="mr-1 flex-shrink-0" aria-hidden="true" />
            <span>{formatDate(episode.publishedAt)}</span>
          </div>
        </div>
      </div>
    </article>
  ));

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-green-600" size={48} />
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Loading episodes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-40">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Video Player */}
          <section className="flex-1 lg:w-3/4" aria-labelledby="main-episode-title">
            {selectedEpisode ? (
              <div className={`rounded-xl shadow-lg overflow-hidden transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="relative bg-gray-900" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${selectedEpisode.youtubeId}?rel=0&modestbranding=1`}
                    title={selectedEpisode.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                
                {/* Custom Controls */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={togglePlayPause}
                        className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        aria-label={isPlaying ? 'Pause episode' : 'Play episode'}
                      >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                      </button>
                      <button
                        className={`p-2 rounded-full transition-colors duration-200 ${
                          isDark 
                            ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                        aria-label="Skip back 10 seconds"
                      >
                        <SkipBack size={20} />
                      </button>
                      <button
                        className={`p-2 rounded-full transition-colors duration-200 ${
                          isDark 
                            ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                        aria-label="Skip forward 10 seconds"
                      >
                        <SkipForward size={20} />
                      </button>
                      <button
                        className={`p-2 rounded-full transition-colors duration-200 ${
                          isDark 
                            ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                        aria-label="Volume control"
                      >
                        <Volume2 size={20} />
                      </button>
                    </div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatDuration(currentTime)} / {selectedEpisode.duration}
                    </div>
                  </div>

                  <h2 id="main-episode-title" className={`text-2xl font-bold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                    {selectedEpisode.title}
                  </h2>
                  
                  <div className={`flex flex-wrap items-center gap-4 text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div className="flex items-center">
                      <Eye size={16} className="mr-1" aria-hidden="true" />
                      <span>{selectedEpisode.views} views</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1" aria-hidden="true" />
                      <span>{selectedEpisode.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" aria-hidden="true" />
                      <span>{formatDate(selectedEpisode.publishedAt)}</span>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      isDark 
                        ? 'text-green-400 bg-green-900/30' 
                        : 'text-green-600 bg-green-100'
                    }`}>
                      {selectedEpisode.category}
                    </span>
                  </div>
                  
                  <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {selectedEpisode.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className={`rounded-xl shadow-lg p-12 text-center transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No episodes available yet</p>
                <p className={`text-sm mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Check back soon for new content!</p>
              </div>
            )}
          </section>

          {/* Sidebar */}
          <aside className="w-full lg:w-1/4" aria-label="Episode list and filters">
            {/* Search and Filter */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <label htmlFor="episode-search" className="sr-only">Search episodes</label>
                <Search 
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                  size={20} 
                  aria-hidden="true"
                />
                <input
                  id="episode-search"
                  type="text"
                  placeholder="Search episodes..."
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent transition-colors duration-200 ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Filter size={20} className={`flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} aria-hidden="true" />
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Filter by category:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                        ${selectedCategory === category
                          ? 'bg-green-600 text-white'
                          : isDark
                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      aria-pressed={selectedCategory === category}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Episode List */}
            <div className="space-y-2">
              <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                Episodes ({filteredEpisodes.length})
              </h3>
              <div className="max-h-[calc(100vh-400px)] overflow-y-auto space-y-2 pr-2">
                {filteredEpisodes.map((episode) => (
                  <SidebarEpisodeCard key={episode.id} episode={episode} />
                ))}
                {filteredEpisodes.length === 0 && (
                  <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Search size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No episodes found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filter</p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className={`mt-16 transition-colors duration-300 ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-900 text-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">LeraTalk</h3>
            <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>Stay updated with the latest episodes</p>
            <button className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900">
              Subscribe on YouTube
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PodcastPage;