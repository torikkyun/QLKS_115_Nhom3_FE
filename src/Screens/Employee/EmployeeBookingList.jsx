import React, { useState, useEffect } from 'react';
import { Button, Spin, Pagination as AntdPagination } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import EmployeeBookingTable from '../../Components/componentsEmployee/EmployeeBookingTable';
import EmployeeBookingFilter from '../../Components/componentsEmployee/EmployeeBookingFilter'
import EmployeeBookingForm from '../../Components/componentsEmployee/EmployeeBookingForm'
import { getBooking, addBooking, updateBooking } from '../../apis/apibooking';
import EmployeeSideBar from '../../Components/componentsEmployee/EmployeeSideBar';
import EmployeeHeader from '../../Components/componentsEmployee/EmployeeHeader';

const EmployeeBookingList = () => {
    const [booking, setBooking] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalPages: 1, totalRecords: 0 });
    const [filters, setFilters] = useState({ search: '' });
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingBooking, setEditingBooking] = useState();

    const fetchBooking = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token không tồn tại. Vui lòng đăng nhập lại.');
            }

            const response = await getBooking(pagination.page, pagination.pageSize);
            console.log('API Response:', response);

            if (!response || typeof response !== 'object') {
                throw new Error('Phản hồi API không hợp lệ');
            }

            const fetchedBooking = Array.isArray(response.data) ? response.data : response || [];
            setBooking(fetchedBooking);
            setPagination({
                page: response.page || 1,
                pageSize: response.pageSize || 10,
                totalPages: response.totalPages || Math.ceil((response.totalRecords || fetchedBooking.length) / (response.pageSize || 10)) || 1,
                totalRecords: response.totalRecords || fetchedBooking.length || 0,
            });
        } catch (error) {
            console.error('Lỗi khi gọi API:', error.message);
            toast.error('Lỗi khi tải danh sách : ' + error.message);
            setBooking([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooking();
    }, [pagination.page, pagination.pageSize]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPagination({ ...pagination, page: 1 });
    };

    const handleAddBooking = () => {
        setEditingBooking(null);
        setIsFormVisible(true);
    };

    const handleEditBooking = (record) => {
        setEditingBooking(record);
        setIsFormVisible(true);
    };

    const handleSaveBooking = async (values) => {
        try {
            if (editingBooking) {
                await updateBooking({ ...editingBooking, ...values });
                toast.success('Cập nhật thành công');
            } else {
                await addBooking(values);
                toast.success('Thêm thành công');
            }
            fetchBooking();
            setIsFormVisible(false);
        } catch (error) {
            console.error('Lỗi khi lưu danh sách:', error.message);
            toast.error('Lỗi khi lưu danh sách: ' + error.message);
        }
    };

    const filteredBooking = booking.filter((boo) => {
        const searchText = filters.search.toLowerCase();
        const matchesSearch =
            (boo.maDatPhong || '').toString().toLowerCase().includes(searchText)
        return matchesSearch;
    });

    return (
        <div className="flex h-screen ">
            <EmployeeSideBar />
            <div className="flex flex-col flex-1">
                <EmployeeHeader />

                <div className="flex-1 p-6 bg-gray-100 min-h-scree overflow-auto">
                    <h1 className="text-2xl font-bold mb-4">Danh Sách Đặt Phòng</h1>
                    <Button
                        type="primary"
                        onClick={handleAddBooking}
                        className="mb-4 bg-blue-500 hover:bg-blue-600 border-none"
                    >
                        Thêm danh sách
                    </Button>
                    <EmployeeBookingFilter onFilterChange={handleFilterChange} />
                    {loading ? (
                        <div className="flex justify-center my-10">
                            <Spin size="large" />
                        </div>
                    ) : (
                        <EmployeeBookingTable booking={filteredBooking} onEdit={handleEditBooking} />
                    )}
                    <AntdPagination
                        current={pagination.page}
                        pageSize={pagination.pageSize}
                        total={pagination.totalRecords}
                        onChange={(page, pageSize) => setPagination({ ...pagination, page, pageSize })}
                        showSizeChanger
                        pageSizeOptions={['10', '20', '50']}
                        className="mt-4 flex justify-end"
                    />
                    <EmployeeBookingForm
                        visible={isFormVisible}
                        onCancel={() => setIsFormVisible(false)}
                        onSave={handleSaveBooking}
                        customer={editingBooking}
                    />
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
};

export default EmployeeBookingList;