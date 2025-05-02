import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import "../Employee/styles/Booking.css"

// MAIN COMPONENT
const BookingList = () => {
  // Sample data
  const Bookings = [
    {
      id: 1,
      name: "Hoang Lam",
      email: "hoanglam@example.com",
      phone: "0123456789",
      status: "Đang chờ xác nhận",
      details: [
        "Loại phòng: VIP",
        "Số người: 2",
        "Ngày nhận: 2025-05-10",
        "Ngày trả: 2025-05-12",
        "Ghi chú: Yêu cầu phòng tầng cao, view đẹp.",
      ],
      notes: "Thông tin thêm hoặc ghi chú của quản lý...",
    },
    {
      id: 2,
      name: "Minh Anh",
      email: "minhanh@example.com",
      phone: "0987654321",
      status: "Đã xác nhận",
      details: [
        "Loại phòng: Standard",
        "Số người: 1",
        "Ngày nhận: 2025-05-15",
        "Ngày trả: 2025-05-16",
        "Ghi chú: Không hút thuốc.",
      ],
      notes: "Khách hàng thân thiết.",
    },
    {
      id: 3,
      name: "Trung Kien",
      email: "trungkien@example.com",
      phone: "0112233445",
      status: "Đã hủy",
      details: [
        "Loại phòng: Deluxe",
        "Số người: 3",
        "Ngày nhận: 2025-06-01",
        "Ngày trả: 2025-06-05",
        "Ghi chú: Cần thêm giường phụ.",
      ],
      notes: "Hủy do thay đổi kế hoạch.",
    },
    {
      id: 4,
      name: "Viet Nam",
      email: "vietnamnguyen@example.com",
      phone: "0956654321",
      status: "Đã xác nhận",
      details: [
        "Loại phòng: Standard",
        "Số người: 1",
        "Ngày nhận: 2025-05-15",
        "Ngày trả: 2025-05-16",
        "Ghi chú: không.",
      ],
      notes: "Không có.",
    },
  ];

  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (confirmed) {
      alert("Bạn đã đăng xuất!");
      navigate("/login")
    }
  };

  return (
    <Container>
      {/* Sidebar */}
      <Sidebar>
        <Header style={{ fontSize: "2.5em" }}> 8Bros </Header>

        <MenuItem onClick={() => navigate("/employee/rooms")}>
          🏠 Danh sách phòng
        </MenuItem>

        <MenuItem onClick={() => navigate("/employee/customers")}>
          👥 Danh sách khách
        </MenuItem>

        <MenuItem onClick={() => navigate("/employee/bookings")}>
          📅 Danh sách đặt phòng
        </MenuItem>

        <MenuItem 
        onClick={handleLogout}
        style={{ marginLeft: '27px' }}
        >
          Đăng xuất
        </MenuItem>
      </Sidebar>

      {/* Main Content */}
      <MainContent>
        <Title>Danh sách đặt phòng</Title>

        <div className="booking-list">
          {Bookings.map((booking) => (
            <div key={booking.id} className="booking-item">
              <div className="booking-info">
                <h3 className="booking-name">{booking.name}</h3>
                <p className="booking-contact">Email: {booking.email}</p>
                <p className="booking-contact">SĐT: {booking.phone}</p>
                <p className="booking-status">
                  Trạng thái: <strong>{booking.status}</strong>
                </p>
              </div>
              <div className="booking-details">
                <h4>Chi tiết:</h4>
                <ul>
                  {booking.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>
              <div className="booking-notes">
                <h4>Ghi chú thêm:</h4>
                <p>{booking.notes}</p>
              </div>
              <div className="booking-actions">
                {/* Cần icon thật */}
                <button className="action-btn edit-btn" title="Sửa">
                  ✏️
                </button>
                <button className="action-btn delete-btn" title="Xóa">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </MainContent>
    </Container>
  );
};

// STYLED COMPONENTS
const Container = styled.div`
  font-family: Arial;
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
  background: #f5f6fa;
`;

const Header = styled.h1`
  margin-bottom: 20px;
  margin-left: 50px;
  font-family: "Times New Roman", serif;
  color: #999900;
`;

const Sidebar = styled.div`
  background: #140b39;
  padding: 30px 20px;
  color: white;
`;
const MainContent = styled.div`
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TableHeaderCell = styled.th`
  padding: 12px 8px;
  text-align: left;
  font-weight: bold;
  background: #f8f9fa;
  border-bottom: 2px solid #ddd;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }

  &:hover {
    background-color: #f1f1f1;
  }
`;

const TableCell = styled.td`
  padding: 12px 8px;
  border-bottom: 1px solid #ddd;
  vertical-align: top;
`;

const SaveButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 8px 30px;
  justify-content: center;

  &:hover {
    background-color: #45a049;
  }
`;

const MenuItem = styled.button`
  padding: 12px 15px;
  border: none;
  border-radius: 6px;
  background: ${(props) => (props.active ? "#999900" : "transparent")};
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  gap: 10px;
  color: ${(props) => (props.active ? "#000000" : "#ffffff")};

  &:hover {
    background: #999900;
  }
`;

const Title = styled.h2`
  margin-bottom: 20px;
  margin-left: 50px;
  font-family: "Times New Roman", serif;
  color: #999900;
  font-size: 3em;
`;
export default BookingList;
