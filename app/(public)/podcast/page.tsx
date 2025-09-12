"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Play, Clock, Eye, Calendar, Search, Filter, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

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
}

const PodcastPage = () => {
  const [episodes] = useState<PodcastEpisode[]>([
    {
      id: '1',
      title: 'The Future of Artificial Intelligence with Dr. Sarah Chen',
      description: 'Exploring the cutting-edge developments in AI and machine learning, discussing ethical implications and future possibilities.',
      thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=225&fit=crop',
      duration: '45:32',
      views: '125K',
      publishedAt: '2024-01-15',
      category: 'Technology',
      youtubeId: 'PvkZuCFa8ng'
    },
    {
      id: '2',
      title: 'Blockchain Revolution: Beyond Cryptocurrency',
      description: 'Deep dive into blockchain Leranology applications beyond digital currencies, featuring industry experts.',
      thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=225&fit=crop',
      duration: '38:15',
      views: '89K',
      publishedAt: '2024-01-08',
      category: 'Blockchain',
      youtubeId: 'dQw4w9WgXcQ'
    },
    {
      id: '3',
      title: 'Quantum Computing: The Next Frontier',
      description: 'Understanding quantum computing principles and their potential impact on various industries.',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=225&fit=crop',
      duration: '52:18',
      views: '156K',
      publishedAt: '2024-01-01',
      category: 'Science',
      youtubeId: 'jNQXAC9IVRw'
    },
    {
      id: '4',
      title: 'Startup Success Stories: Lessons from Silicon Valley',
      description: 'Interviews with successful entrepreneurs sharing their journey from idea to IPO.',
      thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=225&fit=crop',
      duration: '41:07',
      views: '201K',
      publishedAt: '2023-12-25',
      category: 'Business',
      youtubeId: 'oHg5SJYRHA0'
    },
    {
      id: '5',
      title: 'Cybersecurity in the Modern Age',
      description: 'Protecting digital assets and understanding current cybersecurity threats and solutions.',
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=225&fit=crop',
      duration: '36:42',
      views: '97K',
      publishedAt: '2023-12-18',
      category: 'Technology',
      youtubeId: 'RgKAFK5djSk'
    }
  ]);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

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
  const categories = useMemo(() => 
    ['All', ...Array.from(new Set(episodes.map(ep => ep.category)))],
    [episodes]
  );

  // Set initial episode
  useEffect(() => {
    if (episodes.length > 0 && !selectedEpisode) {
      setSelectedEpisode(episodes[0]);
    }
  }, [episodes, selectedEpisode]);

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
      className={`bg-white rounded-lg shadow-md overflow-hidden mb-4 cursor-pointer transition-all duration-300 hover:shadow-lg focus-within:ring-2 focus-within:ring-green-500
        ${selectedEpisode?.id === episode.id ? 'ring-2 ring-green-500 bg-green-50' : ''}`}
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
          <h4 className="font-semibold text-sm text-gray-800 line-clamp-2 mb-1">
            {episode.title}
          </h4>
          <div className="flex items-center text-gray-500 text-xs mb-1">
            <Eye size={12} className="mr-1 flex-shrink-0" aria-hidden="true" />
            <span>{episode.views}</span>
          </div>
          <div className="flex items-center text-gray-500 text-xs">
            <Calendar size={12} className="mr-1 flex-shrink-0" aria-hidden="true" />
            <span>{formatDate(episode.publishedAt)}</span>
          </div>
        </div>
      </div>
    </article>
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="pt-14 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-green-900">LeraTalk</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Video Player */}
          <section className="flex-1 lg:w-3/4" aria-labelledby="main-episode-title">
            {selectedEpisode && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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
                        className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label={isPlaying ? 'Pause episode' : 'Play episode'}
                      >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        aria-label="Skip back 10 seconds"
                      >
                        <SkipBack size={20} />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        aria-label="Skip forward 10 seconds"
                      >
                        <SkipForward size={20} />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        aria-label="Volume control"
                      >
                        <Volume2 size={20} />
                      </button>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDuration(currentTime)} / {selectedEpisode.duration}
                    </div>
                  </div>

                  <h2 id="main-episode-title" className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedEpisode.title}
                  </h2>
                  
                  <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mb-4">
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
                    <span className="text-xs font-semibold text-green-600 bg-blue-100 px-2 py-1 rounded-full">
                      {selectedEpisode.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed">{selectedEpisode.description}</p>
                </div>
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
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  size={20} 
                  aria-hidden="true"
                />
                <input
                  id="episode-search"
                  type="text"
                  placeholder="Search episodes..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent transition-colors duration-200"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Filter size={20} className="text-gray-500 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm font-medium text-gray-700">Filter by category:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                        ${selectedCategory === category
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
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
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Episodes ({filteredEpisodes.length})
              </h3>
              <div className="max-h-[calc(100vh-400px)] overflow-y-auto space-y-2 pr-2">
                {filteredEpisodes.map((episode) => (
                  <SidebarEpisodeCard key={episode.id} episode={episode} />
                ))}
                {filteredEpisodes.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
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
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">LeraTalk</h3>
            <p className="text-gray-400 mb-4">Stay updated with the latest episodes</p>
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