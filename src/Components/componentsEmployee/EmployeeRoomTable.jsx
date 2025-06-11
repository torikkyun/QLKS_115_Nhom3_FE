import React from 'react';
import { Table, Button, Popconfirm, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const EmployeeRoomTable = ({ rooms }) => {
  const columns = [
    { title: 'Mã Phòng', dataIndex: 'maPhong', key: 'maPhong' },
    { title: 'Số Phòng', dataIndex: 'soPhong', key: 'soPhong' },
    { title: 'Loại Phòng', dataIndex: 'ghiChu', key: 'ghiChu' },
    { title: 'Số Giường', dataIndex: 'soGiuong', key: 'soGiuong' },
    {
      title: 'Trạng Thái',
      dataIndex: 'tenTinhTrang',
      key: 'tenTinhTrang',
      render: (status) => (
        <span className={status === 'Trống' ? 'text-green-600' : 'text-red-600'}>
          {status === 'Trống' ? 'Trống' : 'Đã sử dụng'}
        </span>
      ),
    },
    { title: 'Giá Phòng', dataIndex: 'giaPhong', key: 'giaPhong' },
  ];
  return (
    <Table
      columns={columns}
      dataSource={rooms}
      rowKey="maPhong"
      pagination={false}
      className="bg-white rounded-lg shadow-md"
    />
  );
};

export default EmployeeRoomTable;