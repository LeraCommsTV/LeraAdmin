import React from "react";
import { WhiteLogo } from "../../constant/imports";
import {
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  const menuText = "text-xs font-light font-mona";
  const headerText = "font-black mb-2 font-mona text-sm";
  const bottomFooter = "font-semibold mb-2 font-mona text-xs";
  return (
    <div className="w-full bg-[#545454] text-white py-4">
      {/* Top Header */}
      <div className="py-4 md:px-12 px-8">
        <p className="text-center font-mona font-semibold text-xs">
          16B, House 2, Ademola Adetokunbo, Wuse II, Abuja. | +234-9-2918264 |
          info@lera.org
        </p>
      </div>
      {/* Middle Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-start border-y border-y-white">
        <div className="flex flex-row flex-wrap justify-between pl-8 md:pl-28 pr-8 md:pr-16 border-r border-r-white md:pb-12 pb-0 pt-16">
          {/* Logo Section */}
          <div>
            <img
              src={WhiteLogo}
              alt="LERA Communications Logo"
              className="mb-4"
            />
          </div>

          {/* Useful Links */}
          <div>
            <h4 className={headerText}>Useful Links</h4>
            <ul className="space-y-1">
              <li>
                <a href="#" className={menuText}>
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className={menuText}>
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className={menuText}>
                  Projects
                </a>
              </li>
            </ul>
          </div>

          {/* Our Project */}
          <div>
            <h4 className={headerText}>Our Project</h4>
            <ul className="space-y-1">
              <li>
                <a href="#" className={menuText}>
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className={menuText}>
                  Press
                </a>
              </li>
              <li>
                <a href="#" className={menuText}>
                  Partnerships
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* Subscribe Section */}
        <div className=" pr-8 md:pr-28 pl-8 md:pl-16 pb-8 md:pt-16 pt-4 ">
          <h4 className={headerText}>Subscribe</h4>
          <p className={`${menuText} mb-4`}>
            Join our community to receive updates
          </p>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md focus:outline-none text-white font-medium font-mona placeholder:text-black"
            />
            <button className="bg-primary px-4 rounded-md">Subscribe</button>
          </div>
          <p className={`${menuText} mt-2`}>
            By subscribing, you agree to our Privacy Policy
          </p>
        </div>
      </div>
      {/* bottom Content */}
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between mt-6 pr-8 md:pl-28 pl-8 md:pr-16 pb-8 pt-3 md:space-y-2 space-y-0 gap-4">
        <div className="flex items-center gap-3">
          <div className="h-[30px] w-[30px] bg-white rounded-full flex justify-center items-center">
            <FaFacebook color="#545454" size={18} />
          </div>
          <div className="h-[30px] w-[30px] bg-white rounded-full flex justify-center items-center">
            <FaLinkedin color="#545454" size={18} />
          </div>
          <div className="h-[30px] w-[30px] bg-white rounded-full flex justify-center items-center">
            <FaInstagram color="#545454" size={18} />
          </div>
          <div className="h-[30px] w-[30px] bg-white rounded-full flex justify-center items-center">
            <FaYoutube color="#545454" size={18} />
          </div>
          <div className="h-[30px] w-[30px] bg-white rounded-full flex justify-center items-center">
            <FaTwitter color="#545454" size={18} />
          </div>
        </div>
        <div className="flex space-x-4">
          <p className={bottomFooter}>Privacy Policy</p>
          <p className={bottomFooter}>Terms of Service</p>
          <p className={bottomFooter}>Cookie Policy</p>
        </div>
        <p className={bottomFooter}>
          © 2024 Gender Dynamix Consult. All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
