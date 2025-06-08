import React, { useState, useEffect } from "react";
import { Button, Spin, Pagination as AntdPagination } from "antd";
import { ToastContainer, toast } from "react-toastify";
import BookingListContainer from "../../Components/componentsEmployee/BookingListContainer";
import EmployeeBookingFilter from "../../Components/componentsEmployee/EmployeeBookingFilter";
import EmployeeBookingForm from "../../Components/componentsEmployee/EmployeeBookingForm";
import { getBooking, addBooking, updateBooking } from "../../apis/apibooking";
import EmployeeSideBar from "../../Components/componentsEmployee/EmployeeSideBar";
import EmployeeHeader from "../../Components/componentsEmployee/EmployeeHeader";

const EmployeeBookingList = () => {
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalPages: 1,
    totalRecords: 0,
  });
  const [filters, setFilters] = useState({ search: "" });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  useEffect(() => {
    fetchBooking();
  }, [pagination.page, pagination.pageSize]);

  const fetchBooking = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
      }
      const response = await getBooking(pagination.page, pagination.pageSize);
      if (
        !response ||
        typeof response !== "object" ||
        !Array.isArray(response.data)
      ) {
        throw new Error("Dữ liệu API không hợp lệ");
      }

      setBookingData(response.data);
      setPagination({
        ...pagination,
        totalRecords: response.totalRecords || response.data.length || 0,
        totalPages:
          response.totalPages ||
          Math.ceil(
            (response.totalRecords || response.data.length) /
              pagination.pageSize
          ) ||
          1,
      });
    } catch (err) {
      console.error("Lỗi API:", err.message);
      setError(err.message);
      setBookingData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 });
  };

  const handleAddBooking = () => {
    setEditingBooking(null);
    setIsFormVisible(true);
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setIsFormVisible(true);
  };

  const handleSaveBooking = async (values) => {
    try {
      if (editingBooking) {
        await updateBooking({ ...editingBooking, ...values });
        toast.success("Cập nhật thành công");
      } else {
        await addBooking(values);
        toast.success("Thêm thành công");
      }
      fetchBooking();
      setIsFormVisible(false);
    } catch (error) {
      console.error("Lỗi khi lưu danh sách:", error.message);
      toast.error("Lỗi khi lưu danh sách: " + error.message);
    }
  };

  const filteredBooking = bookingData.filter((boo) => {
    const searchText = filters.search.toLowerCase();
    return (boo.maDatPhong || "").toString().toLowerCase().includes(searchText);
  });

  return (
    <div className="flex h-screen">
      <EmployeeSideBar />
      <div className="flex flex-col flex-1">
        <EmployeeHeader />
        <div className="flex-1 p-6 bg-gray-100 overflow-auto">
          <h1 className="text-2xl font-bold mb-4">Danh Sách Đặt Phòng</h1>

          <Button
            type="primary"
            onClick={handleAddBooking}
            className="mb-4 bg-blue-500 hover:bg-blue-600 border-none"
          >
            Đặt Phòng
          </Button>

          <EmployeeBookingFilter onFilterChange={handleFilterChange} />

          {loading ? (
            <div className="flex justify-center my-10">
              <Spin size="large" />
            </div>
          ) : error ? (
            <p className="text-red-500">Lỗi: {error}</p>
          ) : (
            <BookingListContainer
              booking={filteredBooking}
              onEdit={handleEditBooking}
            />
          )}

          <AntdPagination
            current={pagination.page}
            pageSize={pagination.pageSize}
            total={pagination.totalRecords}
            onChange={(page, pageSize) =>
              setPagination({ ...pagination, page, pageSize })
            }
            showSizeChanger
            pageSizeOptions={["10", "20", "50"]}
            className="mt-4 flex justify-end"
          />

          <EmployeeBookingForm
            visible={isFormVisible}
            onCancel={() => setIsFormVisible(false)}
            onSave={handleSaveBooking}
            customer={editingBooking}
          />

          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default EmployeeBookingList;


