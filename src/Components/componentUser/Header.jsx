import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Badge, Button, Dropdown, Avatar, Input, Drawer } from 'antd';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCartShopping,
  faUser,
  faBars,
  faSearch,
  faHeart,
  faSignOutAlt,
  faCog,
  faHistory,
  faPhone,
  faEnvelope,
  faGlobe,
  faFileInvoice
} from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/Image/logo.png';

const { Search } = Input;

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const bookings = useSelector(state => state.cart.bookings);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'vi');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <FontAwesomeIcon icon={faUser} className="text-blue-500" />,
      label: t('profile'),
      onClick: () => navigate('/user/profile'),
    },
    {
      key: 'invoice_search',
      icon: <FontAwesomeIcon icon={faFileInvoice} className="text-blue-500" />,
      label: t('search_invoice', { defaultValue: 'Tra Cứu Hóa Đơn' }),
      onClick: () => navigate('/user/lookupinvoice'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <FontAwesomeIcon icon={faSignOutAlt} className="text-blue-500" />,
      label: t('logout'),
      onClick: () => navigate('/login'),
    },
  ];

  const languageItems = [
    {
      key: 'vi',
      label: (
        <div className="flex items-center gap-2">
          <span className="text-lg">🇻🇳</span>
          {t('language_vi', { defaultValue: 'Tiếng Việt' })}
        </div>
      ),
      onClick: () => changeLanguage('vi'),
    },
    {
      key: 'en',
      label: (
        <div className="flex items-center gap-2">
          <span className="text-lg">🇺🇸</span>
          {t('language_en', { defaultValue: 'English' })}
        </div>
      ),
      onClick: () => changeLanguage('en'),
    },
  ];

  const navItems = [
    { path: '/user/home', label: t('home') },
    { path: '/user/rooms', label: t('rooms') },
    { path: '/user/aboutus', label: t('about') },
    { path: '/user/contact', label: t('contact') },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#232752]/95 backdrop-blur-md shadow-lg' : 'bg-[#232752] shadow-md'
          }`}
      >
        <div className="bg-[#1a1d3a] text-gray-300 text-xs py-1 hidden lg:block">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faPhone} className="text-white-500" />
                <span>{t('hotline')}</span>
              </div>
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faEnvelope} className="text-white-500" />
                <span>{t('email')}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>{t('follow_us')}</span>
              <div className="flex gap-2">
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Facebook
                </a>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Instagram
                </a>
                <a href="#" className="hover:text-pink-400 transition-colors">
                  TikTok
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Hotel 8Bross Logo"
              className="h-10 w-auto cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate('/user/home')}
            />
            <div>
              <h1
                onClick={() => navigate('/user/home')}
                className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent cursor-pointer transition-transform"
              >
                {t('hotel_name')}
              </h1>
              <p
                onClick={() => navigate('/user/home')}
                className="text-xs text-gray-400 "
              >
                {t('slogan')}
              </p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative text-sm font-medium tracking-wide transition-colors duration-300 ${isActive ? 'text-blue-400' : 'text-white hover:text-blue-400'
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
            <NavLink to="/user/rooms">
              <Button
                className="bg-gradient-to-r from-blue-900 to-purple-400 text-white font-semibold px-6 py-2 rounded-full hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {t('book_now', { defaultValue: 'Đặt ngay' })}
              </Button>
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <Dropdown menu={{ items: languageItems }} placement="bottomRight" className="hidden md:block">
              <Button type="link" className="flex items-center gap-2 text-white hover:text-blue-500">
                <FontAwesomeIcon
                  icon={faGlobe}
                  className="text-white hover:text-blue-500 text-lg"
                />
                {currentLanguage === 'vi' ? '🇻🇳' : '🇺🇸'}
              </Button>
            </Dropdown>

            <Badge count={bookings.length} offset={[10, 0]}>
              <FontAwesomeIcon
                icon={faCartShopping}
                className="text-white text-lg cursor-pointer hover:text-blue-400 rounded-lg p-2 transition-colors"
                onClick={() => navigate('/user/CartPage')}
              />
            </Badge>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" className="hidden md:block">
              <div className="flex items-center gap-2 cursor-pointer hover:bg-white/10 rounded-lg px-2 py-1 transition-colors">
                <Avatar
                  size="small"
                  icon={<FontAwesomeIcon icon={faUser} className="text-white-500" />}
                />
              </div>
            </Dropdown>

            <FontAwesomeIcon
              icon={faBars}
              onClick={() => setMobileMenuOpen(true)}
              className="text-white hover:text-blue-500 text-lg cursor-pointer"
            />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-20" />
      </header>

      <Drawer
        title={
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-8 w-auto" />
            <span className="font-bold text-lg">{t('hotel_name')}</span>
          </div>
        }
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        className="lg:hidden"
      >
        <div className="space-y-4">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/user/rooms"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 text-white font-semibold text-center hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
            >
              {t('dat_ngay', { defaultValue: 'Đặt Ngay' })}
            </NavLink>
          </nav>
          <div className="space-y-2">
            {userMenuItems.map((item) =>
              item.type === 'divider' ? (
                <div key={item.key} className="border-t border-gray-200 my-2" />
              ) : (
                <div
                  key={item.key}
                  onClick={() => {
                    item.onClick();
                    setMobileMenuOpen(false);
                  }}
                  className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={item.icon.props.icon} className="text-blue-500" />
                    <span>{item.label}</span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Header;