import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMoneyBillWave,
  faStar,
  faCrown,
  faBed,
  faDollarSign,
  faLock,
  faEye,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import lowPriceImage from '../assets/Image/GiaThap.jpeg';
import mediumPriceImage from '../assets/Image/GiaTrungBinh.png';
import highPriceImage from '../assets/Image/GiaCao.jpg';

const RoomCard = ({ room, onBookRoom, index }) => {
    const { t } = useTranslation();
    if (!room) return <div className="text-center text-gray-500">{t('no_data', { defaultValue: 'Không có dữ liệu' })}</div>;

    const navigate = useNavigate();

    const isBooked = room.tenTinhTrang === "Đang sử dụng";

    const handleViewDetail = (maPhong) => {
        if (isBooked) return;
        if (onBookRoom) onBookRoom(maPhong);
        navigate(`/user/detailroom/${maPhong}`);
    };

    const handleImageError = (e) => {
        e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPjzZo5vrIhhAYMg10uFFk9aoDJ2Z3he7a5g&s';
    };

    const getPriceImage = (price) => {
        if (price <= 500000) return lowPriceImage;
        else if (price >= 700000 && price < 1000000) return mediumPriceImage;
        else return highPriceImage;
    };

    const getPriceCategory = (price) => {
        if (price <= 500000) return { text: t('room_price_low', { defaultValue: 'Tiết kiệm' }), color: 'bg-emerald-500', icon: faMoneyBillWave };
        else if (price >= 700000 && price < 1000000) return { text: t('room_price_medium', { defaultValue: 'Trung bình' }), color: 'bg-blue-500', icon: faStar };
        else return { text: t('room_price_high', { defaultValue: 'Cao cấp' }), color: 'bg-purple-500', icon: faCrown };
    };

    const roomImage = room.giaPhong ? getPriceImage(room.giaPhong) : room.anh || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPjzZo5vrIhhAYMg10uFFk9aoDJ2Z3he7a5g&s';
    const priceCategory = getPriceCategory(room.giaPhong);

    return (
        <div className="pb-5">
            <div
                className={`relative w-full max-w-sm mx-auto group transition-all duration-500 ${
                    isBooked
                        ? 'opacity-60 cursor-not-allowed scale-95'
                        : 'cursor-pointer hover:scale-105 hover:-translate-y-2'
                } animate__animated animate__fadeInUp animate${(index % 4) + 1}s`}
                onClick={isBooked ? null : () => handleViewDetail(room.maPhong)}
            >
                {/* Main Card */}
                <div className={`relative bg-white rounded-2xl shadow-xl overflow-hidden border-0 transition-all duration-300 ${
                    isBooked
                        ? 'bg-gray-50'
                        : 'hover:shadow-2xl hover:shadow-blue-500/25 group-hover:border-blue-500/50'
                }`}>
                    <div className="relative h-48 overflow-hidden">
                        <img
                            className={`w-full h-full object-cover transition-all duration-500 ${
                                isBooked ? 'grayscale' : 'group-hover:scale-110'
                            }`}
                            src={roomImage}
                            alt={t('room', { defaultValue: 'Phòng' }) + ` ${room.soPhong}`}
                            loading="lazy"
                            onError={handleImageError}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                        <div className="absolute top-3 right-3">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm border ${
                                room.tenTinhTrang === "Trống"
                                    ? 'bg-green-500/90 text-white border-green-400/50 shadow-lg shadow-green-500/25'
                                    : 'bg-red-500/90 text-white border-red-400/50 shadow-lg shadow-red-500/25'
                            }`}>
                                {room.tenTinhTrang === "Trống" ? t('room_available', { defaultValue: 'Có sẵn' }) : t('room_booked', { defaultValue: 'Đã đặt' })}
                            </span>
                        </div>

                        <div className="absolute top-3 left-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm border border-white/20 shadow-lg ${priceCategory.color}`}>
                                <FontAwesomeIcon icon={priceCategory.icon} className="mr-1" />
                                {priceCategory.text}
                            </span>
                        </div>
                        <div className="absolute bottom-3 left-3">
                            <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                                #{room.soPhong}
                            </h3>
                        </div>
                    </div>

                    <div className="p-3 space-y-4">
                        {/* Room Type */}
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <p className="text-sm text-gray-600 font-medium">
                                {room.ghiChu || t('standard', { defaultValue: 'Phòng tiêu chuẩn' })}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2 p-2.5 bg-gray-50 rounded-lg">
                                <FontAwesomeIcon icon={faBed} className="text-lg" />
                                <div>
                                    <p className="text-xs text-gray-500">{t('bed', { defaultValue: 'Giường' })}</p>
                                    <p className="font-semibold text-gray-800 text-lg">{room.soGiuong}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 p-2.5 bg-gray-50 rounded-lg">
                                <FontAwesomeIcon icon={faDollarSign} className="text-lg" />
                                <div>
                                    <p className="text-xs text-gray-500">{t('price', { defaultValue: 'Giá/đêm' })}</p>
                                    <p className="font-semibold text-blue-600">
                                        {room.giaPhong?.toLocaleString() || t('contact', { defaultValue: 'Liên hệ' })}₫
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={`transition-all duration-300 ${isBooked ? 'opacity-50' : 'opacity-100'}`}>
                            <Button
                                className={`w-full font-bold py-3 px-4 rounded-xl text-sm transition-all duration-300 ${
                                    isBooked
                                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-[1.02] active:scale-[0.98]'
                                }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetail(room.maPhong);
                                }}
                                disabled={isBooked}
                            >
                                {isBooked ? (
                                    <span className="flex items-center justify-center space-x-2">
                                        <FontAwesomeIcon icon={faLock} />
                                        <span>{t('not_available', { defaultValue: 'Không khả dụng' })}</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center space-x-2 cursor-pointer">
                                        <FontAwesomeIcon icon={faEye} />
                                        <span>{t('view_detail', { defaultValue: 'Xem chi tiết' })}</span>
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>
                    {!isBooked && (
                        <>
                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                <div className="absolute inset-0 rounded-2xl border-2 border-blue-500/30 animate-pulse"></div>
                            </div>
                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </div>
                        </>
                    )}
                </div>

                {!isBooked && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-ping"></div>
                )}
            </div>
        </div>
    );
};

export default RoomCard;