  import React, { useState } from "react";
  import Banner from "../../Components/Banner";
  import SearchBox from "../../Components/componentUser/SearchBox";
  import FilterPanel from "../../Components/componentUser/FilterPanel";
  import RoomList from "../../Components/RoomList";
  import Modal from "../../Components/Modal";
  import Header from "../../Components/componentUser/Header";
  import Footer from "../../Common/Footer";
  import useRoomFilter from "../../hooks/useHome";
  import PromotionBanner from "../../Components/componentUser/PromotionCard";
  import { message } from "antd";

  // Thêm animate.css cho hiệu ứng mượt mà (cần import trong index.html hoặc CSS global)
  // <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>

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

    const handleCloseModal = () => {
      setShowModal(false);
      setSelectedRoomId(null);
    };

    const searchFields = [
      {
        name: "roomName",
        label: "Room Name",
        type: "text",
        placeholder: "Enter room name...",
        className: "transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-400",
      },
      {
        name: "roomType",
        label: "Room Type",
        type: "select",
        options: [
          { value: "", label: "All" },
          { value: "Phòng đơn", label: "Phòng đơn" },
          { value: "Phòng đôi", label: "Phòng đôi" },
          { value: "Phòng gia đình", label: "Phòng gia đình" },
        ],
        className: "transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-400",
      },
    ];

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
        <Header className="transition-all duration-300 ease-in-out shadow-md" />
        <main className="flex-1">
          <Banner className="animate__animated animate__zoomIn" />
          <div className="max-w-7xl mx-auto px-4 pt-10 pb-20">
            <div className="relative z-10 -mt-24 mb-12">
              <SearchBox
                fields={searchFields}
                onSearch={handleSearch}
                buttonText="Search Rooms"
                className="animate__animated animate__fadeInUp shadow-lg rounded-lg bg-white p-4"
              />
            </div>
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
                        className={`relative px-4 py-2 rounded-lg ${
                          currentPage === page + 1
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
            <PromotionBanner className="animate__animated animate__fadeIn shadow-md rounded-lg" />
          </div>
        </main>
        <Footer className="transition-all duration-300 ease-in-out shadow-md" />
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate__animated animate__fadeIn animate__faster">
            <Modal onClose={handleCloseModal}>
              <div className="bg-white rounded-lg shadow-xl p-6 w-[500px] transform transition-all duration-300 ease-in-out scale-95 animate__animated animate__zoomIn animate__faster">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Xác nhận đặt phòng</h2>
                {selectedRoom ? (
                  <>
                    <div className="space-y-3">
                      <p className="mb-2">
                        <strong className="text-gray-600">Trạng thái:</strong>{" "}
                        <span
                          className={
                            selectedRoom.tenTinhTrang === "Trống"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {selectedRoom.tenTinhTrang || "Không xác định"}
                        </span>
                      </p>
                      <p className="mb-2">
                        <strong className="text-gray-600">Phòng:</strong>{" "}
                        {selectedRoom.soPhong || "Không xác định"}
                      </p>
                      <p className="mb-2">
                        <strong className="text-gray-600">Loại phòng:</strong>{" "}
                        {selectedRoom.ghiChu || "Không xác định"}
                      </p>
                      <p className="mb-2">
                        <strong className="text-gray-600">Giá phòng:</strong>{" "}
                        {selectedRoom.giaPhong
                          ? `${selectedRoom.giaPhong.toLocaleString()} VND`
                          : "Không xác định"}
                      </p>
                      <p className="mb-4">
                        <strong className="text-gray-600">Số giường:</strong>{" "}
                        {selectedRoom.soGiuong || "Không xác định"}
                      </p>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={handleCloseModal}
                        className="relative px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all duration-200 ease-in-out overflow-hidden group"
                      >
                        <span className="absolute inset-0 bg-gray-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ease-in-out rounded-lg"></span>
                        Hủy
                      </button>
                      <button
                        onClick={() => {
                          if (selectedRoom && selectedRoom.tenTinhTrang === "Trống") {
                            console.log(`Đặt phòng ${selectedRoom.soPhong}`);
                            message.success("Đặt phòng thành công!");
                          } else {
                            message.error("Phòng hiện không khả dụng để đặt!");
                          }
                          handleCloseModal();
                        }}
                        disabled={selectedRoom?.tenTinhTrang !== "Trống"}
                        className={`relative px-4 py-2 rounded-lg ${
                          selectedRoom?.tenTinhTrang !== "Trống"
                            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        } transition-all duration-200 ease-in-out overflow-hidden group`}
                      >
                        <span className="absolute inset-0 bg-blue-800 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ease-in-out rounded-lg"></span>
                        Xác nhận
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="mb-4 text-red-500">Không tìm thấy thông tin phòng.</p>
                )}
              </div>
            </Modal>
          </div>
        )}
      </div>
    );
  };

  export default Home;