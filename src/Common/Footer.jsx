import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-[#1A1E43] text-white px-6 py-5">
      

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs gap-4">
        <div>© 2025 Công ty TNHH 8Bross</div>
        <div className="flex gap-4 text-white text-lg">
          <a href="#" aria-label="Twitter" className={iconClass}><FaTwitter /></a>
          <a href="#" aria-label="LinkedIn" className={iconClass}><FaLinkedinIn /></a>
          <a href="#" aria-label="WhatsApp" className={iconClass}><FaWhatsapp /></a>
          <a href="#" aria-label="Facebook" className={iconClass}><FaFacebookF /></a>
        </div>
      </div>
    </footer>
  );
};


const iconClass = "hover:text-indigo-400 transition-colors";

export default Footer;
