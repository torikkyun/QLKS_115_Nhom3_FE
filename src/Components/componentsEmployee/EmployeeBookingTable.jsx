/*
import React from "react";
import { Card, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

const EmployeeBookingTable = ({ booking, onEdit }) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        padding: "16px"
      }}
    >
      {booking.map((booking) => (
        <Card
          key={booking.maPhong}
          title={`Mã Phòng: ${booking.maPhong}`}
          style={{ width: 300 }}
          extra={
            <Button
              icon={<EditOutlined />}
              onClick={() => onEdit(booking)}
              type="primary"
            >
              Edit
            </Button>
          }
        >
          <p>
            <strong>Loại Dịch Vụ:</strong>{" "}
            {Array.isArray(booking.dichVuIds)
              ? booking.dichVuIds.join(", ")
              : booking.dichVuIds}
          </p>
          <p>
            <strong>Ngày Đặt Phòng:</strong> {booking.ngayDatPhong}
          </p>
          <p>
            <strong>Ngày Trả Phòng:</strong> {booking.ngayTraPhong}
          </p>
          <p>
            <strong>Khuyến Mãi:</strong> {booking.khuyenMaiId}
          </p>
          <p>
            <strong>Ghi Chú:</strong> {booking.ghiChu}
          </p>
          <p>
            <strong>Mã Khách Hàng:</strong> {booking.maKhachHang}
          </p>
        </Card>
      ))}
    </div>
  );
};

export default EmployeeBookingTable;
*/


/*
import React from "react";
import { Table, Button, Space } from "antd";
import { EditOutlined } from "@ant-design/icons";

const EmployeeBookingTable = ({ booking, onEdit }) => {
  const columns = [
    { title: "Mã Phòng", dataIndex: "maPhong", key: "maPhong" },
    { title: "Loại Dịch Vụ", dataIndex: "dichVuIds", key: "dichVuIds" },
    { title: "Ngày Đặt Phòng", dataIndex: "ngayDatPhong", key: "ngayDatPhong" },
    { title: "Ngày Trả Phòng", dataIndex: "ngayTraPhong", key: "ngayTraPhong" },
    { title: "Khuyến Mãi", dataIndex: "khuyenMaiId", key: "khuyenMaiId" },
    { title: "Ghi Chú", dataIndex: "ghiChu", key: "ghiChu" },
    { title: "Mã Khách Hàng", dataIndex: "maKhachHang", key: "maKhachHang" },
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
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={booking}
      rowKey="maPhong"
      pagination={false}
      className="bg-white rounded-lg shadow-md"
    />
  );
};

export default EmployeeBookingTable;
*/


import React from "react";
import { Card, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

const EmployeeBookingTable = ({ booking, onEdit }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "16px",
        padding: "16px",
      }}
    >
      {booking.map((record) => (
        <Card
          key={record.maPhong}
          title={`Mã Phòng: ${record.maPhong}`}
          extra={
            <Button
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              type="primary"
            >
              Edit
            </Button>
          }
        >
          <p>
            <strong>Loại Dịch Vụ:</strong>{" "}
            {Array.isArray(record.dichVuIds)
              ? record.dichVuIds.join(", ")
              : record.dichVuIds}
          </p>
          <p>
            <strong>Ngày Đặt Phòng:</strong> {record.ngayDatPhong}
          </p>
          <p>
            <strong>Ngày Trả Phòng:</strong> {record.ngayTraPhong}
          </p>
          <p>
            <strong>Khuyến Mãi:</strong> {record.khuyenMaiId}
          </p>
          <p>
            <strong>Ghi Chú:</strong> {record.ghiChu}
          </p>
          <p>
            <strong>Mã Khách Hàng:</strong> {record.maKhachHang}
          </p>
        </Card>
      ))}
    </div>
  );
};

export default EmployeeBookingTable;