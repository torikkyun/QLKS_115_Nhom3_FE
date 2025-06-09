import React from "react";
import Banner from "../../Components/Banner";
import Header from "../../Components/componentUser/Header";
import Footer from "../../Common/Footer";
import PromotionBanner from "../../Components/componentUser/PromotionCard";
import IntroTyping from "../../Components/componentUser/IntroTyping";
import Introdution from "../../Components/componentUser/Introdution";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <IntroTyping className="animate__animated animate__fadeInDown" />
      <Header className="transition-all duration-300 ease-in-out shadow-md" />
      
      <main className="flex-1">
        <Banner className="animate__animated animate__zoomIn" />
        <PromotionBanner className="animate__animated animate__fadeIn shadow-md rounded-lg bg-gray" />
        <div className="relative py-12">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 px-4 text-gray-500 text-sm font-semibold">KHÁM PHÁ THÊM</span>
          </div>
        </div>
        
        <Introdution className="animate__animated animate__fadeIn shadow-md rounded-lg bg-white" />
      </main>

      {/* Gradient divider trước footer */}
      <div className="h-1 bg-gradient-to-r from-blue-100 via-blue-300 to-blue-100 my-4"></div>
      
      <Footer className="transition-all duration-300 ease-in-out shadow-md" />
    </div>
  );
};

export default Home;