import React, { useState, useEffect } from 'react';
import { Button, Spin, Modal, Form, Input, message, Checkbox, Divider } from 'antd';
import { useParams } from 'react-router-dom';
import { getRoom, bookRoom } from '../../apis/apiroom';
import { getServices } from '../../apis/apiservice';
import Header from '../../Components/componentUser/Header';
import { InfoCircleOutlined } from '@ant-design/icons';
const BookingPanel = ({ room, cart, calculateTotal, setIsBookingModalVisible, setCart }) => (
  <div className="col-span-4">
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
      <h2 className="text-xl font-semibold mb-4">Thông tin đặt phòng</h2>
      <div className="flex justify-between items-center mb-3 pb-3 border-b">
        <span className="text-gray-600">Giá phòng / đêm</span>
        <span className="font-semibold">{(room.giaPhong || 0).toLocaleString()} VND</span>
      </div>
      {cart.length > 0 &&
        cart.map(item => (
          <div key={item.maDichVu} className="flex justify-between items-center mb-3 pb-3 border-b">
            <span className="text-gray-600">{item.tenDichVu || 'Tên không xác định'}</span>
            <span className="font-semibold">{(item.gia || 0).toLocaleString()} VND</span>
          </div>
        ))}
      <div className="flex justify-between items-center mb-6 pt-2 text-lg">
        <span className="font-medium">Tổng cộng</span>
        <span className="font-bold text-blue-600">{calculateTotal().toLocaleString()} VND</span>
      </div>
      <Button
        type="primary"
        block
        size="large"
        className="mb-5 bg-green-600 hover:bg-green-800 w-full rounded-lg"
        onClick={() => setCart([])}
      >
        Add Booking
      </Button>
      <Button
        type="primary"
        block
        size="large"
        className="bg-blue-600 hover:bg-blue-700"
        onClick={() => setIsBookingModalVisible(true)}
      >
        Đặt phòng ngay
      </Button>
      <div className="mt-4 text-center text-sm text-gray-500">
        <InfoCircleOutlined className="mr-1" /> Không mất phí khi đặt phòng
      </div>
    </div>
  </div>
);