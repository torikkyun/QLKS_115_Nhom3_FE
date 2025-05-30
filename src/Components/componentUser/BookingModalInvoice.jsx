// BookingDetails.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const BookingDetails = ({
  isMultiBooking,
  bookings,
  selectedBooking,
  calculateBookingTotal,
  calculateCartTotal,
  renderPromotionInfo,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
      <h3 className="font-bold text-center text-gray-800 mb-3">{t('booking_details', { defaultValue: 'Chi tiết đặt phòng' })}</h3>
      {isMultiBooking ? (
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {bookings?.map((booking) => (
            <div key={booking?.id} className="bg-white rounded-lg p-3 shadow-sm">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <FontAwesomeIcon icon={faBed} className="text-blue-500 text-lg mb-1" />
                  <p className="text-xs text-gray-600">{t('room', { defaultValue: 'Phòng' })}</p>
                  <p className="font-semibold text-sm">{booking?.room?.soPhong || 'N/A'}</p>
                </div>
                <div>
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-green-500 text-lg mb-1" />
                  <p className="text-xs text-gray-600">{t('nights', { defaultValue: 'Số đêm' })}</p>
                  <p className="font-semibold text-sm">
                    {booking?.numberOfNights || 0} {t('night', { defaultValue: 'đêm' })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">{t('check_in', { defaultValue: 'Nhận phòng' })}</p>
                  <p className="font-semibold text-xs">{booking?.dates?.[0]?.format('DD/MM/YYYY') || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">{t('check_out', { defaultValue: 'Trả phòng' })}</p>
                  <p className="font-semibold text-xs">{booking?.dates?.[1]?.format('DD/MM/YYYY') || 'N/A'}</p>
                </div>
              </div>
              <div className="text-center mt-2">
                <p className="text-xs text-gray-600">{t('promotion', { defaultValue: 'Khuyến mãi' })}</p>
                <p className="font-semibold text-xs text-green-600">{renderPromotionInfo(booking?.promotion)}</p>
              </div>
              <div className="text-center mt-2 pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-600">{t('total', { defaultValue: 'Tổng tiền' })}</p>
                <p className="font-bold text-blue-600 text-sm">{calculateBookingTotal(booking).toLocaleString()} VND</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center bg-white rounded-lg p-3 shadow-sm">
            <FontAwesomeIcon icon={faBed} className="text-blue-500 text-lg mb-1" />
            <p className="text-xs text-gray-600">{t('room', { defaultValue: 'Phòng' })}</p>
            <p className="font-semibold text-sm">{selectedBooking?.room?.soPhong || 'N/A'}</p>
          </div>
          <div className="text-center bg-white rounded-lg p-3 shadow-sm">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-green-500 text-lg mb-1" />
            <p className="text-xs text-gray-600">{t('nights', { defaultValue: 'Số đêm' })}</p>
            <p className="font-semibold text-sm">
              {selectedBooking?.numberOfNights || 0} {t('night', { defaultValue: 'đêm' })}
            </p>
          </div>
          <div className="text-center bg-white rounded-lg p-3 shadow-sm">
            <p className="text-xs text-gray-600">{t('check_in', { defaultValue: 'Nhận phòng' })}</p>
            <p className="font-semibold text-xs">{selectedBooking?.dates?.[0]?.format('DD/MM/YYYY') || 'N/A'}</p>
          </div>
          <div className="text-center bg-white rounded-lg p-3 shadow-sm">
            <p className="text-xs text-gray-600">{t('check_out', { defaultValue: 'Trả phòng' })}</p>
            <p className="font-semibold text-xs">{selectedBooking?.dates?.[1]?.format('DD/MM/YYYY') || 'N/A'}</p>
          </div>
          <div className="col-span-2 text-center bg-white rounded-lg p-3 shadow-sm">
            <p className="text-xs text-gray-600">{t('promotion', { defaultValue: 'Khuyến mãi' })}</p>
            <p className="font-semibold text-xs text-green-600">{renderPromotionInfo(selectedBooking?.promotion)}</p>
          </div>
        </div>
      )}
      <div className="text-center mt-4 p-3 bg-white rounded-lg shadow-sm">
        <p className="text-xs text-gray-600 mb-1">{t('total_payment', { defaultValue: 'Tổng tiền thanh toán' })}</p>
        <p className="text-xl font-bold text-blue-600">
          {isMultiBooking ? calculateCartTotal().toLocaleString() : selectedBooking ? calculateBookingTotal(selectedBooking).toLocaleString() : '0'} VND
        </p>
      </div>
    </div>
  );
};

export default BookingDetails;