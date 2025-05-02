import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// MAIN COMPONENT
const CustomerList = () => {
  // Sample data
  const customers = [
    { number: "123", lname: "Tran", fname: "Viet Nam", email: "namviet@gmail.com", phone: 123, citID: 1234567890 },
    { number: "456", lname: "Nguyen", fname: "Viet Anh", email: "anhtaolagoat@gmail.com", phone: 456, citID: 1234567890 },
    { number: "789", lname: "Tran", fname: "Thi Van Anh", email: "vananh@gmail.com", phone: 789, citID: 1234567890 },
    { number: "111", lname: "Thai", fname: "Anh Van", email: "toyuki@gmail.com", phone: 111, citID: 1234567890 },
  ];

  const handleSave = () => {
    // Thêm logic save ở đây
    alert('Đã lưu thay đổi!');
  };

  const handleLogout = () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (confirmed) {
      alert("Bạn đã đăng xuất!");
      navigate("/login")
    }
  };

  const navigate = useNavigate();

  return (
    <Container>

      {/* Sidebar */}
      <Sidebar>
        <Header style={{ fontSize: "2.5em" }}>  8Bros </Header>

        <MenuItem
          onClick={() => navigate("/employee/rooms")}
        >
          🏠 Danh sách phòng
        </MenuItem>

        <MenuItem
          onClick={() => navigate("/employee/customers")}
        >
          👥 Danh sách khách
        </MenuItem>

        <MenuItem
          onClick={() => navigate("/employee/bookings")}
        >
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
        <Title>Danh sách khách hàng</Title>

        <Table>
          <thead>
            <tr>
              <TableHeaderCell>Mã KH</TableHeaderCell>
              <TableHeaderCell>Họ</TableHeaderCell>
              <TableHeaderCell>Tên</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Số điện thoại</TableHeaderCell>
              <TableHeaderCell>CCCD</TableHeaderCell>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <TableRow key={customer.number}>
                <TableCell>{customer.number}</TableCell>
                <TableCell>{customer.lname}</TableCell>
                <TableCell>{customer.fname}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.citID}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
        <SaveButton onClick={handleSave}>Lưu</SaveButton>
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
  font-family: 'Times New Roman', serif;
  color: #999900;
`;

const Sidebar = styled.div`
  background: #140B39;
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
  background: ${props => props.active ? '#999900' : 'transparent'};
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  gap: 10px;
  color: ${props => props.active ? '#000000' : '#ffffff'};

  &:hover {
    background: #999900;
  }
`;

const LogoutButton = styled(MenuItem)`
  margin-top: auto;
  background: #dc3545;
  color: white;
  justify-content: center;

  &:hover {
    background: #bb2d3b;
  }
`;
const Title = styled.h2`
  margin-bottom: 20px;
  margin-left: 50px;
  font-family: 'Times New Roman', serif;
  color: #999900;
  font-size: 3em;
`;
export default CustomerList;
