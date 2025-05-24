import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  vi: {
    translation: {
      // Header
      home: 'TRANG CHỦ',
      rooms: 'PHÒNG',
      services: 'DỊCH VỤ',
      about: 'VỀ CHÚNG TÔI',
      contact: 'LIÊN HỆ',
      search_placeholder: 'Tìm kiếm phòng, dịch vụ...',
      hotline: 'Hotline: 1900-8888',
      email: 'info@hotel8bross.com',
      follow_us: 'Theo dõi chúng tôi:',
      profile: 'Thông tin cá nhân',
      booking_history: 'Lịch sử đặt phòng',
      favorites: 'Phòng yêu thích',
      settings: 'Cài đặt',
      logout: 'Đăng xuất',
      language: 'Ngôn ngữ',
      hotel_name: 'Hotel 8Bross',
      slogan: 'Luxury & Comfort',
      greeting: 'Xin chào!',
      
    },
  },
  en: {
    translation: {
      // Header
      home: 'HOME',
      rooms: 'ROOMS',
      services: 'SERVICES',
      about: 'ABOUT US',
      contact: 'CONTACT',
      search_placeholder: 'Search rooms, services...',
      hotline: 'Hotline: 1900-8888',
      email: 'info@hotel8bross.com',
      follow_us: 'Follow us:',
      profile: 'Profile',
      booking_history: 'Booking History',
      favorites: 'Favorite Rooms',
      settings: 'Settings',
      logout: 'Logout',
      language: 'Language',
      hotel_name: 'Hotel 8Bross',
      slogan: 'Luxury & Comfort',
      greeting: 'Hello!',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'vi', // Default language
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;