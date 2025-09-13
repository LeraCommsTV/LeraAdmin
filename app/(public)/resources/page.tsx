'use client';

import React, { useState, useEffect } from "react";
import { FaFilePdf, FaDownload, FaEye } from "react-icons/fa";
import { Sun, Moon, ArrowRight, CheckCircle, Users, Award, Globe } from "lucide-react";
import { useTheme } from '@/context/ThemeContext';

export default function HomePage() {
  const { isDark } = useTheme();
  const [downloadStatus, setDownloadStatus] = useState<{[key: string]: 'idle' | 'downloading' | 'success' | 'error'}>({});

  interface DownloadItem {
    title: string;
    description: string;
    fileName: string;
    fileType: string;
    category: string;
    lastUpdated: string;
  }

  const downloadItems: DownloadItem[] = [
    {
      title: "Company Profile",
      description: "Comprehensive overview of our mission, vision, services, and impact across health, education, and social development sectors.",
      fileName: "Lera Profile",
      fileType: "pdf",
      category: "Corporate",
      lastUpdated: "2024"
    },
    {
      title: "Services Brochure",
      description: "Detailed information about our strategic communication services, capacity building programs, and consulting offerings.",
      fileName: "Lera Services",
      fileType: "pdf",
      category: "Services",
      lastUpdated: "2024"
    }
  ];

  const handleDownload = async (fileName: string) => {
    try {
      setDownloadStatus(prev => ({ ...prev, [fileName]: 'downloading' }));
      
      // Try different possible paths
      const possiblePaths = [
        `/document/${fileName}.pdf`,
        `/${fileName}.pdf`,
        `/public/document/${fileName}.pdf`,
        `/documents/${fileName}.pdf`
      ];
      
      let fileUrl = null;
      let response = null;
      
      // Test each path to find the correct one
      for (const path of possiblePaths) {
        try {
          console.log(`Trying path: ${path}`);
          response = await fetch(path, { method: 'HEAD' });
          if (response.ok) {
            fileUrl = path;
            console.log(`Found file at: ${path}`);
            break;
          }
        } catch (err) {
          console.log(`Path ${path} failed:`, err);
          continue;
        }
      }
      
      if (!fileUrl || !response?.ok) {
        console.error('File not found at any of the expected paths:', possiblePaths);
        throw new Error(`File not found. Tried paths: ${possiblePaths.join(', ')}`);
      }
      
      // Create download link
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `${fileName}.pdf`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloadStatus(prev => ({ ...prev, [fileName]: 'success' }));
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setDownloadStatus(prev => ({ ...prev, [fileName]: 'idle' }));
      }, 3000);
      
    } catch (error) {
      console.error('Download failed:', error);
      setDownloadStatus(prev => ({ ...prev, [fileName]: 'error' }));
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setDownloadStatus(prev => ({ ...prev, [fileName]: 'idle' }));
      }, 3000);
    }
  };


  const stats = [
    { icon: Users, label: "Lives Impacted", value: "10k+", description: "Across Media & development programs" },
    { icon: Globe, label: "Countries", value: "5+", description: "Strategic partnerships worldwide" },
    { icon: Award, label: "Years Experience", value: "15+", description: "In evidence-based research" }
  ];

  return (
    <div className={isDark ? 'dark' : ''}>
      {/* Hero Section with Background Image */}
      <div className="relative min-h-screen">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')`
          }}
        />
        
        {/* Overlay */}
        <div className={`absolute inset-0 ${isDark ? 'bg-black/75' : 'bg-black/60'} transition-colors duration-300`} />
        
        {/* Content */}
        <div className="relative h-full w-full flex flex-col justify-center items-end md:px-20 px-6 py-20 text-white min-h-screen">
          <div className="md:w-[65%] lg:w-[55%] space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-green-600/20 backdrop-blur-sm border border-green-400/30 rounded-full">
              <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
              <span className="text-sm font-medium text-green-100">Evidence-Based Impact Since 2017</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Create the kind of{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                  world
                </span>{' '}
                you want to live in
              </h1>
              
              <p className="text-lg md:text-xl leading-relaxed text-gray-200 font-light max-w-2xl">
                We transform communities through evidence-based research and strategic communication. 
                Our expertise spans health, education, nutrition, and social development to address 
                the full spectrum of human developmental needs.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center group">
                Explore Our Impact
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-white/30 hover:border-white/50 text-white px-8 py-4 rounded-lg font-semibold backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                Download Resources
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className={`py-20 transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-900 text-white' 
          : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
                  isDark ? 'bg-green-600/20' : 'bg-green-100'
                }`}>
                  <stat.icon className={`w-8 h-8 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-green-600">{stat.value}</h3>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.label}</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Downloads Section */}
      <div className={`py-20 transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-800 text-white' 
          : 'bg-white text-gray-900'
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Resources & Publications
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Access our comprehensive collection of research papers, company profiles, 
              and strategic communication resources
            </p>
          </div>

          {/* Download Items */}
          <div className="space-y-8">
            {downloadItems.map((item, index) => (
              <div key={index} className={`p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                isDark 
                  ? 'border-gray-700 bg-gray-900 hover:shadow-gray-900/20' 
                  : 'border-gray-200 bg-white hover:shadow-gray-200/50'
              }`}>
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isDark 
                          ? 'bg-green-600/20 text-green-400' 
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {item.category}
                      </span>
                      <span className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Updated {item.lastUpdated}
                      </span>
                    </div>
                    <h3 className={`text-xl md:text-2xl font-bold mb-3 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.title}
                    </h3>
                    <p className={`text-base leading-relaxed ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* File Info & Actions */}
                <div className={`flex items-center justify-between p-6 rounded-xl border ${
                  isDark 
                    ? 'border-gray-700 bg-gray-800' 
                    : 'border-gray-100 bg-gray-50'
                }`}>
                  <div className="flex items-center">
                    <div className="p-3 bg-red-500/10 rounded-lg mr-4">
                      <FaFilePdf className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <p className={`font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.fileName}.pdf
                      </p>
                   
                    </div>
                  </div>

                  <div className="flex gap-3">
                 
                    
                    <button 
                      onClick={() => handleDownload(item.fileName)}
                      disabled={downloadStatus[item.fileName] === 'downloading'}
                      className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                        downloadStatus[item.fileName] === 'success'
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : downloadStatus[item.fileName] === 'error'
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      } ${downloadStatus[item.fileName] === 'downloading' ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                      {downloadStatus[item.fileName] === 'downloading' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Downloading...
                        </>
                      ) : downloadStatus[item.fileName] === 'success' ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Downloaded
                        </>
                      ) : downloadStatus[item.fileName] === 'error' ? (
                        <>
                          <FaDownload className="w-4 h-4" />
                          Retry Download
                        </>
                      ) : (
                        <>
                          <FaDownload className="w-4 h-4" />
                          Download
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}