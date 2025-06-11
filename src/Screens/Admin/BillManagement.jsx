
import React, { useState, useEffect } from 'react';
import { Pagination, Spin } from 'antd';
import Sidebar from '../../Components/componentsAdmin/SideBar';
import Header from '../../Common/Header';
import { getInvoices } from '../../apis/apiinvoice';
import FilterBill from '../../Components/componentsAdmin/FilterBill';

const BillCard = ({ bill }) => {
  const customer = bill.datPhong?.khachHang;
  const bookingDate = new Date(bill.datPhong?.ngayDatPhong).toLocaleDateString();
  const invoiceDate = new Date(bill.ngayXuatHoaDon).toLocaleDateString();
  const status = bill.tinhTrangThanhToan?.tenTinhTrang;
  const statusColor = status === 'Đã thanh toán' ? 'text-green-600' : 'text-red-500';

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 my-4 flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-base truncate">
          {customer?.ho} {customer?.ten}
        </h2>
      </div>
      <div className="flex flex-col md:flex-row md:space-x-4 text-sm text-gray-700">
        <div className="md:basis-[30%] space-y-1">
          <p><strong>Ngày đặt phòng:</strong> {bookingDate}</p>
          <p><strong>Ngày xuất hóa đơn:</strong> {invoiceDate}</p>
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
  // State Management
  const [bills, setBills] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch Data
  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      try {
        const result = await getInvoices(currentPage, pageSize);
        setBills(result.data || []);
        setTotalRecords(result.totalRecords || 0);
      } catch (err) {
        console.error('Lỗi khi fetch hóa đơn:', err);
        setBills([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, [currentPage, pageSize]);

  // Handle Pagination Change
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };
  

  return (
    <div className="flex h-screen">

      <Sidebar />
      <div className="flex flex-col flex-1 bg-gray-100 min-h-screen">
        <Header className="sticky top-0 z-10 bg-gray-100" />

        <div className="flex-1 p-6 bg-gray-100 overflow-auto pt-16">
          <h1 className="text-2xl font-bold mb-6 text-center">Danh sách hóa đơn</h1>

          <div className="max-w-5xl mx-auto w-full">
            <FilterBill />
            {loading ? (
              <div className="flex justify-center py-6">
                <Spin size="large" />
              </div>
            ) : bills.length === 0 ? (
              <div className="text-center py-6 text-gray-500">Không có hóa đơn nào.</div>
            ) : (
              <div className="space-y-4">
                {bills.map((bill, index) => (
                  <BillCard key={index} bill={bill} />
                ))}
              </div>
            )}
            {totalRecords > pageSize && (
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalRecords}
                onChange={handlePageChange}
                showSizeChanger
                pageSizeOptions={['10', '20']}
                className="mt-4 flex justify-end"
                style={{ textAlign: 'right' }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillManagement;