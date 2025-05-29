import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker } from 'antd';
import moment from 'moment';

const EmployeeBookingForm = ({ visible, onCancel, onSave, record }) => {
  const [form] = Form.useForm();

  // Khi có record (edit) thì fill dữ liệu ban đầu, chuyển đổi chuỗi ngày thành moment
  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        ...record,
        ngayNhanPhong: record.ngayNhanPhong ? moment(record.ngayNhanPhong) : null,
        ngayTraPhong: record.ngayTraPhong ? moment(record.ngayTraPhong) : null,
      });
    } else {
      form.resetFields();
    }
  }, [record, form, visible]);

  // Khi submit form, chuyển đổi sang cấu trúc mà API yêu cầu
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        // Nếu dichVuIds nhập dưới dạng chuỗi, chuyển thành mảng (giả sử người dùng nhập "1,2,3")
        const dichVuIdsArray =
          typeof values.dichVuIds === 'string'
            ? values.dichVuIds.split(',').map(item => item.trim()).filter(item => item !== '')
            : values.dichVuIds;

        // Chuyển đổi thời gian từ moment sang định dạng chuỗi
        const ngayNhanPhong = values.ngayNhanPhong
          ? values.ngayNhanPhong.format('YYYY-MM-DD')
          : null;
        const ngayTraPhong = values.ngayTraPhong
          ? values.ngayTraPhong.format('YYYY-MM-DD')
          : null;

        // Tạo cấu trúc booking theo yêu cầu của API
        const booking = {
          phongDichVus: [
            {
              maPhong: values.maPhong,
              dichVuIds: dichVuIdsArray,
              ngayNhanPhong: ngayNhanPhong,
              ngayTraPhong: ngayTraPhong,
            }
          ],
          khuyenMaiId: values.khuyenMaiId,
          ghiChu: values.ghiChu,
          maKhachHang: values.maKhachHang,
        };

        onSave(booking);
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title={record ? 'Sửa thông tin' : 'Thêm danh sách'}
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
      <Form form={form} layout="vertical">
        <Form.Item
          name="maPhong"
          label="Mã Phòng"
          rules={[{ required: true, message: 'Vui lòng nhập mã phòng' }]}
        >
          <InputNumber className="w-full" />
        </Form.Item>
        <Form.Item
          name="dichVuIds"
          label="Loại Dịch Vụ (ID, cách nhau bởi dấu phẩy)"
          rules={[{ required: true, message: 'Vui lòng nhập loại dịch vụ' }]}
        >
          <Input className="w-full" />
        </Form.Item>
        <Form.Item
          name="ngayNhanPhong"
          label="Ngày Nhận Phòng"
          rules={[{ required: true, message: 'Vui lòng nhập ngày nhận phòng' }]}
        >
          <DatePicker className="w-full" format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          name="ngayTraPhong"
          label="Ngày Trả Phòng"
          rules={[{ required: true, message: 'Vui lòng nhập ngày trả phòng' }]}
        >
          <DatePicker className="w-full" format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          name="khuyenMaiId"
          label="Khuyến Mãi"
          rules={[{ required: true, message: 'Vui lòng nhập khuyến mãi' }]}
        >
          <InputNumber className="w-full" />
        </Form.Item>
        <Form.Item
          name="ghiChu"
          label="Ghi Chú"
          rules={[{ required: true, message: 'Vui lòng nhập ghi chú' }]}
        >
          <Input className="w-full" />
        </Form.Item>
        <Form.Item
          name="maKhachHang"
          label="Mã Khách Hàng"
          rules={[{ required: true, message: 'Vui lòng nhập mã khách hàng' }]}
        >
          <InputNumber className="w-full" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmployeeBookingForm;



/*
import React from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';

const { Option } = Select;

const EmployeeCustomerForm = ({ visible, onCancel, onSave, record }) => {
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
      title={record ? 'Sửa thông tin' : 'Thêm danh sách'}
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
      <Form form={form} layout="vertical" initialValues={record}>
        <Form.Item
          name="maPhong"
          label="Mã Phòng"
          rules={[{ required: true, message: 'Vui lòng nhập mã' }]}
        >
          <InputNumber className="w-full" />
        </Form.Item>
        <Form.Item
          name="dichVuIds"
          label="Loại Dịch Vụ"
          rules={[{ required: true, message: 'Vui lòng ghi đúng' }]}
        >
            <Input className="w-full" />
        </Form.Item>
        <Form.Item
          name="ngayDatPhong"
          label="Ngày Đặt Phòng"
          rules={[{ required: true, message: 'Vui lòng ghi đúng' }]}
        >
          <Input className="w-full" />
        </Form.Item>
        <Form.Item
          name="ngayTraPhong"
          label="Ngày Trả Phòng"
          rules={[{ required: true, message: 'Vui lòng ghi đúng' }]}
        >
            <Input className="w-full" />   
        </Form.Item>
        <Form.Item
          name="khuyenMaiId"
          label="Khuyến Mãi"
          rules={[{ required: true, message: 'Vui lòng ghi đúng' }]}
        >
            <Input className="w-full" />   
        </Form.Item>
        <Form.Item
          name="ghiChu"
          label="Ghi Chú"
          rules={[{ required: true, message: 'Vui lòng ghi đúng' }]}
        >
            <Input className="w-full" />   
        </Form.Item>
        <Form.Item
          name="maKhachHang"
          label="Mã KH"
          rules={[{ required: true, message: 'Vui lòng ghi đúng' }]}
        >
            <Input className="w-full" />   
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmployeeCustomerForm;
*/