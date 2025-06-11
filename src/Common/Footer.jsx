import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-[#1A1E43] text-white px-6 py-5">
      

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs gap-4">
        <div>© 2025 Công ty TNHH 8Bross</div>
        <div className="flex gap-6 text-white text-lg">
          <a href="https://www.facebook.com/lhuniversity" aria-label="Facebook" className="hover:text-blue-500"><FaFacebookF /></a>
          <a href="https://www.tiktok.com/@lhu.edu.vn" aria-label="Tiktok" className="hover:text-black"><FaTiktok /></a>
          <a href="#" aria-label="Twitter" className=" hover:text-blue-400"><FaTwitter /></a>

        </div>
      </div>
    </footer>
  );
};


export default Footer;
