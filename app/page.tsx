"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  BarChart3, 
  FileText, 
  Globe, 
  Home, 
  LogOut, 
  Menu, 
  MessageSquare, 
  Settings, 
  Users, 
  Megaphone,
  Clock,
  Calendar,
  ArrowRight
} from 'lucide-react';

export default function AdminWelcomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-green-600 dark:text-green-400 text-xl font-bold">LERA Communications</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/signin" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
                Dashboard
              </Link>
              <Link href="/signin" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
                Campaigns
              </Link>
              <Link href="/signin" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
                Content
              </Link>
              <Link href="/" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
                View Site
              </Link>
              <Link href="/signin" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
                Blog
              </Link>
              <Link href="/signin" className="ml-4 px-4 py-2 border border-green-600 text-green-600 dark:text-green-400 rounded-md hover:bg-green-50 dark:hover:bg-gray-700">
                Sign In
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 focus:outline-none"
              >
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white dark:bg-gray-800 shadow-lg`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/signin" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 rounded-md">
              Dashboard
            </Link>
            <Link href="/signin" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 rounded-md">
              Campaigns
            </Link>
            <Link href="/signin" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 rounded-md">
              Content
            </Link>
            <Link href="/signin" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 rounded-md">
              View Site
            </Link>
            <Link href="/signin" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 rounded-md">
              Blog
            </Link>
            <Link href="/signin" className="block px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Login
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <div className="flex-grow flex flex-col md:flex-row items-center justify-center p-4 md:p-8 lg:p-12">
        {/* Left Column - Text Content */}
        <div className="w-full md:w-1/2 flex flex-col space-y-6 mb-8 md:mb-0 md:pr-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
            Welcome to <span className="text-green-600 dark:text-green-400">LERA Communications</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg">
            Your central command center for managing all communications, campaigns, and content across your organization.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/signin" className="px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition duration-200">
              Go to Dashboard
            </Link>
            <Link href="/signin" className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200">
              Create Campaign
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6">
            <div className="text-center p-3">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">54</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Campaigns</div>
            </div>
            <div className="text-center p-3">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">15.2k</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Audience Reach</div>
            </div>
            <div className="text-center p-3 col-span-2 sm:col-span-1">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">89%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate</div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Admin Features */}
        <div className="w-full md:w-1/2">
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Admin Dashboard</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Quick access to your communication tools</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Admin Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <AdminQuickLink 
                  icon={<Megaphone size={20} />}
                  title="Campaigns"
                  description="Manage your active campaigns"
                  href="/projects"
                />
                <AdminQuickLink 
                  icon={<FileText size={20} />}
                  title="Content"
                  description="Edit website and blog content"
                  href="/signin"
                />
                <AdminQuickLink 
                  icon={<MessageSquare size={20} />}
                  title="Messages"
                  description="View and respond to inquiries"
                  href="/blogs"
                />
                <AdminQuickLink 
                  icon={<BarChart3 size={20} />}
                  title="Analytics"
                  description="Track performance metrics"
                  href="/signin"
                />
              </div>
              
              {/* Recent Updates */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Updates</h3>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  <UpdateItem 
                    title="Q2 Campaign Strategy" 
                    time="2 hours ago"
                    type="document"
                  />
                  <UpdateItem 
                    title="Social Media Calendar" 
                    time="Yesterday"
                    type="calendar"
                  />
                  <UpdateItem 
                    title="Press Release Draft" 
                    time="3 days ago"
                    type="document"
                  />
                </div>
                
                <div className="mt-4 text-right">
                  <Link href="/signin" className="inline-flex items-center text-green-600 dark:text-green-400 hover:underline">
                    <span>View all activity</span>
                    <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-gray-700 dark:text-gray-300">© 2025 CommsHub. All rights reserved.</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/signin" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400">
                Help Center
              </Link>
              <Link href="/signin" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400">
                Settings
              </Link>
              <Link href="/home" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400">
                Public Site
              </Link>
              <Link href="/blogs" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400">
                Blog
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Admin Quick Link Component
function AdminQuickLink({ icon, title, description, href }: { icon: React.ReactNode; title: string; description: string; href: string }) {
  return (
    <Link 
      href={href}
      className="flex flex-col p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-green-50 dark:hover:bg-gray-600 transition duration-200"
    >
      <div className="flex items-center mb-2">
        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-md text-green-600 dark:text-green-400">
          {icon}
        </div>
        <h3 className="ml-3 font-medium text-gray-900 dark:text-white">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </Link>
  );
}

// Update Item Component
function UpdateItem({ title, time, type }: { title: string; time: string; type: 'document' | 'calendar' | 'clock' }) {
  return (
    <div className="py-3 flex items-center">
      <div className="mr-3 bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
        {type === 'document' && <FileText size={16} className="text-green-600 dark:text-green-400" />}
        {type === 'calendar' && <Calendar size={16} className="text-green-600 dark:text-green-400" />}
        {type === 'clock' && <Clock size={16} className="text-green-600 dark:text-green-400" />}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
      </div>
      <Link href="#" className="text-green-600 dark:text-green-400">
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}