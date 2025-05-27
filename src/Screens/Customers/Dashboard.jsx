import React, { useState } from "react";
import Banner from "../../Components/Banner";

import FilterPanel from "../../Components/componentUser/FilterPanel";
import RoomList from "../../Components/RoomList";
import Header from "../../Components/componentUser/Header";
import Footer from "../../Common/Footer";
import useRoomFilter from "../../hooks/useHome";
import PromotionBanner from "../../Components/componentUser/PromotionCard";
import { message } from "antd";
import IntroTyping from "../../Components/componentUser/IntroTyping";
import Introdution from "../../Components/componentUser/Introdution";



const Home = () => {
  const {
    filteredRooms,
    minPrice,
    maxPrice,
    minPriceLimit,
    maxPriceLimit,
    roomTypeOptions,
    selectedRoomTypes,
    handleSearch,
    handleMinPriceChange,
    handleMaxPriceChange,
    handleRoomTypeChange,
    handleResetFilter,
    loading,
    error,
  } = useRoomFilter();

  const [showModal, setShowModal] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 8;

  const handleBookRoom = (roomId) => {
    const room = filteredRooms.find((r) => r.maPhong === roomId);
    if (!room || room.tenTinhTrang !== "Trống") {
      message.error("Phòng hiện không khả dụng để đặt!");
      return;
    }
    console.log("Room ID selected:", roomId);
    setSelectedRoomId(roomId);
    setShowModal(true);
  };
 

  const selectedRoom = filteredRooms.find((r) => r.maPhong === selectedRoomId);

  const totalRooms = filteredRooms.length;
  const totalPages = Math.ceil(totalRooms / roomsPerPage);
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="flex justify-center items-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg" // Sửa xmlns đúng
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8h-8z"
            ></path>
          </svg>
          <span className="ml-2 text-gray-600">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 animate__animated animate__fadeIn">
        Lỗi: {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <IntroTyping className="animate__animated animate__fadeInDown mb-10" />
      <div className="bg-gray-50 min-h-screen flex flex-col">


        <Header className="transition-all duration-300 ease-in-out shadow-md" />
        <main className="flex-1">
          <Banner className="animate__animated animate__zoomIn " />
          <div className="max-w-8xl mx-auto px-4 pr-10 pl-10 pt-10  ml-10 mr-10 animate__animated animate__fadeIn ">

            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 animate__animated animate__fadeInDown">
              Danh sách Phòng
            </h1>
            <p className="text-center mb-6 text-gray-600 animate__animated animate__fadeIn">
              Tổng số phòng: {totalRooms}
            </p>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/5 w-full">
                <FilterPanel
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  minPriceLimit={minPriceLimit}
                  maxPriceLimit={maxPriceLimit}
                  roomTypeOptions={roomTypeOptions}
                  selectedRoomTypes={selectedRoomTypes}
                  onMinPriceChange={handleMinPriceChange}
                  onMaxPriceChange={handleMaxPriceChange}
                  onRoomTypeChange={handleRoomTypeChange}
                  onResetFilter={handleResetFilter}
                  className="animate__animated animate__fadeInLeft shadow-md rounded-lg bg-white p-4"
                />
              </div>
              <div className="lg:w-4/5 w-full">
                {currentRooms.length > 0 ? (
                  <RoomList
                    filteredRooms={currentRooms}
                    onBookRoom={handleBookRoom}
                  /> // Sử dụng RoomList
                ) : (
                  <div className="text-center py-10 text-gray-500 animate__animated animate__fadeIn">
                    Không tìm thấy phòng nào.
                  </div>
                )}
                {totalRooms > roomsPerPage && (
                  <div className="flex justify-center pb-20 space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative px-4 py-2 bg-gray-300 text-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition-all duration-200 ease-in-out overflow-hidden group"
                    >
                      <span className="absolute inset-0 bg-gray-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ease-in-out rounded-lg"></span>
                      Trước
                    </button>
                    {[...Array(totalPages).keys()].map((page) => (
                      <button
                        key={page + 1}
                        onClick={() => handlePageChange(page + 1)}
                        className={`relative px-4 py-2 rounded-lg ${currentPage === page + 1
                          ? "bg-blue-600 text-white"
                          : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                          } transition-all duration-200 ease-in-out overflow-hidden group`}
                      >
                        <span className="absolute inset-0 bg-blue-700 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ease-in-out rounded-lg"></span>
                        {page + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative px-4 py-2 bg-gray-300 text-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition-all duration-200 ease-in-out overflow-hidden group"
                    >
                      <span className="absolute inset-0 bg-gray-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ease-in-out rounded-lg"></span>
                      Sau
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
          <PromotionBanner className="animate__animated animate__fadeIn shadow-md rounded-lg bg-gray " />
          <Introdution className="animate__animated animate__fadeIn shadow-md rounded-lg bg-white " />


        </main>
        <Footer className="transition-all duration-300 ease-in-out shadow-md" />

      </div>
    </div>
  );
};

export default Home;