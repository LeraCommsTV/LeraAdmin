// pages/contacts.tsx
"use client"
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Plus, Search, Edit, Trash2, X, Filter, Mail, Phone, Check, ChevronDown, Menu, Moon, Sun } from 'lucide-react';

// Define TypeScript interfaces
interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  isSubscriber: boolean;
  tags: string[];
  createdAt: string;
}

type FilterOption = 'all' | 'subscribers' | 'contacts';
type SortOption = 'name' | 'date' | 'email';

const ContactsPage = () => {
  // State management
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState<FilterOption>('all');
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [showForm, setShowForm] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    isSubscriber: false,
    tags: [] as string[],
    createdAt: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Load mock data
  useEffect(() => {
    const mockContacts: Contact[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(123) 456-7890',
        isSubscriber: true,
        tags: ['Client', 'VIP'],
        createdAt: '2025-04-15T10:30:00Z',
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '(456) 789-0123',
        isSubscriber: true,
        tags: ['Prospect'],
        createdAt: '2025-04-10T14:20:00Z',
      },
      {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '(789) 012-3456',
        isSubscriber: false,
        tags: ['Client'],
        createdAt: '2025-03-25T09:15:00Z',
      },
      {
        id: '4',
        name: 'Alice Williams',
        email: 'alice@example.com',
        phone: '(321) 654-0987',
        isSubscriber: true,
        tags: ['Client', 'Partner'],
        createdAt: '2025-04-05T16:45:00Z',
      },
      {
        id: '5',
        name: 'Chris Miller',
        email: 'chris@example.com',
        phone: '(555) 123-4567',
        isSubscriber: false,
        tags: ['Lead'],
        createdAt: '2025-04-20T11:10:00Z',
      },
    ];
    
    setContacts(mockContacts);
    setFilteredContacts(mockContacts);
  }, []);

  // Filter and sort contacts
  useEffect(() => {
    let result = [...contacts];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(contact => 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm) ||
        contact.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply type filter
    if (filterOption === 'subscribers') {
      result = result.filter(contact => contact.isSubscriber);
    } else if (filterOption === 'contacts') {
      result = result.filter(contact => !contact.isSubscriber);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortOption === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOption === 'email') {
        return a.email.localeCompare(b.email);
      }
      return 0;
    });
    
    setFilteredContacts(result);
  }, [contacts, searchTerm, filterOption, sortOption]);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      email: '',
      phone: '',
      isSubscriber: false,
      tags: [],
      createdAt: '',
    });
    setTagInput('');
    setFormErrors({ name: '', email: '', phone: '' });
    setSelectedContact(null);
  };

  const openForm = (contact?: Contact) => {
    if (contact) {
      setFormData({ ...contact });
      setSelectedContact(contact);
    } else {
      resetForm();
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const validateForm = () => {
    const errors = {
      name: '',
      email: '',
      phone: '',
    };
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Valid email is required';
    }
    
    if (formData.phone && !/^[(]?\d{3}[)]?[-\s]?\d{3}[-\s]?\d{4}$/.test(formData.phone)) {
      errors.phone = 'Valid phone number is required';
    }
    
    setFormErrors(errors);
    return !errors.name && !errors.email && !errors.phone;
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput],
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const now = new Date().toISOString();
      
      if (selectedContact) {
        // Update existing contact
        const updatedContacts = contacts.map(contact => 
          contact.id === selectedContact.id ? { ...formData } : contact
        );
        setContacts(updatedContacts);
      } else {
        // Add new contact
        const newContact: Contact = {
          ...formData,
          id: Math.random().toString(36).substring(2, 9),
          createdAt: now,
        };
        setContacts([...contacts, newContact]);
      }
      
      closeForm();
    }
  };

  const deleteContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      <Head>
        <title>Contacts & Subscribers Manager</title>
        <meta name="description" content="Manage your contacts and subscribers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button 
              className="md:hidden text-green-500"
              onClick={toggleMenu}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-green-500">Contacts Manager</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <button
              onClick={() => openForm()}
              className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Contact</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mb-6 p-4 rounded-lg shadow-md bg-gray-800 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Menu</h2>
              <button onClick={toggleMenu} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-3">
              <button 
                className={`w-full text-left px-3 py-2 rounded-md ${filterOption === 'all' ? 'bg-green-600 text-white' : 'hover:bg-gray-700'}`}
                onClick={() => { setFilterOption('all'); setIsMenuOpen(false); }}
              >
                All Contacts
              </button>
              <button 
                className={`w-full text-left px-3 py-2 rounded-md ${filterOption === 'subscribers' ? 'bg-green-600 text-white' : 'hover:bg-gray-700'}`}
                onClick={() => { setFilterOption('subscribers'); setIsMenuOpen(false); }}
              >
                Subscribers
              </button>
              <button 
                className={`w-full text-left px-3 py-2 rounded-md ${filterOption === 'contacts' ? 'bg-green-600 text-white' : 'hover:bg-gray-700'}`}
                onClick={() => { setFilterOption('contacts'); setIsMenuOpen(false); }}
              >
                Non-Subscribers
              </button>
            </nav>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar - Desktop only */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className="text-lg font-medium mb-4">Filters</h2>
              <nav className="space-y-2">
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md ${filterOption === 'all' ? 'bg-green-600 text-white' : `hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}`}
                  onClick={() => setFilterOption('all')}
                >
                  All Contacts
                </button>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md ${filterOption === 'subscribers' ? 'bg-green-600 text-white' : `hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}`}
                  onClick={() => setFilterOption('subscribers')}
                >
                  Subscribers
                </button>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md ${filterOption === 'contacts' ? 'bg-green-600 text-white' : `hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}`}
                  onClick={() => setFilterOption('contacts')}
                >
                  Non-Subscribers
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Search and Sort Bar */}
            <div className={`p-4 mb-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md border ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col sm:flex-row gap-3 justify-between`}>
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className={`pl-10 pr-4 py-2 w-full rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 focus:bg-gray-600' : 'bg-gray-100 border-gray-300 focus:bg-white'} border focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm whitespace-nowrap">Sort by:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className={`py-2 px-3 rounded-md ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                  <option value="name">Name</option>
                  <option value="date">Date Added</option>
                  <option value="email">Email</option>
                </select>
              </div>
            </div>

            {/* Contact List */}
            <div className={`rounded-lg shadow-md border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-medium">
                  {filterOption === 'all' && 'All Contacts'}
                  {filterOption === 'subscribers' && 'Subscribers'}
                  {filterOption === 'contacts' && 'Non-Subscribers'}
                  <span className="ml-2 text-sm text-gray-400">({filteredContacts.length})</span>
                </h2>
              </div>

              {filteredContacts.length > 0 ? (
                <ul className="divide-y divide-gray-700">
                  {filteredContacts.map((contact) => (
                    <li key={contact.id} className={`p-4 hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${contact.isSubscriber ? 'bg-green-600' : darkMode ? 'bg-gray-700' : 'bg-gray-200'} mr-3`}>
                              <span className="font-medium text-lg">{contact.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <h3 className="font-medium">{contact.name}</h3>
                              <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Mail size={14} />
                                  {contact.email}
                                </span>
                                {contact.phone && (
                                  <span className="flex items-center gap-1">
                                    <Phone size={14} />
                                    {contact.phone}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 items-center">
                          {contact.isSubscriber && (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-600/20 text-green-400 border border-green-500/30">
                              Subscriber
                            </span>
                          )}
                          
                          {contact.tags.map((tag) => (
                            <span key={tag} className={`px-2 py-1 text-xs rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-2 ml-auto">
                          <span className="text-xs text-gray-400">{formatDate(contact.createdAt)}</span>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => openForm(contact)}
                              className="p-1 text-gray-400 hover:text-green-500 rounded-full hover:bg-green-500/10"
                              aria-label="Edit contact"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => deleteContact(contact.id)}
                              className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-500/10"
                              aria-label="Delete contact"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-400">No contacts found. Try adjusting your filters or add a new contact.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Add/Edit Contact Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-md rounded-lg shadow-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-6 max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedContact ? 'Edit Contact' : 'Add New Contact'}
              </h2>
              <button 
                onClick={closeForm}
                className="text-gray-400 hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 rounded-md ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-green-500 ${formErrors.name ? 'border-red-500' : ''}`}
                    placeholder="John Doe"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                  )}
                </div>
                
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 rounded-md ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-green-500 ${formErrors.email ? 'border-red-500' : ''}`}
                    placeholder="john@example.com"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                  )}
                </div>
                
                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 rounded-md ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-green-500 ${formErrors.phone ? 'border-red-500' : ''}`}
                    placeholder="(123) 456-7890"
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
                  )}
                </div>
                
                {/* Subscriber Toggle */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isSubscriber"
                    name="isSubscriber"
                    checked={formData.isSubscriber}
                    onChange={handleFormChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isSubscriber" className="ml-2 block text-sm">
                    Subscriber
                  </label>
                </div>
                
                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-1">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag) => (
                      <div 
                        key={tag} 
                        className={`px-2 py-1 text-sm rounded-full flex items-center ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-gray-400 hover:text-gray-200"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={handleTagInputChange}
                      className={`flex-1 px-3 py-2 rounded-md ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-green-500`}
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                >
                  {selectedContact ? 'Update' : 'Save'} Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsPage;