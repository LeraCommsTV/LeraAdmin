"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Search, Eye, Calendar, Clock, Video, Loader2 } from 'lucide-react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

const PodcastAdminPage = () => {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<PodcastEpisode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<PodcastEpisode>({
    id: '',
    title: '',
    description: '',
    thumbnail: '',
    duration: '',
    views: '0',
    publishedAt: new Date().toISOString().split('T')[0],
    category: 'Technology',
    youtubeId: ''
  });

  const [youtubeUrl, setYoutubeUrl] = useState('');

  const categories = ['Technology', 'Blockchain', 'Science', 'Business', 'Health', 'Finance','Agriculture','Media','Humanitarian'];

  // Real-time listener for episodes
  useEffect(() => {
    const q = query(collection(db, 'episodes'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const episodesData: PodcastEpisode[] = [];
      
      snapshot.forEach((doc) => {
        episodesData.push({
          id: doc.id,
          title: doc.data().title || '',
          description: doc.data().description || '',
          thumbnail: doc.data().thumbnail || '',
          duration: doc.data().duration || '',
          views: doc.data().views || '0',
          publishedAt: doc.data().publishedAt || '',
          category: doc.data().category || 'Technology',
          youtubeId: doc.data().youtubeId || '',
          createdAt: doc.data().createdAt
        });
      });
      
      setEpisodes(episodesData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching episodes:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredEpisodes = episodes.filter(episode =>
    episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    episode.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Generate thumbnail URL from YouTube video ID
  const getYouTubeThumbnail = (videoId: string): string => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  // Handle YouTube URL change
  const handleYouTubeUrlChange = (url: string) => {
    setYoutubeUrl(url);
    const videoId = extractYouTubeId(url);
    
    if (videoId) {
      const thumbnail = getYouTubeThumbnail(videoId);
      setFormData(prev => ({
        ...prev,
        youtubeId: videoId,
        thumbnail: thumbnail
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        youtubeId: '',
        thumbnail: ''
      }));
    }
  };

  const openModal = useCallback((episode?: PodcastEpisode) => {
    if (episode) {
      setEditingEpisode(episode);
      setFormData(episode);
      setYoutubeUrl(`https://www.youtube.com/watch?v=${episode.youtubeId}`);
    } else {
      setEditingEpisode(null);
      setYoutubeUrl('');
      setFormData({
        id: '',
        title: '',
        description: '',
        thumbnail: '',
        duration: '',
        views: '0',
        publishedAt: new Date().toISOString().split('T')[0],
        category: 'Technology',
        youtubeId: ''
      });
    }
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingEpisode(null);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formData.title || !formData.description || !formData.youtubeId) {
      alert('Please fill in all required fields including a valid YouTube URL');
      return;
    }
    
    setSaving(true);
    
    try {
      if (editingEpisode) {
        // Update existing episode
        const episodeRef = doc(db, 'episodes', editingEpisode.id);
        await updateDoc(episodeRef, {
          title: formData.title,
          description: formData.description,
          thumbnail: formData.thumbnail,
          duration: formData.duration,
          views: formData.views,
          publishedAt: formData.publishedAt,
          category: formData.category,
          youtubeId: formData.youtubeId
        });
        alert('Episode updated successfully!');
      } else {
        // Add new episode
        await addDoc(collection(db, 'episodes'), {
          ...formData,
          createdAt: new Date().toISOString()
        });
        alert('Episode created successfully!');
      }
      
      closeModal();
    } catch (error) {
      console.error('Error saving episode:', error);
      alert('Failed to save episode. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [editingEpisode, formData, closeModal]);

  const handleDelete = useCallback(async (id: string, title: string) => {
    // Validate ID before attempting delete
    if (!id || typeof id !== 'string' || id.trim() === '') {
      console.error('Invalid episode ID:', id);
      alert('Cannot delete episode: Invalid ID');
      return;
    }

    if (confirm(`Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`)) {
      try {
        const episodeRef = doc(db, 'episodes', id);
        await deleteDoc(episodeRef);
        alert('Episode deleted successfully!');
      } catch (error) {
        console.error('Error deleting episode:', error);
        alert('Failed to delete episode. Please try again.');
      }
    }
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-green-500" size={48} />
          <p className="text-gray-300 text-lg">Loading episodes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 to-gray-900 shadow-lg border-b border-gray-700 sticky top-0 z-10 backdrop-blur-sm bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                LeraTalk Admin
              </h1>
              <p className="text-sm text-gray-400 mt-1">Manage podcast episodes with real-time sync</p>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-green-500/50 hover:scale-105"
            >
              <Plus size={20} />
              Add Episode
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl p-6 border border-gray-700 hover:border-green-500 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">Total Episodes</p>
                <p className="text-4xl font-bold text-white mt-2">{episodes.length}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-xl shadow-lg">
                <Video className="text-white" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">Total Views</p>
                <p className="text-4xl font-bold text-white mt-2">
                  {episodes.reduce((sum, ep) => sum + parseInt(ep.views.replace('K', '000')), 0) / 1000}K
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-4 rounded-xl shadow-lg">
                <Eye className="text-white" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">Categories</p>
                <p className="text-4xl font-bold text-white mt-2">{categories.length}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-xl shadow-lg">
                <Calendar className="text-white" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl p-6 mb-8 border border-gray-700">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search episodes by title or category..."
              className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Episodes Table */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Episode</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Published</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredEpisodes.map((episode) => (
                  <tr key={episode.id || Math.random()} className="hover:bg-slate-700/50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={episode.thumbnail}
                          alt=""
                          className="w-24 h-14 object-cover rounded-lg shadow-lg border border-gray-600"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{episode.title}</p>
                          <p className="text-xs text-gray-400 truncate mt-1">{episode.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md">
                        {episode.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{episode.duration}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{episode.views}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{formatDate(episode.publishedAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            console.log('Edit clicked for:', episode.id, episode.title);
                            openModal(episode);
                          }}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => {
                            console.log('Delete clicked for:', episode.id, episode.title);
                            handleDelete(episode.id, episode.title);
                          }}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredEpisodes.length === 0 && (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">No episodes found</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-slate-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingEpisode ? 'Edit Episode' : 'Add New Episode'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Episode Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-slate-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    YouTube URL *
                  </label>
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-2 bg-slate-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Paste full YouTube URL or video ID
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.thumbnail && (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Video Thumbnail Preview
                  </label>
                  <img
                    src={formData.thumbnail}
                    alt="YouTube thumbnail preview"
                    className="w-full h-60 object-cover rounded-lg border-2 border-green-500 shadow-lg"
                    onError={(e) => {
                      e.currentTarget.src = `https://img.youtube.com/vi/${formData.youtubeId}/hqdefault.jpg`;
                    }}
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Thumbnail automatically fetched from YouTube
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Duration *
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="45:32"
                    className="w-full px-4 py-2 bg-slate-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Views
                  </label>
                  <input
                    type="text"
                    name="views"
                    value={formData.views}
                    onChange={handleInputChange}
                    placeholder="125K"
                    className="w-full px-4 py-2 bg-slate-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Published Date *
                  </label>
                  <input
                    type="date"
                    name="publishedAt"
                    value={formData.publishedAt}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-600 rounded-lg font-medium text-gray-300 hover:bg-gray-700 transition-colors duration-200"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-500/50"
                >
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      {editingEpisode ? 'Update Episode' : 'Create Episode'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PodcastAdminPage;