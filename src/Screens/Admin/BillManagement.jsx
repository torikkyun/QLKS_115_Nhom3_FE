import React, { useState, useEffect } from 'react';
import Sidebar from '../../Components/componentsAdmin/SideBar';
import Header from '../../Common/Header';

const BillCard = ({ bill }) => {
  const customer = bill.datPhong?.khachHang;
  const bookingDate = new Date(bill.datPhong?.ngayDatPhong).toLocaleDateString();
  const invoiceDate = new Date(bill.ngayXuatHoaDon).toLocaleDateString();
  const status = bill.tinhTrangThanhToan?.tenTinhTrang;
  const statusColor = status === 'Đã thanh toán' ? 'text-green-600' : 'text-red-500';

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 my-4 w-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-base truncate">
          {customer?.ho} {customer?.ten}
        </h2>
      </div>

      <div className="flex flex-col md:flex-row md:space-x-4 text-sm text-gray-700">
        <div className="md:basis-[30%] space-y-1">
          <p><strong>Ngày đặt:</strong> {bookingDate}</p>
          <p><strong>Ngày xuất:</strong> {invoiceDate}</p>
          <p><strong>Email:</strong> {customer?.email}</p>
          <p><strong>SDT:</strong> {customer?.sdt}</p>
        </div>

        <div className="md:basis-[15%] space-y-1">
          <p><strong>Mã đặt phòng:</strong> {bill.datPhong?.maDatPhong}</p>
          <p><strong>Số phòng đặt:</strong> {bill.datPhong?.soPhongDat}</p>
        </div>

        <div className="md:basis-[20%] space-y-1">
          <p><strong>Tiền phòng:</strong> {bill.tongTienPhong.toLocaleString()} VND</p>
          <p><strong>Tiền dịch vụ:</strong> {bill.tongTienDichVu.toLocaleString()} VND</p>
          <p><strong>Tổng tiền:</strong> {bill.tongTien.toLocaleString()} VND</p>
        </div>

        <div className="md:basis-[20%]">
          <p><strong>Ghi chú:</strong> {bill.datPhong?.ghiChu}</p>
        </div>

        <div className="md:basis-[15%]">
          <p><strong>Trạng thái:</strong></p>
          <p className={`${statusColor} font-semibold`}>{status}</p>
        </div>
      </div>
    </div>
  );
};

const BillManagement = () => {
  const [bills, setBills] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3); // Default PC
  const [totalPages, setTotalPages] = useState(1);

  // Điều chỉnh pageSize theo thiết bị
  useEffect(() => {
    const updatePageSize = () => {
      const width = window.innerWidth;
      setPageSize(width < 768 ? 2 : 3);
    };

    updatePageSize();
    window.addEventListener('resize', updatePageSize);
    return () => window.removeEventListener('resize', updatePageSize);
  }, []);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await fetch(`http://103.167.89.178:5000/api/HoaDon?page=${currentPage}&pageSize=${pageSize}`);
        const data = await res.json();
        setBills(data.data || []);
        const totalRecords = data.totalRecords || 0;
        setTotalPages(Math.ceil(totalRecords / pageSize));
      } catch (err) {
        console.error('Lỗi khi fetch hóa đơn:', err);
      }
    };

    fetchBills();
  }, [currentPage, pageSize]);

  return (
    <div className="flex min-h-screen w-full bg-gray-100 overflow-y-auto">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-gray-100 min-h-screen">
        <Header />
        <h1 className="mt-10 text-3xl sm:text-4xl font-bold text-center text-green-700 mb-10">
          Danh sách hóa đơn
        </h1>
        <div className="max-w-5xl mx-auto w-full bg-gray-100">
          {bills.map((bill, index) => (
            <BillCard key={index} bill={bill} />
          ))}

          <div className="flex justify-center mt-6 space-x-2 bg-gray-100">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                  currentPage === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillManagement;
