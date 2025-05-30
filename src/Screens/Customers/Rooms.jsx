import React, { useState } from "react";
import FilterPanel from "../../Components/componentUser/FilterPanel";
import RoomList from "../../Components/RoomList";
import Header from "../../Components/componentUser/Header";
import Footer from "../../Common/Footer";
import useRoomFilter from "../../hooks/useHome";
import { message, Button } from "antd";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SearchBox from "../../Components/componentUser/SearchBox";


const Rooms = () => {
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
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    handleSearch(e.target.value);
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
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header className="transition-all duration-300 ease-in-out shadow-md" />

      {/* Hero Section */}
      <div className="relative bg-gray-800 h-96 w-full overflow-hidden">
        <img
          src="https://digital.ihg.com/is/image/ihg/hotel-indigo-ho-chi-minh-city-10436107250-2x1"
          alt=""
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold animate__animated animate__fadeInDown">
            Tìm Phòng Hoàn Hảo Cho Bạn
          </h1>
          <p className="mt-4 text-lg md:text-xl animate__animated animate__fadeIn">
            Khám phá những căn phòng sang trọng với mức giá phù hợp
          </p>
          <Button
            type="primary"
            onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
            className=" mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 animate__animated animate__pulse animate__infinite"
          >
            Khám phá ngay
          </Button>
        </div>
      </div>

      <main className="flex-1">
        {/* Breadcrumb và nút quay lại */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 ">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
               Trang chủ
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600 font-medium">Danh sách phòng</span>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ml-15 mr-15">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 text-gray-800 animate__animated animate__fadeInDown">
              Danh sách Phòng
            </h1>
            <p className="text-center mb-6 text-gray-600 animate__animated animate__fadeIn">
              Tổng số phòng: <span className="font-semibold text-blue-600">{totalRooms}</span>
            </p>
            <SearchBox onSearch={handleSearch} />
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/4 w-full">
              <div className="sticky top-4">
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
            </div>
            <div className="lg:w-3/4 w-full">
              {currentRooms.length > 0 ? (
                <RoomList
                  filteredRooms={currentRooms}
                  onBookRoom={handleBookRoom}
                />
              ) : (
                <div className="text-center py-20">
                  <div className="text-gray-500 animate__animated animate__fadeIn">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      ></path>
                    </svg>
                    <h3 className="text-lg font-medium mb-2">Không tìm thấy phòng nào</h3>
                    <p className="text-sm">Hãy thử điều chỉnh bộ lọc để tìm kiếm phòng phù hợp</p>
                  </div>
                </div>
              )}

              {/* Pagination */}
              {totalRooms > roomsPerPage && (
                <div className="flex justify-between items-center mt-8 overflow-x-auto">
                  <p className="text-gray-600 text-sm">
                    Hiển thị {indexOfFirstRoom + 1} - {Math.min(indexOfLastRoom, totalRooms)} trên {totalRooms} phòng
                  </p>
                  <div className="flex space-x-2">
                    
                    <Button
                      type="primary"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative px-4 py-2 bg-gray-300 text-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition-all duration-200"
                    >
                      <span className="absolute inset-0 bg-gray-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ease-in-out rounded-lg"></span>
                      Trước
                    </Button>
                    {[...Array(totalPages).keys()].map((page) => (
                      <Button
                        type="default"
                        key={page + 1}
                        onClick={() => handlePageChange(page + 1)}
                        className={`relative px-4 py-2 rounded-lg ${
                          currentPage === page + 1
                            ? "bg-blue-600 text-white"
                            : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                        } transition-all duration-200`}
                      >
                        <span className="absolute inset-0 bg-blue-700 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ease-in-out rounded-lg"></span>
                        {page + 1}
                      </Button>
                    ))}
                    <Button
                      type="primary"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative px-4 py-2 bg-gray-300 text-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition-all duration-200"
                    >
                      <span className="absolute inset-0 bg-gray-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ease-in-out rounded-lg"></span>
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="my-12 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 animate__animated animate__fadeIn">
              Nhận Xét Từ Khách Hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "Nguyễn Văn A", comment: "Phòng sạch sẽ, nhân viên thân thiện!", rating: 5 },
                { name: "Trần Thị B", comment: "Vị trí thuận tiện, giá cả hợp lý.", rating: 4 },
              ].map((review, index) => (
                <div key={index} className="border-l-4 border-blue-600 pl-4">
                  <p className="text-gray-600 italic">"{review.comment}"</p>
                  <p className="mt-2 font-semibold">{review.name}</p>
                  <p className="text-yellow-500">{"★".repeat(review.rating)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="my-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 animate__animated animate__fadeIn">
              Câu Hỏi Thường Gặp
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Làm thế nào để đặt phòng?</h3>
                <p className="text-gray-600">
                  Chọn phòng bạn muốn, nhấp vào "Đặt ngay" và làm theo hướng dẫn để hoàn tất đặt phòng.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Chính sách hủy phòng là gì?</h3>
                <p className="text-gray-600">
                  Bạn có thể hủy phòng miễn phí trong vòng 24 giờ trước khi nhận phòng. Vui lòng kiểm tra chi tiết khi đặt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer className="transition-all duration-300 ease-in-out shadow-md" />
    </div>
  );
};

export default Rooms;