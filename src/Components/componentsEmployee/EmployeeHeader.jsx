import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Helper Icon Components (Sử dụng ký tự Unicode hoặc text đơn giản) ---
const SearchIcon = () => <span style={{ marginRight: '8px' }}>🔍</span>;
const BellIcon = () => <span>🔔</span>;
const UserIcon = () => <span style={{ marginRight: '8px' }}>👤</span>;
const SettingsIcon = () => <span style={{ marginRight: '8px' }}>⚙️</span>;
const LogoutIcon = () => <span style={{ marginRight: '8px' }}>🚪</span>;


const EmployeeHeader = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error("Failed to parse user data from localStorage", error);
          // Xử lý trường hợp dữ liệu không hợp lệ
          localStorage.removeItem('user');
        }
      }
    }
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsDropdownOpen(false); // Đóng dropdown sau khi logout
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // --- Inline Styles ---
  const headerStyle = {
    backgroundColor: '#140B39',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: 'white', // Màu chữ mặc định cho header
  };

  const searchInputContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: '4px',
    padding: '4px 8px',
    width: '300px',
  };

  const searchInputStyle = {
    border: 'none',
    outline: 'none',
    marginLeft: '8px',
    width: '100%',
    color: '#333', // Màu chữ cho input
  };

  const userSectionStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const bellBadgeContainerStyle = {
    position: 'relative',
    marginRight: '24px', // gutter
  };

  const bellButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#e5e7eb', // làm cho nó sáng hơn trên nền xanh
    cursor: 'pointer',
    fontSize: '20px', // Kích thước icon
    padding: '8px',
    borderRadius: '50%', // hình tròn
  };

  const badgeStyle = {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '10px',
    fontWeight: 'bold',
  };

  const dropdownTriggerStyle = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  };

  const avatarStyle = (avatarUrl) => ({
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#ccc', // Màu nền mặc định nếu không có ảnh
    backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#666', // Màu cho chữ cái đầu nếu không có ảnh
  });

  const userInfoStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '8px', 
  };

  const userNameStyle = {
    color: '#d1d5db', 
    fontWeight: '600', 
    fontSize: '14px',
  };

  const userEmailStyle = {
    color: '#9ca3af', 
    fontSize: '12px',
  };

  const dropdownMenuStyle = {
    position: 'absolute',
    top: '60px', // Điều chỉnh vị trí xuất hiện của dropdown
    right: '16px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    zIndex: 1000,
    minWidth: '160px',
  };

  const dropdownItemStyle = {
    padding: '10px 15px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    color: '#333', // Màu chữ cho item
    fontSize: '14px',
  };

  const loginButtonStyle = {
    backgroundColor: '#999900',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
  };


  return (
    <div style={headerStyle}>
      {/* Search Bar */}
      <div style={searchInputContainerStyle}>
        <SearchIcon />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          style={searchInputStyle}
        />
      </div>

      {/* User Section */}
      <div style={userSectionStyle}>
        {user ? (
          <>
            {/* Bell Icon with Badge */}
            <div style={bellBadgeContainerStyle}>
              <button style={bellButtonStyle} aria-label="Thông báo">
                <BellIcon />
              </button>
              <span style={badgeStyle}>5</span>
            </div>

            {/* User Dropdown */}
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <div style={dropdownTriggerStyle} onClick={toggleDropdown} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && toggleDropdown()}>
                <div style={avatarStyle(user.avatar)}>
                  {!user.avatar && user.name ? user.name.charAt(0).toUpperCase() : null}
                </div>
                <div style={userInfoStyle}>
                  <span style={userNameStyle}>{user.name || 'User Name'}</span>
                  <span style={userEmailStyle}>{user.email || 'user@example.com'}</span>
                </div>
              </div>
              {isDropdownOpen && (
                <div style={dropdownMenuStyle}>
                  <div
                    style={{...dropdownItemStyle, ':hover': {backgroundColor: '#f0f0f0'}}}
                    onClick={() => { alert('Chức năng Hồ sơ chưa được cài đặt'); setIsDropdownOpen(false);}}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <UserIcon /> Hồ sơ
                  </div>
                  <div
                     style={{...dropdownItemStyle, ':hover': {backgroundColor: '#f0f0f0'}}}
                    onClick={() => { alert('Chức năng Cài đặt chưa được cài đặt'); setIsDropdownOpen(false);}}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <SettingsIcon /> Cài đặt
                  </div>
                  <div
                    style={{...dropdownItemStyle, ':hover': {backgroundColor: '#f0f0f0'}}}
                    onClick={handleLogout}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <LogoutIcon /> Đăng xuất
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <button style={loginButtonStyle} onClick={handleLogin}>
            Đăng nhập
          </button>
        )}
      </div>
    </div>
  );
};

export default EmployeeHeader;