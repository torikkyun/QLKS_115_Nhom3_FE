import React from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';

const { Option } = Select;

const RoomForm = ({ visible, onCancel, onSave, room }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('Form values:', values); // Debug giá trị form
        // Chuyển đổi giá trị tenTinhTrang nếu cần (giả sử API cần chuỗi)
        const transformedValues = {
          ...values,
          tenTinhTrang: values.tenTinhTrang === 'Trống' ? 0 : 1,
        };
        onSave(transformedValues); // Gửi giá trị đã chuyển đổi
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
          name="soGiuong"
          label="Số Giường"
          rules={[{ required: true, message: 'Vui lòng nhập số giường' }]}
        >
          <InputNumber min={1} className="w-full" />
        </Form.Item>
        <Form.Item
          name="giaPhong"
          label="Giá Phòng"
          
          rules={[{ required: true, message: 'Vui lòng nhập giá phòng' }]}
        >
          <InputNumber min={0} className="w-full" />
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