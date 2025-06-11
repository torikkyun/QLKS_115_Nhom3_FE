import React, { useState, useEffect } from 'react';
import { Button, Spin, Pagination as AntdPagination } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import EmployeeCustomerTable from '../../Components/componentsEmployee/EmployeeCustomersTable';
import EmployeeCustomerFilter from '../../Components/componentsEmployee/EmployeeCustomerFilter'
import EmployeeCustomerForm from '../../Components/componentsEmployee/EmployeeCustomerForm'
import CustomerDeleteConfirm from '../../Components/componentsEmployee/CustomerDeleteConfirmModal';
import { getCustomers, addCustomers, updateCustomers, deleteCustomers } from '../../apis/apirestcustomer';
import EmployeeSideBar from '../../Components/componentsEmployee/EmployeeSideBar';
import EmployeeHeader from '../../Components/componentsEmployee/EmployeeHeader';

const EmployeeCustomerList = () => {
    const [customer, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalPages: 1, totalRecords: 0 });
    const [filters, setFilters] = useState({ search: '' });
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingCustomers, setEditingCustomers] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token không tồn tại. Vui lòng đăng nhập lại.');
            }

            const response = await getCustomers(pagination.page, pagination.pageSize);
            console.log('API Response:', response);

            if (!response || typeof response !== 'object') {
                throw new Error('Phản hồi API không hợp lệ');
            }

            const fetchedCustomers = Array.isArray(response.data) ? response.data : response || [];
            setCustomers(fetchedCustomers);
            setPagination({
                page: response.page || 1,
                pageSize: response.pageSize || 10,
                totalPages: response.totalPages || Math.ceil((response.totalRecords || fetchedCustomers.length) / (response.pageSize || 10)) || 1,
                totalRecords: response.totalRecords || fetchedCustomers.length || 0,
            });
        } catch (error) {
            console.error('Lỗi khi gọi API:', error.message);
            toast.error('Lỗi khi tải danh sách : ' + error.message);
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [pagination.page, pagination.pageSize]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPagination({ ...pagination, page: 1 });
    };
    

    const handleEditCustomer = (customer) => {
        setEditingCustomers(customer);
        setIsFormVisible(true);
    };

    const handleDeleteCustomer = (maKhachHang) => {
        setCustomerToDelete(maKhachHang);
        setIsDeleteModalVisible(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteCustomers(customerToDelete);
            toast.success('Xóa thành công');
            fetchCustomers();
        } catch (error) {
            console.error('Lỗi khi xóa khách hàng:', error.message);
            toast.error('Lỗi khi xóa khách hàng: ' + error.message);
        } finally {
            setIsDeleteModalVisible(false);
            setCustomerToDelete(null);
        }
    };

    const handleSaveCustomer = async (values) => {
        try {
            if (editingCustomers) {
                await updateCustomers({ ...editingCustomers, ...values });
                toast.success('Cập nhật thành công');
            } else {
                await addCustomers(values);
                toast.success('Thêm thành công');
            }
            fetchCustomers();
            setIsFormVisible(false);
        } catch (error) {
            console.error('Lỗi khi lưu danh sách:', error.message);
            toast.error('Lỗi khi lưu danh sách: ' + error.message);
        }
    };

    const filteredCustomers = customer.filter((cus) => {
        const searchText = filters.search.toLowerCase();
        const matchesSearch =
            (cus.email || '').toString().toLowerCase().includes(searchText) ||
            (cus.cccd || '').toString().toLowerCase().includes(searchText);
        return matchesSearch;
    });

    return (
        <div className="flex h-screen ">
            <EmployeeSideBar />
            <div className="flex flex-col flex-1">
                <EmployeeHeader />

                <div className="flex-1 p-6 bg-gray-100 min-h-scree overflow-auto">
                    <h1 className="text-2xl font-bold mb-4">Danh Sách Và QL Khách Hàng</h1>
                    
                    <EmployeeCustomerFilter onFilterChange={handleFilterChange} />
                    {loading ? (
                        <div className="flex justify-center my-10">
                            <Spin size="large" />
                        </div>
                    ) : (
                        <EmployeeCustomerTable customer={filteredCustomers} onEdit={handleEditCustomer} onDelete={handleDeleteCustomer} />
                    )}
                    <AntdPagination
                        current={pagination.page}
                        pageSize={pagination.pageSize}
                        total={pagination.totalRecords}
                        onChange={(page, pageSize) => setPagination({ ...pagination, page, pageSize })}
                        showSizeChanger
                        pageSizeOptions={['10', '20', '50', '70']}
                        className="mt-4 flex justify-end"
                    />
                    <EmployeeCustomerForm
                        visible={isFormVisible}
                        onCancel={() => setIsFormVisible(false)}
                        onSave={handleSaveCustomer}
                        customer={editingCustomers}
                    />
                    <CustomerDeleteConfirm
                        visible={isDeleteModalVisible}
                        onConfirm={handleConfirmDelete}
                        onCancel={() => setIsDeleteModalVisible(false)}
                    />
                    <ToastContainer />
                </div>
                
            </div>
        </div>
    );
};

export default EmployeeCustomerList;