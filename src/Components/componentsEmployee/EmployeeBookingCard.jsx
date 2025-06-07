import React from "react";

const EmployeeBookingCard = ({ booking }) => {
  // Hàm định dạng ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có dữ liệu";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  // Kiểm tra nếu không có dữ liệu đặt phòng, hiển thị thông báo.
  if (!booking) {
    return <p className="text-gray-500 p-4">Không có dữ liệu đặt phòng để hiển thị.</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 transform transition-transform hover:scale-105 duration-300 ease-in-out">
      {/* Nút Trả Phòng */}
      
      <div className="border-b pb-4 mb-4">
        <h3 className="text-2xl font-bold text-blue-700">
          Thông tin đặt phòng #{booking.maDatPhong}
        </h3>
        <span className="text-sm text-gray-500">
          Ngày đặt: {formatDate(booking.ngayDatPhong)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chi tiết đặt phòng */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-lg font-semibold text-blue-600 mb-2">Chi tiết đặt phòng</h4>
          <div className="flex justify-between items-center py-1">
            <span className="font-medium text-gray-700">Số phòng đặt:</span>
            <span className="text-blue-800 font-semibold">{booking.soPhongDat}</span>
          </div>
          {booking.ghiChu && (
            <div className="flex justify-between items-center py-1">
              <span className="font-medium text-gray-700">Ghi chú:</span>
              <span className="text-gray-600 italic">{booking.ghiChu}</span>
            </div>
          )}
        </div>

        {/* Thông tin khách hàng và nhân viên */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-green-700 mb-2">Thông tin khách hàng</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Mã KH:</span> <span className="text-green-800">{booking.khachHang?.maKhachHang || "N/A"}</span></p>
              <p><span className="font-medium">Họ tên:</span> <span className="text-green-800">{booking.khachHang?.ho} {booking.khachHang?.ten}</span></p>
              <p><span className="font-medium">Email:</span> <span className="text-green-800">{booking.khachHang?.email || "N/A"}</span></p>
              <p><span className="font-medium">SĐT:</span> <span className="text-green-800">{booking.khachHang?.sdt || "N/A"}</span></p>
              <p><span className="font-medium">CCCD:</span> <span className="text-green-800">{booking.khachHang?.cccd || "N/A"}</span></p>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-purple-700 mb-2">Nhân viên phụ trách</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Mã NV:</span> <span className="text-purple-800">{booking.nhanVien?.maNhanVien || "N/A"}</span></p>
              <p><span className="font-medium">Họ tên:</span> <span className="text-purple-800">{booking.nhanVien?.ho} {booking.nhanVien?.ten}</span></p>
              <p><span className="font-medium">Email:</span> <span className="text-purple-800">{booking.nhanVien?.email || "N/A"}</span></p>
              <p><span className="font-medium">SĐT:</span> <span className="text-purple-800">{booking.nhanVien?.sdt || "N/A"}</span></p>
              <p><span className="font-medium">Vai trò:</span> <span className="text-purple-800">{booking.nhanVien?.vaiTro === 1 ? "Quản lý" : "Nhân viên"}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeBookingCard;






















/*
import React, { useState, useEffect } from "react";
import "./card.css";
import { getBooking } from "../../apis/apibooking";

const EmployeeBookingCard = () => {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBooking() {
      try {
        const response = await getBooking(1, 10); // Gọi API lấy dữ liệu
        if (!response || typeof response !== "object" || !Array.isArray(response.data)) {
          throw new Error("API không trả về dữ liệu hợp lệ.");
        }

        setBookingData(response.data.length > 0 ? response.data[0] : null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBooking();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có dữ liệu";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-500">Lỗi: {error}</p>;
  if (!bookingData) return <p>Không có dữ liệu đặt phòng.</p>;

  return (
    <div className="booking-card">
      <div className="booking-header">
        <h3>Thông tin đặt phòng #{bookingData.maDatPhong}</h3>
        <span className="booking-date">{formatDate(bookingData.ngayDatPhong)}</span>
      </div>

      <div className="booking-details">
        <div className="detail-item">
          <span className="detail-label">Số phòng đặt:</span>
          <span className="detail-value">{bookingData.soPhongDat}</span>
        </div>

        {bookingData.ghiChu && (
          <div className="detail-item">
            <span className="detail-label">Ghi chú:</span>
            <span className="detail-value">{bookingData.ghiChu}</span>
          </div>
        )}
      </div>

      <div className="customer-staff-section">
        <div className="customer-info">
          <h4>Thông tin khách hàng</h4>
          <div className="info-item">
            <span>Mã KH:</span>
            <span>{bookingData.khachHang?.maKhachHang || "N/A"}</span>
          </div>
          <div className="info-item">
            <span>Họ tên:</span>
            <span>{bookingData.khachHang?.ho} {bookingData.khachHang?.ten}</span>
          </div>
          <div className="info-item">
            <span>Email:</span>
            <span>{bookingData.khachHang?.email || "N/A"}</span>
          </div>
          <div className="info-item">
            <span>SĐT:</span>
            <span>{bookingData.khachHang?.sdt || "N/A"}</span>
          </div>
          <div className="info-item">
            <span>CCCD:</span>
            <span>{bookingData.khachHang?.cccd || "N/A"}</span>
          </div>
        </div>

        <div className="staff-info">
          <h4>Nhân viên phụ trách</h4>
          <div className="info-item">
            <span>Mã NV:</span>
            <span>{bookingData.nhanVien?.maNhanVien || "N/A"}</span>
          </div>
          <div className="info-item">
            <span>Họ tên:</span>
            <span>{bookingData.nhanVien?.ho} {bookingData.nhanVien?.ten}</span>
          </div>
          <div className="info-item">
            <span>Email:</span>
            <span>{bookingData.nhanVien?.email || "N/A"}</span>
          </div>
          <div className="info-item">
            <span>SĐT:</span>
            <span>{bookingData.nhanVien?.sdt || "N/A"}</span>
          </div>
          <div className="info-item">
            <span>Vai trò:</span>
            <span>{bookingData.nhanVien?.vaiTro === 1 ? "Quản lý" : "Nhân viên"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeBookingCard;
*/




/*
import React from "react";
import "./card.css";

const EmployeeBookingCard = () => {
  const bookingData = {
    maDatPhong: "",
    ngayDatPhong: "",
    soPhongDat: 0,
    ghiChu: "",
    nhanVien: {
      maNhanVien: "",
      ho: "",
      ten: "",
      email: "",
      sdt: "",
      cccd: "",
      vaiTro: "",
    },
    khachHang: {
      maKhachHang: "",
      ho: "",
      ten: "",
      email: "",
      sdt: "",
      cccd: "",
    },
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  return (
    <div className="booking-card">
      <div className="booking-header">
        <h3>Thông tin đặt phòng #{bookingData.maDatPhong}</h3>
        <span className="booking-date">
          {formatDate(bookingData.ngayDatPhong)}
        </span>
      </div>

      <div className="booking-details">
        <div className="detail-item">
          <span className="detail-label">Số phòng đặt:</span>
          <span className="detail-value">{bookingData.soPhongDat}</span>
        </div>

        {bookingData.ghiChu && (
          <div className="detail-item">
            <span className="detail-label">Ghi chú:</span>
            <span className="detail-value">{bookingData.ghiChu}</span>
          </div>
        )}
      </div>

      <div className="customer-staff-section">
        <div className="customer-info">
          <h4>Thông tin khách hàng</h4>
          <div className="info-item">
            <span>Mã KH:</span>
            <span>{bookingData.khachHang.maKhachHang}</span>
          </div>
          <div className="info-item">
            <span>Họ tên:</span>
            <span>{`${bookingData.khachHang.ho} ${bookingData.khachHang.ten}`}</span>
          </div>
          <div className="info-item">
            <span>Email:</span>
            <span>{bookingData.khachHang.email}</span>
          </div>
          <div className="info-item">
            <span>SĐT:</span>
            <span>{bookingData.khachHang.sdt}</span>
          </div>
          <div className="info-item">
            <span>CCCD:</span>
            <span>{bookingData.khachHang.cccd}</span>
          </div>
        </div>

        <div className="staff-info">
          <h4>Nhân viên phụ trách</h4>
          <div className="info-item">
            <span>Mã NV:</span>
            <span>{bookingData.nhanVien.maNhanVien}</span>
          </div>
          <div className="info-item">
            <span>Họ tên:</span>
            <span>{`${bookingData.nhanVien.ho} ${bookingData.nhanVien.ten}`}</span>
          </div>
          <div className="info-item">
            <span>Email:</span>
            <span>{bookingData.nhanVien.email}</span>
          </div>
          <div className="info-item">
            <span>SĐT:</span>
            <span>{bookingData.nhanVien.sdt}</span>
          </div>
          <div className="info-item">
            <span>Vai trò:</span>
            <span>
              {bookingData.nhanVien.vaiTro === 1 ? "Quản lý" : "Nhân viên"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeBookingCard;
*/

/*
import React from "react";
import { Table, Button, Space } from "antd";
import { EditOutlined } from "@ant-design/icons";

const EmployeeBookingCard = ({ booking, onEdit }) => {
  const columns = [
    { title: "Mã Phòng", dataIndex: "maPhong", key: "maPhong" },
    { title: "Loại Dịch Vụ", dataIndex: "dichVuIds", key: "dichVuIds" },
    { title: "Ngày Đặt Phòng", dataIndex: "ngayDatPhong", key: "ngayDatPhong" },
    { title: "Ngày Trả Phòng", dataIndex: "ngayTraPhong", key: "ngayTraPhong" },
    { title: "Khuyến Mãi", dataIndex: "khuyenMaiId", key: "khuyenMaiId" },
    { title: "Ghi Chú", dataIndex: "ghiChu", key: "ghiChu" },
    { title: "Mã Khách Hàng", dataIndex: "maKhachHang", key: "maKhachHang" },
    {
      title: "Hành Động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            className="bg-blue-600 text-white hover:bg-blue-700"
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={booking}
      rowKey="maPhong"
      pagination={false}
      className="bg-white rounded-lg shadow-md"
    />
  );
};

export default EmployeeBookingCard;
*/

/*
import React from "react";
import { Card, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

const EmployeeBookingTable = ({ booking, onEdit }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "16px",
        padding: "16px",
      }}
    >
      {booking.map((record) => (
        <Card
          key={record.maPhong}
          title={`Mã Phòng: ${record.maPhong}`}
          extra={
            <Button
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              type="primary"
            >
              Edit
            </Button>
          }
        >
          <p>
            <strong>Loại Dịch Vụ:</strong>{" "}
            {Array.isArray(record.dichVuIds)
              ? record.dichVuIds.join(", ")
              : record.dichVuIds}
          </p>
          <p>
            <strong>Ngày Đặt Phòng:</strong> {record.ngayDatPhong}
          </p>
          <p>
            <strong>Ngày Trả Phòng:</strong> {record.ngayTraPhong}
          </p>
          <p>
            <strong>Khuyến Mãi:</strong> {record.khuyenMaiId}
          </p>
          <p>
            <strong>Ghi Chú:</strong> {record.ghiChu}
          </p>
          <p>
            <strong>Mã Khách Hàng:</strong> {record.maKhachHang}
          </p>
        </Card>
      ))}
    </div>
  );
};

export default EmployeeBookingTable;
*/
