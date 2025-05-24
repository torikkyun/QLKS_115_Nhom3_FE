import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Badge, Button, Dropdown, Avatar, Input, Drawer } from 'antd';
import { 
  ShoppingCartOutlined, 
  UserOutlined, 
  MenuOutlined,
  SearchOutlined,
  BellOutlined,
  HeartOutlined,
  LogoutOutlined,
  SettingOutlined,
  HistoryOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import logo from '../../assets/Image/logo.png';

const { Search } = Input;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookings = useSelector(state => state.cart.bookings);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // User menu items
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin cá nhân',
      onClick: () => navigate('/user/profile')
    },
    {
      key: 'history',
      icon: <HistoryOutlined />,
      label: 'Lịch sử đặt phòng',
      onClick: () => navigate('/user/booking-history')
    },
    {
      key: 'favorites',
      icon: <HeartOutlined />,
      label: 'Phòng yêu thích',
      onClick: () => navigate('/user/favorites')
    },
    {
      type: 'divider'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
      onClick: () => navigate('/user/settings')
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: () => {
        // Handle logout logic
        navigate('/login');
      }
    }
  ];

  // Language menu items
  const languageItems = [
    {
      key: 'vi',
      label: (
        <div className="flex items-center gap-2">
          <span className="text-lg">🇻🇳</span>
          Tiếng Việt
        </div>
      )
    },
    {
      key: 'en',
      label: (
        <div className="flex items-center gap-2">
          <span className="text-lg">🇺🇸</span>
          English
        </div>
      )
    }
  ];

  // Navigation items
  const navItems = [
    { path: '/user/home', label: 'TRANG CHỦ' },
    { path: '/user/rooms', label: 'PHÒNG' },
    { path: '/services', label: 'DỊCH VỤ' },
    { path: '/user/about', label: 'VỀ CHÚNG TÔI' },
    { path: '/user/contact', label: 'LIÊN HỆ' }
  ];

  const handleSearch = (value) => {
    if (value.trim()) {
      navigate(`/user/search?q=${encodeURIComponent(value)}`);
      setSearchVisible(false);
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#232752]/95 backdrop-blur-md shadow-lg' 
          : 'bg-[#232752] shadow-md'
      }`}>
        {/* Top bar with contact info */}
        <div className="bg-[#1a1d3a] text-gray-300 text-xs py-1 hidden lg:block">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <PhoneOutlined />
                <span>Hotline: 1900-8888</span>
              </div>
              <div className="flex items-center gap-1">
                <MailOutlined />
                <span>info@hotel8bross.com</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>Theo dõi chúng tôi:</span>
              <div className="flex gap-2">
                <a href="#" className="hover:text-blue-400 transition-colors">Facebook</a>
                <a href="#" className="hover:text-blue-400 transition-colors">Instagram</a>
                <a href="#" className="hover:text-pink-400 transition-colors">TikTok</a>
              </div>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="Hotel 8Bross Logo" 
              className="h-10 w-auto cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate('/user/home')}
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Hotel 8Bross
              </h1>
              <p className="text-xs text-gray-400">Luxury & Comfort</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative text-sm font-medium tracking-wide transition-colors duration-300 ${
                    isActive 
                      ? 'text-blue-400' 
                      : 'text-white hover:text-blue-400'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden md:block">
              {searchVisible ? (
                <Search
                  placeholder="Tìm kiếm phòng, dịch vụ..."
                  onSearch={handleSearch}
                  onBlur={() => setSearchVisible(false)}
                  autoFocus
                  className="w-64"
                  size="small"
                />
              ) : (
                <Button
                  type="text"
                  icon={<SearchOutlined className="text-lg" />}
                  onClick={() => setSearchVisible(true)}
                  className="text-white hover:text-blue-400 hover:bg-white/10"
                />
              )}
            </div>

            {/* Language Selector */}
            <Dropdown 
              menu={{ items: languageItems }}
              placement="bottomRight"
              className="hidden md:block"
            >
              <Button
                type="text"
                icon={<GlobalOutlined className="text-lg" />}
                className="text-white hover:text-blue-400 hover:bg-white/10"
              />
            </Dropdown>

         

          

            {/* Cart */}
            <Badge count={bookings.length} offset={[10, 0]}>
              <Button
                type="text"
                icon={<ShoppingCartOutlined className="text-lg" />}
                onClick={() => navigate('/user/CartPage')}
                className="text-white hover:text-green-400 hover:bg-white/10 relative"
              />
            </Badge>

            {/* User Menu */}
            <Dropdown 
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              className="hidden md:block"
            >
              <div className="flex items-center gap-2 cursor-pointer hover:bg-white/10 rounded-lg px-2 py-1 transition-colors">
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />}
                  className="bg-gradient-to-r from-blue-500 to-purple-500"
                />
                <span className="text-sm hidden lg:block">Xin chào!</span>
              </div>
            </Dropdown>

            {/* Mobile Menu Button */}
            <Button
              type="text"
              icon={<MenuOutlined className="text-lg" />}
              onClick={() => setMobileMenuOpen(true)}
              className="text-white hover:text-blue-400 hover:bg-white/10 lg:hidden"
            />
          </div>
        </div>

        {/* Progress bar for page loading */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-20" />
      </header>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-8 w-auto" />
            <span className="font-bold text-lg">Hotel 8Bross</span>
          </div>
        }
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        className="lg:hidden"
      >
        <div className="space-y-4">
          {/* Search in mobile */}
          <Search
            placeholder="Tìm kiếm..."
            onSearch={handleSearch}
            className="mb-4"
          />

          {/* Mobile Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 font-semibold' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

         
        </div>
      </Drawer>
    </>
  );
};

export default Header;