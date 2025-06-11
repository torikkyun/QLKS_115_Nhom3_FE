// BookingModal.jsx
import React from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BookingDetails from '../../Components/componentUser/BookingModalInvoice';
import CustomerInfoForm from '../../Components/componentUser/CustomerInfoForm';
import useBookingLogic from '../../hooks/useBookingLogic'; // Hook chứa logic xử lý

const BookingModal = ({
  visible,
  isMultiBooking,
  bookings,
  selectedBooking,
  onCancel,
  loading,
  form,
  customerInfo,
  setCustomerInfo,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { handleSubmit, calculateBookingTotal, calculateCartTotal, renderPromotionInfo } = useBookingLogic({
    isMultiBooking,
    bookings,
    selectedBooking,
    form,
    customerInfo,
    setCustomerInfo,
    navigate,
    t,
    onCancel,
  });

  return (
    <Modal
      title={
        <div className="text-center pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {t('confirm_booking', {
              defaultValue: isMultiBooking ? 'Xác Nhận Đặt Tất Cả Phòng' : 'Xác Nhận Đặt Phòng',
            })}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {t('complete_booking_info', { defaultValue: 'Vui lòng cung cấp đầy đủ thông tin để hoàn tất đặt phòng' })}
          </p>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={isMultiBooking ? 1200 : 1000}
      style={{ maxHeight: '95vh', top: '2.5vh' }}
      className="rounded-2xl"
      centered={true}
      bodyStyle={{ padding: '16px', maxHeight: 'calc(95vh - 120px)', overflow: 'auto' }}
    >
      <div className="flex gap-4 h-full">
        <BookingDetails
          isMultiBooking={isMultiBooking}
          bookings={bookings}
          selectedBooking={selectedBooking}
          calculateBookingTotal={calculateBookingTotal}
          calculateCartTotal={calculateCartTotal}
          renderPromotionInfo={renderPromotionInfo}
        />
        <CustomerInfoForm
          form={form}
          customerInfo={customerInfo}
          setCustomerInfo={setCustomerInfo}
          handleSubmit={handleSubmit}
          loading={loading}
          isMultiBooking={isMultiBooking}
        />
      </div>
    </Modal>
  );
};

export default BookingModal;