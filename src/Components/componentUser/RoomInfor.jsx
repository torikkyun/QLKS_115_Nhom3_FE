import React from 'react';
import { Checkbox, Divider } from 'antd';
import { useTranslation } from 'react-i18next';

const RoomInfo = ({ room, services, selectedServices, handleServiceToggle }) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Room Description */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{t('preview', { defaultValue: 'PREVIEW' })}</h2>
        <div className="text-gray-700 space-y-3">
          {room.moTa.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </div>

      {/* Room Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          {t('overview', { defaultValue: 'TỔNG QUAN' })}
          <div className="ml-2 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
            {room.tenTinhTrang}
          </div>
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-500">{t('room_type', { defaultValue: 'Loại phòng' })}</p>
            <p className="font-medium">{room.ghiChu}</p>
          </div>
          <div>
            <p className="text-gray-500">{t('bed_count', { defaultValue: 'Số giường' })}</p>
            <p className="font-medium">{room.soGiuong}</p>
          </div>
          <div>
            <p className="text-gray-500">{t('capacity', { defaultValue: 'Sức chứa' })}</p>
            <p className="font-medium">{t('capacity_value', { defaultValue: '2 người lớn' })}</p>
          </div>
          <div>
            <p className="text-gray-500">{t('room_size', { defaultValue: 'Kích thước' })}</p>
            <p className="font-medium">{t('room_size_value', { defaultValue: '35 m²' })}</p>
          </div>
        </div>

        <Divider />
        
        <h3 className="font-semibold mb-2 text-xl">{t('services', { defaultValue: 'DỊCH VỤ' })}</h3>
        <div className="grid grid-cols-2 gap-5 group">
          {services.map((service, index) => (
            <div
              key={service.maDichVu}
              className={`flex justify-between p-2 rounded-lg transition-all duration-300 hover:bg-blue-300 transition-colors cursor-pointer hover:scale-105 animate__animated animate__fadeInUp -${(index % 4) + 1}s`}
            >
              <Checkbox
                checked={selectedServices.includes(service.maDichVu)}
                onChange={(e) => handleServiceToggle(service, e.target.checked)}
                className="mr-2 w-6 h-6 "
              />
              <span className="font-medium text-blue-600 text-lg pl-5">{service.tenDichVu || t('service_name_unknown', { defaultValue: 'Tên không xác định' })}</span>
              <span className="ml-auto text-gray-500 text-sm">
                {(service.gia || 0).toLocaleString()} VND
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RoomInfo;