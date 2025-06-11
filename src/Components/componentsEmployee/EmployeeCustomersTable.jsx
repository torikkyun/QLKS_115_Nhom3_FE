import React from "react";
import { Table, Button, Popconfirm, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const EmployeeCustomerTable = ({ customer, onEdit, onDelete }) => {
  const columns = [
    { title: "Mã Khách hàng", dataIndex: "maKhachHang", key: "maKhachHang" },
    { title: "Họ", dataIndex: "ho", key: "ho" },
    { title: "Tên", dataIndex: "ten", key: "ten" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Số điện thoại", dataIndex: "sdt", key: "sdt" },
    { title: "CCCD", dataIndex: "cccd", key: "cccd" },
    {
      title: "Hành Động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            className="bg-blue-600 text-white hover:bg-blue-700"
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa không?"
            onConfirm={() => onDelete(record.maKhachHang)}
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
    <Table
      columns={columns}
      dataSource={customer}
      rowKey="maKhachHang"
      pagination={false}
      className="bg-white rounded-lg shadow-md"
    />
  );
};

export default EmployeeCustomerTable;
