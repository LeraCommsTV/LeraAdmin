"use client";
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { uploadToCloudinary, deleteFromCloudinary, CloudinaryUploadResult } from '@/lib/cloudinary';
import { Sun, Moon } from 'lucide-react'; // Import Lucide icons

// Define types for our team member
interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  department: string;
  joinDate: string;
  avatar?: string;
  avatarPublicId?: string;
}

// Define errors type to include avatarFile
interface FormErrors {
  name?: string;
  email?: string;
  role?: string;
  department?: string;
  joinDate?: string;
  avatarFile?: string;
  form?: string;
}

export default function TeamMembers() {
  // State for team members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  
  // State for form inputs
  const emptyMember: TeamMember = {
    id: '',
    name: '',
    role: '',
    email: '',
    department: '',
    joinDate: '',
  };
  
  const [currentMember, setCurrentMember] = useState<TeamMember>(emptyMember);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark'); // Theme state
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Department options
  const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR', 'Finance'];
  
  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('light', savedTheme === 'light');
    } else {
      // Default to dark mode if no theme is saved
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };

  // Fetch team members from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'teamMembers'), (snapshot) => {
      const members: TeamMember[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as TeamMember[];
      setTeamMembers(members);
    }, (error) => {
      console.error('Error fetching team members:', error);
      setErrors({ form: 'Failed to fetch team members. Please try again.' });
    });
    return () => unsubscribe();
  }, []);
  
  // Filter members based on search term
  useEffect(() => {
    const filtered = teamMembers.filter(member => 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMembers(filtered);
  }, [searchTerm, teamMembers]);
  
  // Focus management for modal accessibility
  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      modalRef.current.focus();
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsModalOpen(false);
        }
      };
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [isModalOpen]);
  
  // Handler for input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentMember({
      ...currentMember,
      [name]: value,
    });
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  // Handler for file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, avatarFile: 'Only PNG, JPEG, or GIF images are allowed' }));
        setAvatarFile(null);
        setAvatarPreview(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, avatarFile: 'Image size must be less than 5MB' }));
        setAvatarFile(null);
        setAvatarPreview(null);
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, avatarFile: undefined }));
    } else {
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  };
  
  // Validate form inputs
  const validateForm = (member: TeamMember): FormErrors => {
    const newErrors: FormErrors = {};
    
    if (!member.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!member.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!member.role.trim()) {
      newErrors.role = 'Role is required';
    }
    
    if (!member.department) {
      newErrors.department = 'Department is required';
    }
    
    if (!member.joinDate) {
      newErrors.joinDate = 'Join date is required';
    }
    
    return newErrors;
  };
  
  // Add a new team member
  const handleAddMember = () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setCurrentMember(emptyMember);
    setAvatarFile(null);
    setAvatarPreview(null);
    setIsEditing(false);
    setIsModalOpen(true);
    setErrors({});
  };
  
  // Edit an existing team member
  const handleEditMember = (member: TeamMember) => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setCurrentMember(member);
    setAvatarFile(null);
    setAvatarPreview(member.avatar || null);
    setIsEditing(true);
    setIsModalOpen(true);
    setErrors({});
  };
  
  // Delete a team member
  const handleDeleteMember = async (id: string, avatarPublicId?: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      try {
        await deleteDoc(doc(db, 'teamMembers', id));
        if (avatarPublicId) {
          await deleteFromCloudinary(avatarPublicId);
        }
      } catch (error) {
        console.error('Error deleting team member:', error);
        setErrors({ form: 'Failed to delete team member. Please try again.' });
      }
    }
  };
  
  // Save the current member (add or update)
  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formErrors = validateForm(currentMember);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let avatarData: CloudinaryUploadResult | undefined;
      let oldAvatarPublicId = isEditing ? currentMember.avatarPublicId : undefined;
      
      if (avatarFile) {
        avatarData = await uploadToCloudinary(avatarFile);
      }
      
      const memberData: TeamMember = {
        ...currentMember,
        avatar: avatarData?.url || currentMember.avatar,
        avatarPublicId: avatarData?.publicId || currentMember.avatarPublicId,
      };
      
      if (isEditing) {
        await updateDoc(doc(db, 'teamMembers', currentMember.id), { ...memberData });
        if (avatarData && oldAvatarPublicId) {
          await deleteFromCloudinary(oldAvatarPublicId);
        }
      } else {
        const { id, ...dataToSave } = memberData; // Exclude id from data
        const docRef = await addDoc(collection(db, 'teamMembers'), dataToSave);
        memberData.id = docRef.id;
      }
      
      setIsModalOpen(false);
      setCurrentMember(emptyMember);
      setAvatarFile(null);
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
      setErrors({});
    } catch (error) {
      console.error('Error saving member:', error);
      setErrors({ form: 'Failed to save member. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-900 text-gray-100'}`}>
      <Head>
        <title>Team Members Management</title>
        <meta name="description" content="Manage your team members" />
      </Head>
      
      {/* Header */}
      <header className={`shadow-lg border-b ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-green-500'}`}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-green-400'}`}>Team Members</h1>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${theme === 'light' ? 'bg-gray-200 text-gray-900 hover:bg-gray-300' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'} transition-colors duration-200`}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
          </button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Search and Add section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 px-4 sm:px-0">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className={`h-5 w-5 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search members..."
                className={`block w-full pl-10 pr-3 py-2 border rounded-md leading-5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors duration-200 ${
                  theme === 'light' 
                    ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500' 
                    : 'bg-gray-700 border-gray-600 text-gray-300 placeholder-gray-400'
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={handleAddMember}
            className={`flex items-center gap-2 font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 ${
              theme === 'light' 
                ? 'bg-green-500 text-white hover:bg-green-600 focus:ring-offset-white' 
                : 'bg-green-600 text-white hover:bg-green-700 focus:ring-offset-gray-900'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Team Member
          </button>
        </div>
        
        {/* Team Members List */}
        <div className={`shadow-lg overflow-hidden sm:rounded-lg border ${
          theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'
        }`}>
          <div className={`px-4 py-5 sm:px-6 border-b ${
            theme === 'light' ? 'border-gray-200' : 'border-gray-700'
          }`}>
            <h2 className={`text-lg leading-6 font-medium ${
              theme === 'light' ? 'text-gray-900' : 'text-green-400'
            }`}>
              Team Members List
            </h2>
            <p className={`mt-1 max-w-2xl text-sm ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {filteredMembers.length} members found
            </p>
          </div>
          
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className={`${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'}`}>
                <tr>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'light' ? 'text-gray-700' : 'text-green-400'
                  }`}>
                    Name
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'light' ? 'text-gray-700' : 'text-green-400'
                  }`}>
                    Role
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'light' ? 'text-gray-700' : 'text-green-400'
                  }`}>
                    Department
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'light' ? 'text-gray-700' : 'text-green-400'
                  }`}>
                    Join Date
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'light' ? 'text-gray-700' : 'text-green-400'
                  }`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`${theme === 'light' ? 'bg-white divide-gray-200' : 'bg-gray-800 divide-gray-700'}`}>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <tr key={member.id} className={`hover:bg-gray-700 transition-colors duration-150 ${
                      theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'
                    }`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className={`h-10 w-10 rounded-full ring-2 ${
                                theme === 'light' ? 'ring-green-400' : 'ring-green-500'
                              }`} 
                              src={member.avatar || `/api/placeholder/40/40`} 
                              alt={member.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className={`text-sm font-medium ${
                              theme === 'light' ? 'text-gray-900' : 'text-white'
                            }`}>{member.name}</div>
                            <div className={`text-sm ${
                              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                            }`}>{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${
                          theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                        }`}>{member.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-200'
                        }`}>
                          {member.department}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        {new Date(member.joinDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleEditMember(member)}
                          className={`flex items-center gap-1 ${
                            theme === 'light' ? 'text-green-600 hover:text-green-500' : 'text-green-400 hover:text-green-300'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteMember(member.id, member.avatarPublicId)}
                          className={`flex items-center gap-1 ${
                            theme === 'light' ? 'text-red-600 hover:text-red-500' : 'text-red-400 hover:text-red-300'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className={`px-6 py-4 text-center text-sm ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      No team members found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Mobile Card View */}
          <div className="md:hidden">
            <ul className={`divide-y ${
              theme === 'light' ? 'divide-gray-200' : 'divide-gray-700'
            }`}>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <li key={member.id} className={`px-4 py-4 transition-colors duration-150 ${
                    theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img 
                          className={`h-10 w-10 rounded-full ring-2 ${
                            theme === 'light' ? 'ring-green-400' : 'ring-green-500'
                          }`} 
                          src={member.avatar || `/api/placeholder/40/40`}
                          alt={member.name}
                        />
                        <div className="ml-3">
                          <p className={`text-sm font-medium ${
                            theme === 'light' ? 'text-gray-900' : 'text-white'
                          }`}>{member.name}</p>
                          <p className={`text-sm ${
                            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                          }`}>{member.role}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditMember(member)}
                          className={`p-1 rounded-full transition-colors duration-150 ${
                            theme === 'light' ? 'text-green-600 hover:bg-green-100' : 'text-green-400 hover:bg-green-900'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteMember(member.id, member.avatarPublicId)}
                          className={`p-1 rounded-full transition-colors duration-150 ${
                            theme === 'light' ? 'text-red-600 hover:bg-red-100' : 'text-red-400 hover:bg-red-900'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 text-sm">
                      <div className={`text-gray-400 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Department:</div>
                      <div className={`text-gray-300 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-200'
                        }`}>
                          {member.department}
                        </span>
                      </div>
                      <div className={`text-gray-400 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Join Date:</div>
                      <div className={`text-gray-300 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{new Date(member.joinDate).toLocaleDateString()}</div>
                      <div className={`text-gray-400 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Email:</div>
                      <div className={`truncate ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{member.email}</div>
                    </div>
                  </li>
                ))
              ) : (
                <li className={`px-4 py-4 text-center text-sm ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  No team members found
                </li>
              )}
            </ul>
          </div>
        </div>
      </main>
      
      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            {/* Background overlay */}
            <div
              className={`fixed inset-1 transition-opacity duration-300 ${
                theme === 'light' ? 'bg-gray-500 bg-opacity-75' : 'bg-gray-900 bg-opacity-75'
              }`}
              aria-hidden="true"
              onClick={() => setIsModalOpen(false)}
            />
            
            {/* Modal panel */}
            <div
              ref={modalRef}
              tabIndex={-1}
              className={`relative inline-block rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full max-w-[95%] mx-4 scale-100 opacity-100 animate-in zoom-in-95 duration-200 ${
                theme === 'light' ? 'bg-white' : 'bg-gray-800'
              }`}
            >
              <form onSubmit={handleSaveMember} onClick={(e) => e.stopPropagation()}>
                <div className="px-6 pt-6 pb-4">
                  {/* Header */}
                  <div className="flex items-center mb-6">
                    <div className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full ${
                      theme === 'light' ? 'bg-green-100' : 'bg-green-900/50'
                    }`}>
                      {isEditing ? (
                        <svg className={`h-6 w-6 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      ) : (
                        <svg className={`h-6 w-6 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      )}
                    </div>
                    <h3 id="modal-title" className={`ml-3 text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-green-400'}`}>
                      {isEditing ? 'Edit Team Member' : 'Add Team Member'}
                    </h3>
                  </div>
                  
                  {/* Form error */}
                  {errors.form && (
                    <div className={`mb-4 p-3 rounded-md text-sm text-red-300 ${
                      theme === 'light' ? 'bg-red-100' : 'bg-red-900/50'
                    }`}>
                      {errors.form}
                    </div>
                  )}
                  
                  {/* Form fields */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="col-span-2">
                      <label htmlFor="name" className={`block text-sm font-medium ${
                        theme === 'light' ? 'text-gray-700' : 'text-green-400'
                      }`}>
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        className={`mt-1 block w-full rounded-md border shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2.5 transition-colors duration-200 ${
                          theme === 'light'
                            ? `bg-white border-gray-300 text-gray-900 ${errors.name ? 'border-red-500' : 'border-gray-300'}`
                            : `bg-gray-700 text-white ${errors.name ? 'border-red-500' : 'border-gray-600'}`
                        }`}
                        value={currentMember.name}
                        onChange={handleInputChange}
                        placeholder="Enter full name"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                      />
                      {errors.name && (
                        <p id="name-error" className={`mt-1 text-xs ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`}>{errors.name}</p>
                      )}
                    </div>
                    
                    <div className="col-span-2">
                      <label htmlFor="email" className={`block text-sm font-medium ${
                        theme === 'light' ? 'text-gray-700' : 'text-green-400'
                      }`}>
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        className={`mt-1 block w-full rounded-md border shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2.5 transition-colors duration-200 ${
                          theme === 'light'
                            ? `bg-white border-gray-300 text-gray-900 ${errors.email ? 'border-red-500' : 'border-gray-300'}`
                            : `bg-gray-700 text-white ${errors.email ? 'border-red-500' : 'border-gray-600'}`
                        }`}
                        value={currentMember.email}
                        onChange={handleInputChange}
                        placeholder="name@company.com"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                      />
                      {errors.email && (
                        <p id="email-error" className={`mt-1 text-xs ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`}>{errors.email}</p>
                      )}
                    </div>
                    
                    <div className="col-span-2 sm:col-span-1">
                      <label htmlFor="role" className={`block text-sm font-medium ${
                        theme === 'light' ? 'text-gray-700' : 'text-green-400'
                      }`}>
                        Role
                      </label>
                      <input
                        type="text"
                        name="role"
                        id="role"
                        required
                        className={`mt-1 block w-full rounded-md border shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2.5 transition-colors duration-200 ${
                          theme === 'light'
                            ? `bg-white border-gray-300 text-gray-900 ${errors.role ? 'border-red-500' : 'border-gray-300'}`
                            : `bg-gray-700 text-white ${errors.role ? 'border-red-500' : 'border-gray-600'}`
                        }`}
                        value={currentMember.role}
                        onChange={handleInputChange}
                        placeholder="e.g. Frontend Developer"
                        aria-invalid={!!errors.role}
                        aria-describedby={errors.role ? 'role-error' : undefined}
                      />
                      {errors.role && (
                        <p id="role-error" className={`mt-1 text-xs ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`}>{errors.role}</p>
                      )}
                    </div>
                    
                    <div className="col-span-2 sm:col-span-1">
                      <label htmlFor="department" className={`block text-sm font-medium ${
                        theme === 'light' ? 'text-gray-700' : 'text-green-400'
                      }`}>
                        Department
                      </label>
                      <select
                        name="department"
                        id="department"
                        required
                        className={`mt-1 block w-full rounded-md border shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2.5 transition-colors duration-200 ${
                          theme === 'light'
                            ? `bg-white border-gray-300 text-gray-900 ${errors.department ? 'border-red-500' : 'border-gray-300'}`
                            : `bg-gray-700 text-white ${errors.department ? 'border-red-500' : 'border-gray-600'}`
                        }`}
                        value={currentMember.department}
                        onChange={handleInputChange}
                        aria-invalid={!!errors.department}
                        aria-describedby={errors.department ? 'department-error' : undefined}
                      >
                        <option value="" disabled>Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      {errors.department && (
                        <p id="department-error" className={`mt-1 text-xs ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`}>{errors.department}</p>
                      )}
                    </div>
                    
                    <div className="col-span-2 sm:col-span-1">
                      <label htmlFor="joinDate" className={`block text-sm font-medium ${
                        theme === 'light' ? 'text-gray-700' : 'text-green-400'
                      }`}>
                        Join Date
                      </label>
                      <input
                        type="date"
                        name="joinDate"
                        id="joinDate"
                        required
                        className={`mt-1 block w-full rounded-md border shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2.5 transition-colors duration-200 ${
                          theme === 'light'
                            ? `bg-white border-gray-300 text-gray-900 ${errors.joinDate ? 'border-red-500' : 'border-gray-300'}`
                            : `bg-gray-700 text-white ${errors.joinDate ? 'border-red-500' : 'border-gray-600'}`
                        }`}
                        value={currentMember.joinDate}
                        onChange={handleInputChange}
                        aria-invalid={!!errors.joinDate}
                        aria-describedby={errors.joinDate ? 'joinDate-error' : undefined}
                      />
                      {errors.joinDate && (
                        <p id="joinDate-error" className={`mt-1 text-xs ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`}>{errors.joinDate}</p>
                      )}
                    </div>
                    
                    <div className="col-span-2 sm:col-span-1">
                      <label htmlFor="avatarFile" className={`block text-sm font-medium ${
                        theme === 'light' ? 'text-gray-700' : 'text-green-400'
                      }`}>
                        Avatar <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>(optional)</span>
                      </label>
                      <input
                        type="file"
                        name="avatarFile"
                        id="avatarFile"
                        accept="image/png,image/jpeg,image/gif"
                        ref={fileInputRef}
                        className={`mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold transition-colors duration-200 ${
                          theme === 'light'
                            ? `text-gray-700 file:bg-green-500 file:text-white hover:file:bg-green-600 ${errors.avatarFile ? 'border-red-500' : 'border-gray-300'}`
                            : `text-gray-300 file:bg-green-600 file:text-white hover:file:bg-green-700 ${errors.avatarFile ? 'border-red-500' : 'border-gray-600'}`
                        }`}
                        onChange={handleFileChange}
                        aria-invalid={!!errors.avatarFile}
                        aria-describedby={errors.avatarFile ? 'avatarFile-error' : undefined}
                      />
                      {errors.avatarFile && (
                        <p id="avatarFile-error" className={`mt-1 text-xs ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`}>{errors.avatarFile}</p>
                      )}
                      {avatarPreview && (
                        <div className="mt-2">
                          <img
                            src={avatarPreview}
                            alt="Avatar preview"
                            className={`h-12 w-12 rounded-full object-cover ring-2 ${
                              theme === 'light' ? 'ring-green-400' : 'ring-green-500'
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Footer */}
                <div className={`px-6 py-4 sm:flex sm:flex-row-reverse sm:gap-3 ${
                  theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'
                }`}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full sm:w-auto inline-flex justify-center items-center rounded-md px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 sm:text-sm transition-colors duration-200 ${
                      theme === 'light'
                        ? `bg-green-500 hover:bg-green-600 focus:ring-offset-white ${
                            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                          }`
                        : `bg-green-600 hover:bg-green-700 focus:ring-offset-gray-900 ${
                            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                          }`
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      isEditing ? 'Update Member' : 'Add Member'
                    )}
                  </button>
                  <button
                    type="button"
                    className={`w-full sm:w-auto mt-3 sm:mt-0 inline-flex justify-center rounded-md px-4 py-2 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 sm:text-sm transition-colors duration-200 ${
                      theme === 'light'
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-offset-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-offset-gray-900'
                    }`}
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}