import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker } from 'antd';
import moment from 'moment';

const EmployeeBookingForm = ({ visible, onCancel, onSave, record }) => {
  const [form] = Form.useForm();

  // useEffect để fill dữ liệu ban đầu khi có record (chế độ chỉnh sửa)
  // và reset form khi không có record (chế độ thêm mới) hoặc modal ẩn/hiện
  useEffect(() => {
    if (visible) { // Chỉ setFieldsValue khi modal hiển thị để tránh lỗi
      if (record) {
        form.setFieldsValue({
          ...record,
          // Chuyển đổi chuỗi ngày thành đối tượng moment
          ngayNhanPhong: record.ngayNhanPhong ? moment(record.ngayNhanPhong) : null,
          ngayTraPhong: record.ngayTraPhong ? moment(record.ngayTraPhong) : null,
          // dichVuIds có thể là mảng số, chuyển lại thành chuỗi nếu cần hiển thị trong Input
          // Giả định nếu record.dichVuIds là mảng [1,2] thì muốn hiển thị "1,2" trong input
          dichVuIds: Array.isArray(record.phongDichVus?.[0]?.dichVuIds)
            ? record.phongDichVus[0].dichVuIds.join(',')
            : (typeof record.dichVuIds === 'string' ? record.dichVuIds : ''),
          // Lấy các trường từ phongDichVus nếu có
          maPhong: record.phongDichVus?.[0]?.maPhong || null,
          // Đảm bảo ghiChu, khuyenMaiId, maKhachHang được lấy trực tiếp từ record nếu có
        });
      } else {
        form.resetFields(); // Reset form cho trường hợp thêm mới
      }
    }
  }, [record, form, visible]); // Dependency array: record, form instance, and visible state

  // Hàm xử lý khi submit form
  const handleOk = () => {
    form
      .validateFields() // Validate tất cả các trường trong form
      .then((values) => {
        // --- Sửa đổi vấn đề 1: Chuyển đổi dichVuIds thành mảng số ---
        let dichVuIdsArray = [];
        if (typeof values.dichVuIds === 'string' && values.dichVuIds.trim() !== '') {
          // Tách chuỗi, loại bỏ khoảng trắng, lọc bỏ phần tử rỗng và chuyển đổi thành số
          dichVuIdsArray = values.dichVuIds.split(',')
            .map(item => Number(item.trim()))
            .filter(item => !isNaN(item)); // Loại bỏ các giá trị không phải số
        } else if (Array.isArray(values.dichVuIds)) {
          // Nếu đã là mảng, đảm bảo các phần tử là số và loại bỏ NaN
          dichVuIdsArray = values.dichVuIds.map(Number).filter(item => !isNaN(item));
        }

        // Chuyển đổi thời gian từ đối tượng moment sang định dạng chuỗi "YYYY-MM-DD"
        const ngayNhanPhong = values.ngayNhanPhong
          ? values.ngayNhanPhong.format('YYYY-MM-DD')
          : null;
        const ngayTraPhong = values.ngayTraPhong
          ? values.ngayTraPhong.format('YYYY-MM-DD')
          : null;

        // Tạo cấu trúc booking theo yêu cầu của API (đây là đối tượng đơn lẻ)
        const singleBookingObject = {
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

        // --- Sửa đổi vấn đề 2: Truyền một MẢNG chứa đối tượng booking tới onSave ---
        onSave([singleBookingObject]); // API addBooking mong đợi một mảng

        form.resetFields(); // Reset form sau khi lưu thành công
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
        // Có thể hiển thị thông báo lỗi cho người dùng tại đây
      });
  };

  return (
    <Modal
      title={record ? 'Sửa thông tin đặt phòng' : 'Thêm đặt phòng mới'}
      visible={visible}
      onOk={handleOk}
      onCancel={() => {
        onCancel(); // Gọi hàm onCancel từ props
        form.resetFields(); // Reset form khi hủy
      }}
      okText="Lưu"
      cancelText="Hủy"
      className="rounded-lg" // Thêm class để bo tròn góc modal
    >
      <Form form={form} layout="vertical">
        {/* Các trường nhập liệu của Form */}
        <Form.Item
          name="maPhong"
          label="Mã Phòng"
          rules={[{ required: true, message: 'Vui lòng nhập mã phòng!' }]}
        >
          <InputNumber className="w-full" min={0} /> {/* Thêm min={0} cho InputNumber */}
        </Form.Item>
        <Form.Item
          name="dichVuIds"
          label="ID Dịch Vụ (cách nhau bởi dấu phẩy, ví dụ: 1,2,3)"
          rules={[{ required: true, message: 'Vui lòng nhập ID dịch vụ!' }]}
          tooltip="Nhập nhiều ID dịch vụ, cách nhau bởi dấu phẩy."
        >
          <Input className="w-full" placeholder="Ví dụ: 1,2,3" />
        </Form.Item>
        <Form.Item
          name="ngayNhanPhong"
          label="Ngày Nhận Phòng"
          rules={[{ required: true, message: 'Vui lòng chọn ngày nhận phòng!' }]}
        >
          <DatePicker className="w-full" format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          name="ngayTraPhong"
          label="Ngày Trả Phòng"
          rules={[{ required: true, message: 'Vui lòng chọn ngày trả phòng!' }]}
        >
          <DatePicker className="w-full" format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          name="khuyenMaiId"
          label="Mã Khuyến Mãi (nếu có)"
          rules={[{ required: false, message: 'Vui lòng nhập mã khuyến mãi!' }]} // Có thể không bắt buộc nếu không luôn có khuyến mãi
        >
          <InputNumber className="w-full" min={0} />
        </Form.Item>
        <Form.Item
          name="ghiChu"
          label="Ghi Chú"
          rules={[{ required: false, message: 'Vui lòng nhập ghi chú!' }]}
        >
          <Input.TextArea rows={1} className="w-full" /> {/* Dùng TextArea cho ghi chú dài */}
        </Form.Item>
        <Form.Item
          name="maKhachHang"
          label="Mã Khách Hàng"
          rules={[{ required: true, message: 'Vui lòng nhập mã khách hàng!' }]}
        >
          <InputNumber className="w-full" min={0} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmployeeBookingForm;













/*
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
*/


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