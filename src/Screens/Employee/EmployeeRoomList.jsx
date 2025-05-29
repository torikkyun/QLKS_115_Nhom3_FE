import React, { useState, useEffect } from 'react';
import { Button, Spin, Pagination as AntdPagination } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import EmployeeRoomTable from '../../Components/componentsEmployee/EmployeeRoomTable';
import EmployeeRoomFilter from '../../Components/componentsEmployee/EmployeeRoomFilter';
import { getRooms } from '../../apis/apiroom';
import EmployeeSideBar from '../../Components/componentsEmployee/EmployeeSideBar';
import EmployeeHeader from '../../Components/componentsEmployee/EmployeeHeader';

const EmployeeRoomList = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalPages: 1, totalRecords: 0 });
    const [filters, setFilters] = useState({ search: '', status: '', type: '' });


    const fetchRooms = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token không tồn tại. Vui lòng đăng nhập lại.');
            }

            const response = await getRooms(pagination.page, pagination.pageSize);
            console.log('API Response:', response);

            if (!response || typeof response !== 'object') {
                throw new Error('Phản hồi API không hợp lệ');
            }

            const fetchedRooms = Array.isArray(response.data) ? response.data : response || [];
            setRooms(fetchedRooms);
            setPagination({
                page: response.page || 1,
                pageSize: response.pageSize || 10,
                totalPages: response.totalPages || Math.ceil((response.totalRecords || fetchedRooms.length) / (response.pageSize || 10)) || 1,
                totalRecords: response.totalRecords || fetchedRooms.length || 0,
            });
        } catch (error) {
            console.error('Lỗi khi gọi API:', error.message);
            toast.error('Lỗi khi tải danh sách phòng: ' + error.message);
            setRooms([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, [pagination.page, pagination.pageSize]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPagination({ ...pagination, page: 1 });
    };
    
    const filteredRooms = rooms.filter((room) => {
        const searchText = filters.search.toLowerCase();
        const matchesSearch =
            (room.soPhong || '').toLowerCase().includes(searchText)
        const matchesStatus = filters.status === '' || (room.tenTinhTrang !== undefined && room.tenTinhTrang.toString() === filters.status);
        const matchesType = filters.type === '' || (room.ghiChu !== undefined && room.ghiChu.toString() === filters.type);
        return matchesSearch && matchesStatus && matchesType;
    });

    return (
        <div className="flex h-screen ">
            <EmployeeSideBar />
            <div className="flex flex-col flex-1">
                <EmployeeHeader />

                <div className="flex-1 p-6 bg-gray-100 min-h-scree overflow-auto">
                    <h1 className="text-2xl font-bold mb-4">Danh Sách Phòng</h1>

                    <EmployeeRoomFilter onFilterChange={handleFilterChange} />
                    {loading ? (
                        <div className="flex justify-center my-10">
                            <Spin size="large" />
                        </div>
                    ) : (
                        <EmployeeRoomTable rooms={filteredRooms} />
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

                    <ToastContainer />
                </div>

            </div>
        </div>
    );
};

export default EmployeeRoomList;