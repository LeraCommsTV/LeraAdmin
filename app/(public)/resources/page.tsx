'use client';

import React, { useState, useEffect } from "react";
import { FaFilePdf } from "react-icons/fa";
import { Sun, Moon } from "lucide-react";

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  interface DownloadItem {
    title: string;
    description: string;
    fileName: string;
    fileSize: string;
    fileType: string;
  }

  const downloadItems: DownloadItem[] = [
    {
      title: "Company Profile",
      description:
        "We believe communication saves lives, so we inspire change by building capacity for health, social development across the spectrum of strategic communication design development.",
      fileName: "Lera Company Profile",
      fileSize: "1 file (9kb) | 17.2mb",
      fileType: "pdf",
    },
    {
      title: "Company Profile",
      description:
        "We believe communication saves lives, so we inspire change by building capacity for health, social development across the spectrum of strategic communication design development.",
      fileName: "Lera Company Profile",
      fileSize: "1 file (9kb) | 17.2mb",
      fileType: "pdf",
    },
  ];

  const handleDownload = (fileName: string) => {
    // Add your download logic here
    console.log(`Downloading ${fileName}`);
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 left-60 md:top-4 md:right-160 md:left-auto z-50 p-3 rounded-lg bg-green-600 dark:bg-green-700 shadow-lg border border-green-600 dark:border-green-700 hover:shadow-xl transition-all duration-300"
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5 text-white transition-transform duration-300 hover:rotate-180" />
        ) : (
          <Moon className="w-5 h-5 text-white transition-transform duration-300 hover:rotate-12" />
        )}
      </button>

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
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/70' : 'bg-black/50'} transition-colors duration-300`} />
        
        {/* Content */}
        <div className="relative h-full w-full flex flex-col justify-center items-end md:px-20 px-8 md:pt-28 md:pb-28 pt-52 pb-10 text-white min-h-screen">
          <div className="md:w-[60%]">
            <h1 className="text-2xl font-bold leading-8 mb-4">
              Create the kind of world you want to live in.
            </h1>
            <p className="font-thin text-sm font-mona">
              We use evidence-based research to inform policies and programs that
              improves lives. Our expertise cuts across various sectors- health,
              education, nutrition, environment, economic development, civil
              society, gender, youth and creativity- and geographies to address
              the full range of human developmental needs. Together, we unleash
              new ideas and opportunities and strengthen our collective capacity
              to drive change.
            </p>
          </div>
        </div>
      </div>

      {/* Downloads Section */}
      <div className={`space-y-6 py-12 px-8 md:px-24 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-900 text-white' 
          : 'bg-white text-gray-900'
      }`}>
        {downloadItems.map((item, index) => (
          <div key={index} className="py-6">
            <h3 className={`md:text-lg text-sm font-bold font-mona ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {item.title}
            </h3>
            <p className={`text-sm font-mona font-semibold mt-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {item.description}
            </p>
            <div className={`flex items-center justify-between mt-4 p-4 rounded-md border transition-colors duration-300 ${
              isDarkMode 
                ? 'border-gray-700 bg-gray-800' 
                : 'border-gray-200 bg-white'
            }`}>
              <div className="flex items-center">
                <FaFilePdf color="red" />
                <div className="ml-4">
                  <p className={`text-sm font-black font-mona ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.fileName}
                  </p>
                  <p className={`text-[10px] font-black font-mona ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {item.fileSize}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => handleDownload(item.fileName)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md shadow font-mona font-semibold transition-colors duration-300"
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}