import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, message, Space, Popconfirm, Spin, Pagination as AntdPagination } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { fetchPromotions, fetchPromotionTypes, createPromotion, updatePromotion, deletePromotion } from '../../apis/apipromotion';
import SideBar from '../../Components/componentsAdmin/SideBar';
import Header from '../../Common/Header';

const { RangePicker } = DatePicker;
const { Option } = Select;

const PromotionsPage = () => {
    const [form] = Form.useForm();
    const [promotions, setPromotions] = useState([]);
    const [promotionTypes, setPromotionTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPromo, setCurrentPromo] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalPages: 1, totalRecords: 0 });

    const fetchPromotionsData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token không tồn tại. Vui lòng đăng nhập lại.');
            }

            const response = await fetchPromotions(pagination.page, pagination.pageSize);
            console.log('API Response:', response);

            if (!response || typeof response !== 'object') {
                throw new Error('Phản hồi API không hợp lệ');
            }

            const fetchedPromotions = Array.isArray(response.data) ? response.data : [];
            setPromotions(fetchedPromotions);
            setPagination({
                page: response.page || 1,
                pageSize: response.pageSize || 10,
                totalPages: response.totalPages || 1,
                totalRecords: response.totalRecords || fetchedPromotions.length || 0,
            });
        } catch (error) {
            console.error('Lỗi khi gọi API:', error.message);
            message.error('Lỗi khi tải danh sách khuyến mãi: ' + error.message);
            setPromotions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotionsData();
        loadPromotionTypes();
    }, [pagination.page, pagination.pageSize]);

    const loadPromotionTypes = async () => {
        try {
            const types = await fetchPromotionTypes();
            if (types.length === 0 || !types.every(type => type.id && type.tenKieuKhuyenMai)) {
                setPromotionTypes([
                    { id: 1, tenKieuKhuyenMai: 'Phần trăm' },
                    { id: 2, tenKieuKhuyenMai: 'Trực tiếp' },
                ]);
            } else {
                setPromotionTypes(types);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách kiểu khuyến mãi:', error.message);
        }
    };

    const handleTableChange = (page, pageSize) => {
        setPagination({ ...pagination, page, pageSize });
    };

    const handleCreate = () => {
        form.resetFields();
        setIsEditing(false);
        setModalVisible(true);
    };

    const handleEdit = (promo) => {
        setCurrentPromo(promo);
        setIsEditing(true);

        // Tìm đúng id của kiểu khuyến mãi dựa vào danh sách promotionTypes
        let kieuKhuyenMaiId = promo.kieuKhuyenMai;
        if (typeof kieuKhuyenMaiId !== 'number') {
            // Nếu là string, cố gắng chuyển sang số
            kieuKhuyenMaiId = parseInt(kieuKhuyenMaiId);
        }
        // Nếu vẫn NaN, thử map từ tên sang id
        if (isNaN(kieuKhuyenMaiId)) {
            const found = promotionTypes.find(
                (type) =>
                    type.tenKieuKhuyenMai === promo.tenKieuKhuyenMai ||
                    type.kieuKhuyenMai === promo.tenKieuKhuyenMai
            );
            kieuKhuyenMaiId = found ? found.id : undefined;
        }

        form.setFieldsValue({
            tenKhuyenMai: promo.tenKhuyenMai,
            moTaKhuyenMai: promo.moTaKhuyenMai,
            dateRange: [moment(promo.ngayBatDau), moment(promo.ngayKetThuc)],
            giaTriKhuyenMai: promo.giaTriKhuyenMai,
            kieuKhuyenMai: kieuKhuyenMaiId,
            ghiChu: promo.ghiChu,
        });
        setModalVisible(true);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const promoData = {
                tenKhuyenMai: values.tenKhuyenMai,
                moTaKhuyenMai: values.moTaKhuyenMai,
                ngayBatDau: values.dateRange[0].format('YYYY-MM-DD'),
                ngayKetThuc: values.dateRange[1].format('YYYY-MM-DD'),
                kieuKhuyenMai: parseInt(values.kieuKhuyenMai), // Sử dụng ID cho POST
                giaTriKhuyenMai: parseFloat(values.giaTriKhuyenMai) || 0,
                ghiChu: values.ghiChu || '',
            };

            console.log('Dữ liệu gửi đi (promoData):', promoData);

            if (!moment(promoData.ngayBatDau).isValid() || !moment(promoData.ngayKetThuc).isValid()) {
                throw new Error('Ngày không hợp lệ!');
            }

            if (isNaN(promoData.kieuKhuyenMai) || promoData.kieuKhuyenMai < 0 || promoData.kieuKhuyenMai > 255) {
                throw new Error('Kiểu khuyến mãi không hợp lệ!');
            }

            let result;
            if (isEditing) {
                result = await updatePromotion(currentPromo.maKhuyenMai, promoData);
                console.log('Kết quả cập nhật khuyến mãi:', result);
                setPromotions(
                    promotions.map((p) =>
                        p.maKhuyenMai === currentPromo.maKhuyenMai ? { ...p, ...result } : p
                    )
                );
                message.success('Cập nhật khuyến mãi thành công!');
            } else {
                result = await createPromotion(promoData);
                console.log('Kết quả tạo khuyến mãi:', result);
                fetchPromotionsData(); // Cập nhật danh sách sau khi tạo
                message.success('Tạo khuyến mãi thành công!');
            }

            setModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error('Lỗi khi xử lý khuyến mãi:', error.message);
            message.error('Lỗi khi xử lý khuyến mãi: ' + error.message);
        }
    };
    const handleDelete = async (id) => {
        try {
            await deletePromotion(id);
            message.success('Xóa khuyến mãi thành công!');
            fetchPromotionsData();
        } catch (error) {
            console.error('Lỗi khi xóa khuyến mãi:', error.message);
            message.error('Lỗi khi xóa khuyến mãi: ' + error.message);
        }
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: (_, __, index) => (pagination.page - 1) * pagination.pageSize + index + 1,
        },
        {
            title: 'Tên Khuyến mãi',
            dataIndex: 'tenKhuyenMai',
            key: 'tenKhuyenMai',
        },
        {
            title: 'Mô tả',
            dataIndex: 'moTaKhuyenMai',
            key: 'moTaKhuyenMai',
        },
        {
            title: 'Ngày Bắt đầu',
            dataIndex: 'ngayBatDau',
            key: 'ngayBatDau',
            render: (text) => moment(text).format('DD/MM/YYYY'),
        },
        {
            title: 'Ngày Kết thúc',
            dataIndex: 'ngayKetThuc',
            key: 'ngayKetThuc',
            render: (text) => moment(text).format('DD/MM/YYYY'),
        },
        {
            title: 'Giá trị',
            dataIndex: 'giaTriKhuyenMai',
            key: 'giaTriKhuyenMai',
        },
        {
            title: 'Kiểu',
            dataIndex: 'tenKieuKhuyenMai',
            key: 'tenKieuKhuyenMai',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'ghiChu',
            key: 'ghiChu',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                    />
                    <Popconfirm
                        title="Bạn có chắc muốn xóa khuyến mãi này?"
                        onConfirm={() => handleDelete(record.maKhuyenMai)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            className="bg-red-600 text-white hover:bg-red-700"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="flex h-screen">
            <SideBar />
            <div className="flex flex-col flex-1">
                <Header />
                <div className="p-6 bg-gray-100 overflow-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Quản lý Khuyến mãi</h1>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleCreate}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                        >
                            Tạo Khuyến mãi
                        </Button>
                    </div>
                    {loading ? (
                        <div className="flex justify-center my-10">
                            <Spin size="large" />
                        </div>
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={promotions}
                            rowKey="maKhuyenMai"
                            className="bg-white rounded-lg shadow-md"
                            rowClassName="hover:bg-gray-50"
                        />
                    )}
                    <AntdPagination
                        current={pagination.page}
                        pageSize={pagination.pageSize}
                        total={pagination.totalRecords}
                        onChange={(page, pageSize) => handleTableChange(page, pageSize)}
                        showSizeChanger
                        pageSizeOptions={['10', '20', '50']}
                        className="mt-4 flex justify-end"
                    />
                    <Modal
                        classNames={"pb-2"}
                        title={isEditing ? 'Chỉnh sửa Khuyến mãi' : 'Tạo Khuyến mãi'}
                        visible={modalVisible}
                        onOk={handleSubmit}
                        onCancel={() => {
                            setModalVisible(false);
                            form.resetFields();
                        }}
                        okText={isEditing ? 'Cập nhật' : 'Tạo'}
                        cancelText="Hủy"
                        className="rounded-lg"
                    >
                        <Form form={form} layout="vertical" className="space-y-4">
                            <Form.Item
                                name="tenKhuyenMai"
                                label="Tên Khuyến mãi"
                                rules={[{ required: true, message: 'Vui lòng nhập tên khuyến mãi!' }]}
                            >
                                <Input placeholder="Nhập tên khuyến mãi" />
                            </Form.Item>
                            <Form.Item
                                name="moTaKhuyenMai"
                                label="Mô tả"
                                rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                            >
                                <Input.TextArea className="h-20" rows={2} placeholder="Nhập mô tả khuyến mãi" />
                            </Form.Item>
                            <Form.Item
                                name="dateRange"
                                label="Thời gian"
                                rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
                            >
                                <RangePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item
                                name="kieuKhuyenMai"
                                label="Kiểu Khuyến mãi"
                                rules={[{ required: true, message: 'Vui lòng chọn kiểu khuyến mãi!' }]}
                            >
                                <Select placeholder="Chọn kiểu khuyến mãi" onChange={() => form.validateFields(['giaTriKhuyenMai'])}>
                                    {promotionTypes.map(type => (
                                        <Option key={type.id} value={type.id}>
                                            {type.tenKieuKhuyenMai}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="giaTriKhuyenMai"
                                label="Giá trị"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập giá trị khuyến mãi!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const kieuKhuyenMai = getFieldValue('kieuKhuyenMai');
                                            if (kieuKhuyenMai === 1 && (value < 0 || value > 100)) {
                                                return Promise.reject(new Error('Phần trăm phải từ 0 đến 100!'));
                                            }
                                            if (kieuKhuyenMai === 2 && value < 0) {
                                                return Promise.reject(new Error('Giá trị trực tiếp phải lớn hơn hoặc bằng 0!'));
                                            }
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                                normalize={(value) => (value ? parseFloat(value) : value)}
                            >
                                <Input type="number" placeholder="Nhập giá trị khuyến mãi" />
                            </Form.Item>
                            <Form.Item
                                name="ghiChu"
                                label="Ghi chú"
                            >
                                <Input.TextArea rows={2} placeholder="Nhập ghi chú (tùy chọn)" />
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default PromotionsPage;  