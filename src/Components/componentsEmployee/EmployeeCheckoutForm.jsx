import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';


const EmployeeCheckoutForm = ({ visible, onCancel, onConfirmCheckout, checkoutData }) => {
  const [form] = Form.useForm();

  // useEffect để điền dữ liệu ban đầu vào form khi modal hiển thị hoặc checkoutData thay đổi
  useEffect(() => {
    if (visible && checkoutData) {
      form.setFieldsValue(checkoutData); // Fill maPhong and maDatPhong
    } else if (!visible) {
      form.resetFields(); 
    }
  }, [visible, checkoutData, form]);

  // Hàm xử lý khi form được xác nhận (nhấn OK)
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onConfirmCheckout(values); // Pass confirmed data (maPhong, maDatPhong) to parent
        form.resetFields(); // Reset form after submission
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
        // Có thể hiển thị thông báo lỗi cho người dùng tại đây nếu cần
      });
  };

  return (
    <Modal
      title="Xác nhận Trả Phòng"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Xác nhận Trả Phòng"
      cancelText="Hủy"
      className="rounded-lg"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="maDatPhong"
          label="Mã Đặt Phòng"
          rules={[{ required: true, message: 'Vui lòng nhập Mã Đặt Phòng!' }]}
        >
          {/* Đã bỏ readOnly và disabled để cho phép người dùng nhập/chỉnh sửa */}
          <InputNumber className="w-full" min={1} /> 
        </Form.Item>
        <Form.Item
          name="maPhong"
          label="Mã Phòng"
          rules={[{ required: true, message: 'Vui lòng nhập Mã Phòng!' }]}
        >
          {/* Đã bỏ readOnly và disabled để cho phép người dùng nhập/chỉnh sửa */}
          <InputNumber className="w-full" min={1} />
        </Form.Item>
        {/* Có thể thêm ghi chú xác nhận hoặc thông tin khác nếu cần */}
        <p className="text-gray-600 mt-2">
          Vui lòng xác nhận Mã Phòng và Mã Đặt Phòng trước khi hoàn tất việc trả phòng.
        </p>
      </Form>
    </Modal>
  );
};

export default EmployeeCheckoutForm;