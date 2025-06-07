import React from 'react';
import { Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

const RoomForm = ({ visible, onCancel, onSave, room }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('Form values:', values);
        // Tự động tính giá và số giường dựa trên maLoaiPhong
        let giaPhong;
        let soGiuong;
        switch (values.maLoaiPhong) {
          case 1: // Phòng đơn
            giaPhong = 500000;
            soGiuong = 1;
            break;
          case 2: // Phòng đôi
            giaPhong = 700000;
            soGiuong = 2;
            break;
          case 3: // Phòng gia đình
            giaPhong = 1000000;
            soGiuong = 3;
            break;
          default:
            giaPhong = 0;
            soGiuong = 0;
        }
        // Chuyển đổi tenTinhTrang thành tinhTrangPhong và thêm các giá trị tự động
        const transformedValues = {
          ...values,
          tinhTrangPhong: values.tenTinhTrang, // Gửi tinhTrangPhong (0 hoặc 1)
          giaPhong, // Thêm giá tự động
          soGiuong, // Thêm số giường tự động
        };
        delete transformedValues.tenTinhTrang; // Xóa tenTinhTrang khỏi dữ liệu gửi đi
        console.log('Transformed values for API:', transformedValues);
        onSave(transformedValues);
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title={room ? 'Sửa Phòng' : 'Thêm Phòng'}
      visible={visible}
      onOk={handleOk}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      okText="Lưu"
      cancelText="Hủy"
      className="rounded-lg"
    >
      <Form form={form} layout="vertical" initialValues={room}>
        <Form.Item
          name="soPhong"
          label="Số Phòng"
          rules={[{ required: true, message: 'Vui lòng nhập số phòng' }]}
        >
          <Input className="w-full" />
        </Form.Item>
        <Form.Item
          name="maLoaiPhong"
          label="Loại Phòng"
          rules={[{ required: true, message: 'Vui lòng chọn loại phòng' }]}
        >
          <Select className="w-full">
            <Option value={1}>Phòng đơn</Option>
            <Option value={2}>Phòng đôi</Option>
            <Option value={3}>Phòng gia đình</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="tenTinhTrang"
          label="Trạng Thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select className="w-full">
            <Option value={0}>Đang sử dụng</Option>
            <Option value={1}>Trống</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoomForm;