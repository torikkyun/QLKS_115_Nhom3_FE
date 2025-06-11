import React from "react";
import EmployeeBookingCard from "./EmployeeBookingCard"; // Import the card component


const BookingListContainer = ({ bookings, onCheckout, onEdit }) => {
  // If there are no bookings, display a message.
  if (!bookings || bookings.length === 0) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-100">
        <p className="text-xl text-yellow-700 font-semibold">Không có dữ liệu đặt phòng nào.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100"> 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
        {bookings.map((bookingItem) => (
          // Render EmployeeBookingCard for each booking item
          <EmployeeBookingCard
            key={bookingItem.maDatPhong} // Unique key for list rendering optimization
            booking={bookingItem}
            onCheckout={onCheckout} // Pass the checkout handler down to the card
            onEdit={onEdit} // Pass the edit handler down to the card
          />
        ))}
      </div>
    </div>
  );
};

export default BookingListContainer;
