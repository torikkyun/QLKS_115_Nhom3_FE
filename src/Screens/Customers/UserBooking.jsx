import React, { useState, useEffect } from 'react';

// Simulated booking data for testing (replace with actual async data)
const simulatedBooking = { maPhong: 3, maDatPhong: 3 }; // Assume booking for room 3 with booking ID 3

const UserBookings = () => {
  const [rooms, setRooms] = useState([]);
  const [pricingData, setPricingData] = useState({});
  const [serviceData, setServiceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all rooms
        const roomsResponse = await fetch('http://103.167.89.178:5000/api/Phong?page=1&pageSize=10');
        if (!roomsResponse.ok) {
          throw new Error(`Failed to fetch rooms: ${roomsResponse.statusText}`);
        }
        const roomsResult = await roomsResponse.json();
        console.log('Rooms API Response:', roomsResult);
        const filteredRooms = roomsResult.data.filter(room => 
          room.maPhong === simulatedBooking.maPhong
        );
        setRooms(filteredRooms);

        // Fetch pricing data for the booked room using maDatPhong
        const pricingResponse = await fetch(`http://103.167.89.178:5000/api/HoaDon/${simulatedBooking.maDatPhong}`);
        if (!pricingResponse.ok) {
          console.warn(`Failed to fetch pricing for ID ${simulatedBooking.maDatPhong}: ${pricingResponse.statusText}`);
          setPricingData({ [simulatedBooking.maDatPhong]: null });
        } else {
          const pricingResult = await pricingResponse.json();
          setPricingData({ [simulatedBooking.maDatPhong]: pricingResult });
        }

        // Fetch service data
        const serviceResponse = await fetch('http://103.167.89.178:5000/api/DichVu');
        if (!serviceResponse.ok) {
          throw new Error(`Failed to fetch services: ${serviceResponse.statusText}`);
        }
        const serviceResult = await serviceResponse.json();
        console.log('Service API Response:', serviceResult);
        const serviceMap = serviceResult.data.reduce((acc, service) => {
          acc[service.id] = service.giaDichVu || 0; // Assuming 'giaDichVu' is the service cost
          return acc;
        }, {});
        setServiceData(serviceMap);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format currency to VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  // Calculate total service fees (assuming no dichVuIds for now, using pricing data)
  const calculateServiceFees = () => {
    let totalServiceFees = 0;
    const pricing = pricingData[simulatedBooking.maDatPhong]?.data;
    if (pricing) {
      totalServiceFees += (pricing.tongTienDichVu || 0);
    }
    return totalServiceFees;
  };

  const totalServiceFees = calculateServiceFees();
  const totalPricing = pricingData[simulatedBooking.maDatPhong]?.data?.tongTien || 0;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Your Bookings Section */}
        <div className="w-full lg:w-2/3">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Bookings</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-gray-600">Loading...</p>
            </div>
          ) : error ? (
            <p className="text-red-500 text-center bg-red-100 p-4 rounded-lg">{error}</p>
          ) : rooms.length > 0 ? (
            rooms.map((room) => {
              const pricing = pricingData[simulatedBooking.maDatPhong];
              return (
                <div key={room.maPhong} className="bg-white shadow-lg rounded-lg overflow-hidden mb-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex flex-col md:flex-row">
                    <img src="https://via.placeholder.com/160x112" alt={room.soPhong} className="w-full md:w-48 h-36 object-cover" />
                    <div className="p-6 flex-1">
                      <h3 className="text-xl font-semibold text-gray-800">Room {room.soPhong}</h3>
                      <p className="text-gray-600 mt-2">{room.ghiChu}</p>
                      <div className="flex items-center text-green-600 mt-2">
                        <span className="text-sm">Rating: {room.danhGia || 'N/A'}</span>
                        <span className="ml-2 text-sm">{room.soLuotDanhGia || 'N/A Reviews'}</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        <p>Check-in: {new Date().toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                        <p>Check-out: {new Date(Date.now() + 86400000).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                      </div>
                      <p className="text-yellow-600 font-bold mt-4">
                        1 room x 1 night {pricing?.data ? formatCurrency(pricing.data.tongTienPhong || room.giaPhong) : formatCurrency(room.giaPhong)}
                      </p>
                      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">No bookings available</p>
          )}
        </div>

        {/* Pricing Summary Section */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Pricing Summary</h2>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-lg text-gray-600">Loading...</p>
              </div>
            ) : error ? (
              <p className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>
            ) : pricingData[simulatedBooking.maDatPhong] ? (
              <div className="space-y-4">
                {pricingData[simulatedBooking.maDatPhong].data && (
                  <>
                    <p className="flex justify-between text-gray-700">
                      <span>1 room x 1 night</span>
                      <span>{formatCurrency(pricingData[simulatedBooking.maDatPhong].data.tongTienPhong)}</span>
                    </p>
                    <p className="flex justify-between text-gray-700">
                      <span>Services</span>
                      <span>{formatCurrency(pricingData[simulatedBooking.maDatPhong].data.tongTienDichVu)}</span>
                    </p>
                  </>
                )}
                <p className="flex justify-between text-gray-700">
                  <span>Taxes and service fees</span>
                  <span>{formatCurrency(totalServiceFees)}</span>
                </p>
                <p className="flex justify-between text-gray-700">
                  <span>Discount</span>
                  <span>{formatCurrency(0)}</span>
                </p>
                <hr className="border-gray-200" />
                <p className="flex justify-between font-bold text-gray-900 text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(totalPricing + totalServiceFees)}</span>
                </p>
              </div>
            ) : (
              <p className="text-red-500 text-center bg-red-100 p-4 rounded-lg">No pricing data available</p>
            )}
            <div className="mt-6">
              <input
                type="text"
                placeholder="Voucher"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBookings;