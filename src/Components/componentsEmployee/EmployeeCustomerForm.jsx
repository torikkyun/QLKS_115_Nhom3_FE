import React from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';

const { Option } = Select;

const EmployeeCustomerForm = ({ visible, onCancel, onSave, customer }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSave(values); 
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title={customer ? 'Sửa thông tin' : 'Thêm khách hàng'}
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
      <Form form={form} layout="vertical" initialValues={customer}>
        <Form.Item
          name="maKhachHang"
          label="Mã khách hàng"
          rules={[{ required: true, message: 'Vui lòng nhập mã' }]}
        >
          <InputNumber className="w-full" />
        </Form.Item>
        <Form.Item
          name="ho"
          label="Họ"
          rules={[{ required: true, message: 'Vui lòng ghi đúng' }]}
        >
            <Input className="w-full" />
        </Form.Item>
        <Form.Item
          name="ten"
          label="Tên"
          rules={[{ required: true, message: 'Vui lòng ghi đúng' }]}
        >
          <Input className="w-full" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Vui lòng ghi đúng' }]}
        >
            <Input className="w-full" />   
        </Form.Item>
        <Form.Item
          name="sdt"
          label="Số điện thoại"
          rules={[{ required: true, message: 'Vui lòng ghi đúng' }]}
        >
            <Input className="w-full" />   
        </Form.Item>
        <Form.Item
          name="cccd"
          label="CCCD"
          rules={[{ required: true, message: 'Vui lòng ghi đúng' }]}
        >
            <Input className="w-full" />   
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmployeeCustomerForm;