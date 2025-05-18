import React, { useState, useEffect } from "react";
import {
  Button,
  Spin,
  Table,
  Input,
  Modal,
  Popconfirm,
  Space,
  Form,
  Pagination as AntdPagination,
} from "antd";
import { ToastContainer, toast } from "react-toastify";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getService,
  addService,
  updateService,
  handleDeleteService,
} from "../../apis/apiservice.js";
import Sidebar from "../../Components/componentsAdmin/SideBar";
import Header from "../../Common/Header";

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: "" });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalPages: 1,
    totalRecords: 0,
  });
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [form] = Form.useForm();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
      }
      const response = await getService(pagination.page, pagination.pageSize);
      console.log("Phản hồi API getService:", response);
      if (!response || typeof response !== "object") {
        throw new Error("Phản hồi API không hợp lệ");
      }
      const fetchedServices = Array.isArray(response.data?.services || response.data)
        ? response.data.services || response.data
        : [];
      console.log("Danh sách dịch vụ:", fetchedServices);
      setServices(fetchedServices);
      setPagination({
        page: response.page || 1,
        pageSize: response.pageSize || 10,
        totalPages:
          response.totalPages ||
          Math.ceil(
            (response.totalRecords || fetchedServices.length) /
              (response.pageSize || 10)
          ) ||
          1,
        totalRecords: response.totalRecords || fetchedServices.length || 0,
      });
    } catch (error) {
      console.error("Lỗi khi gọi API getService:", error.message);
      toast.error("Lỗi khi tải danh sách dịch vụ: " + error.message);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để quản lý dịch vụ");
      return;
    }
    fetchServices();
  }, [pagination.page, pagination.pageSize]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 });
  };

  const handleAddService = () => {
    setEditingService(null);
    form.resetFields();
    setIsFormVisible(true);
  };

  const handleEditService = (record) => {
    setEditingService(record);
    form.setFieldsValue({
      maDichVu: record.maDichVu,
      tenDichVu: record.tenDichVu,
      ghiChu: record.ghiChu,
      loaiDichVu: record.loaiDichVu,
    });
    setIsFormVisible(true);
  };

  const handleDeleteClick = (maDichVu) => {
    if (!maDichVu) {
      toast.error("Mã dịch vụ không hợp lệ");
      return;
    }
    console.log("Chuẩn bị xóa dịch vụ với maDichVu:", maDichVu);
    setServiceToDelete(maDichVu);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) {
      toast.error("Không có dịch vụ nào được chọn để xóa");
      setIsDeleteModalVisible(false);
      return;
    }
    try {
      console.log("Gửi yêu cầu xóa dịch vụ với maDichVu:", serviceToDelete);
      await handleDeleteService(serviceToDelete);
      toast.success("Xóa dịch vụ thành công");
      fetchServices();
    } catch (error) {
      console.error("Lỗi khi xóa dịch vụ:", error.message);
      toast.error("Lỗi khi xóa dịch vụ: " + error.message);
    } finally {
      setIsDeleteModalVisible(false);
      setServiceToDelete(null);
    }
  };

  const handleSaveService = async (values) => {
    console.log("Payload gửi đến API:", values);
    try {
      if (editingService) {
        await updateService({ maDichVu: editingService.maDichVu, ...values });
        toast.success("Cập nhật dịch vụ thành công");
      } else {
        await addService(values);
        toast.success("Thêm dịch vụ thành công");
      }
      fetchServices();
      setIsFormVisible(false);
      setEditingService(null);
      form.resetFields();
    } catch (error) {
      console.error("Lỗi khi lưu dịch vụ:", error.message);
      toast.error("Lỗi khi lưu dịch vụ: " + error.message);
    }
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingService(null);
    form.resetFields();
  };

  const filteredServices = services.filter((service) => {
    const searchText = filters.search.toLowerCase();
    return (
      (service.tenDichVu || "").toLowerCase().includes(searchText) ||
      (service.ghiChu || "").toLowerCase().includes(searchText)
    );
  });

  const columns = [
    {
      title: "Mã dịch vụ",
      dataIndex: "maDichVu",
      key: "maDichVu",
      render: (maDichVu) => maDichVu || "N/A",
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "tenDichVu",
      key: "tenDichVu",
    },
    {
      title: "Ghi chú",
      dataIndex: "ghiChu",
      key: "ghiChu",
    },
    {
      title: "Loại dịch vụ",
      dataIndex: "tenLoaiDichVu",
      key: "tenLoaiDichVu",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditService(record)}
            className="bg-blue-900 text-blue-600 hover:bg-blue-700"
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa dịch vụ này?"
            onConfirm={() => handleDeleteClick(record.maDichVu)}
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
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex-1 p-6 bg-gray-100 overflow-auto">
          <h1 className="text-2xl font-bold mb-4">Quản Lý Dịch Vụ</h1>
          <Button
            type="primary"
            onClick={handleAddService}
            className="mb-4 bg-blue-500 hover:bg-blue-600 border-none"
          >
            Thêm Dịch Vụ
          </Button>
          <div className="flex mb-4">
            <Input
              placeholder="Tìm kiếm theo tên dịch vụ hoặc ghi chú"
              value={filters.search}
              onChange={(e) =>
                handleFilterChange({ ...filters, search: e.target.value })
              }
              className="w-64"
            />
          </div>
          {loading ? (
            <div className="flex justify-center my-10">
              <Spin size="large" />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={filteredServices}
              rowKey="maDichVu"
              pagination={false}
              className="shadow-md rounded-lg"
            />
          )}
          <AntdPagination
            current={pagination.page}
            pageSize={pagination.pageSize}
            total={pagination.totalRecords}
            onChange={(page, pageSize) =>
              setPagination({ ...pagination, page, pageSize })
            }
            showSizeChanger
            pageSizeOptions={["10", "20", "50"]}
            className="mt-4 flex justify-end"
          />
          <Modal
            title={editingService ? "Sửa Dịch Vụ" : "Thêm Dịch Vụ"}
            visible={isFormVisible}
            onCancel={handleCancel}
            footer={null}
          >
            <Form form={form} onFinish={handleSaveService} layout="vertical">
              {editingService && (
                <Form.Item label="Mã dịch vụ" name="maDichVu">
                  <Input disabled />
                </Form.Item>
              )}
              <Form.Item
                label="Tên dịch vụ"
                name="tenDichVu"
                rules={[
                  { required: true, message: "Vui lòng nhập tên dịch vụ" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Ghi chú" name="ghiChu">
                <Input />
              </Form.Item>
              <Form.Item
                label="Loại dịch vụ"
                name="loaiDichVu"
                rules={[
                  { required: true, message: "Vui lòng nhập loại dịch vụ" },
                ]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full">
                  Lưu
                </Button>
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title="Xác nhận xóa"
            visible={isDeleteModalVisible}
            onOk={handleConfirmDelete}
            onCancel={() => setIsDeleteModalVisible(false)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ className: "bg-red-500 hover:bg-red-600" }}
          >
            <p>Bạn có chắc chắn muốn xóa dịch vụ này?</p>
          </Modal>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default ServiceManagement;