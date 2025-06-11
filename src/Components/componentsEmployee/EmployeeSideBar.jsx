import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';


const IconPlaceholder = ({ text }) => <span style={{ marginRight: '10px' }}>{text}</span>;

const EmployeeSideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (confirmed) {
      alert("Bạn đã đăng xuất!");
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const menuItems = [
    {
      key: '0',
      icon: <IconPlaceholder text="🏠" />, 
      label: 'Danh sách phòng',
      path: '/employee/rooms',
    },
    {
      key: '1',
      icon: <IconPlaceholder text="👨‍👩‍👧‍👦" />,
      label: 'Danh sách khách hàng',
      path: '/employee/customers',
    },
    {
      key: '2',
      icon: <IconPlaceholder text="📅" />,
      label: 'Danh sách đặt phòng',
      path: '/employee/bookings',
    },
  ];


  // Styles
  const sidebarStyle = {
    backgroundColor: '#140B39',
    color: 'white',
    height: '100vh',
    transition: 'width 0.3s ease-in-out',
    width: collapsed ? '64px' : '256px', // tương đương w-16 và w-64
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    minHeight: '64px', // Đảm bảo chiều cao cố định cho header
  };

  const PanelTextStyle = {
    fontSize: '1.60rem', // tương đương text-xl
    // fontWeight: 'bold',
    fontFamily: "Times New Roman",
    color: "#999900",
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  };

  const toggleButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '20px',
  };

  const menuStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    overflowY: 'auto', // Cho phép scroll nếu menu quá dài
    flexGrow: 1, // Để menu chiếm hết không gian còn lại
  };

  const menuItemStyle = {
    padding: collapsed ? '12px 0' : '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'flex-start',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  const menuItemHoverStyle = {
    backgroundColor: '#1e40af', 
  };

  const navLinkStyle = (isActive) => ({
    textDecoration: 'none',
    color: isActive ? '#999900' : '#d1d5db', // tương đương text-gray-200
    fontWeight: isActive ? 'bold' : 'normal',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: collapsed ? '0' : '8px 0', // Chỉ padding khi không collapsed để label không bị cắt
  });

  const labelStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: collapsed ? 'none' : 'inline',
  };



  return (
    <div style={sidebarStyle}>
      <div style={headerStyle}>
        {!collapsed && <span style={PanelTextStyle}>8Bros Employee</span>}
        <button
          style={toggleButtonStyle}
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Mở menu" : "Đóng menu"}
        >
          {collapsed ? '☰' : '❌'}
        </button>
      </div>
      <ul style={menuStyle}>
        {menuItems.map((item) => (
          <li
            key={item.key}
            style={menuItemStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = menuItemHoverStyle.backgroundColor}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <NavLink
              to={item.path}
              style={({ isActive }) => ({
                ...navLinkStyle(isActive),
                // Căn giữa icon khi collapsed
                justifyContent: collapsed ? 'center' : 'flex-start',
                paddingLeft: collapsed ? '0' : '0px', // Điều chỉnh padding cho NavLink
              })}
            >
              {item.icon}
              {!collapsed && <span style={labelStyle}>{item.label}</span>}
            </NavLink>
          </li>
        ))}
        <li
          style={menuItemStyle}
          onClick={handleLogout}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = menuItemHoverStyle.backgroundColor}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div style={{display: 'flex', alignItems: 'center', width: '100%', justifyContent: collapsed ? 'center' : 'flex-start'}}>
            <IconPlaceholder text="🚪" />
            {!collapsed && <span style={labelStyle}>Đăng xuất</span>}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default EmployeeSideBar;