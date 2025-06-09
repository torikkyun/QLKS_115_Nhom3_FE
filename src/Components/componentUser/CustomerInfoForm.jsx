// CustomerInfoForm.jsx
import React from 'react';
import { Form, Input, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const CustomerInfoForm = ({ form, customerInfo, setCustomerInfo, handleSubmit, loading, isMultiBooking }) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1">
      <Form layout="vertical" onFinish={handleSubmit} form={form} initialValues={customerInfo} size="middle">
        <h3 className="font-bold text-lg text-gray-800 flex items-center mb-4">
          <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-500" />
          {t('customer_info', { defaultValue: 'Thông tin khách hàng' })}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="ho"
            label={<span className="text-sm text-gray-700">{t('last_name', { defaultValue: 'Họ và tên đệm' })}</span>}
            rules={[{ required: true, message: t('last_name_required', { defaultValue: 'Vui lòng nhập họ và tên đệm' }) }]}
            className="mb-4"
          >
            <Input
              value={customerInfo?.ho}
              onChange={(e) => setCustomerInfo({ ...customerInfo, ho: e.target.value })}
              className="rounded-lg h-10"
              placeholder={t('last_name_placeholder', { defaultValue: 'Nhập họ và tên đệm' })}
            />
          </Form.Item>
          <Form.Item
            name="ten"
            label={<span className="text-sm text-gray-700">{t('first_name', { defaultValue: 'Tên' })}</span>}
            rules={[{ required: true, message: t('first_name_required', { defaultValue: 'Vui lòng nhập tên' }) }]}
            className="mb-4"
          >
            <Input
              value={customerInfo?.ten}
              onChange={(e) => setCustomerInfo({ ...customerInfo, ten: e.target.value })}
              className="rounded-lg h-10"
              placeholder={t('first_name_placeholder', { defaultValue: 'Nhập tên' })}
            />
          </Form.Item>
        </div>
        <Form.Item
          name="email"
          label={<span className="text-sm text-gray-700">{t('email_label', { defaultValue: 'Địa chỉ Email' })}</span>}
          rules={[
            { required: true, message: t('email_required', { defaultValue: 'Vui lòng nhập email' }) },
            { type: 'email', message: t('email_invalid', { defaultValue: 'Email không đúng định dạng' }) },
          ]}
          className="mb-4"
        >
          <Input
            value={customerInfo?.email}
            onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
            className="rounded-lg h-10"
            placeholder={t('email_placeholder', { defaultValue: 'Nhập email' })}
          />
        </Form.Item>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="sdt"
            label={<span className="text-sm text-gray-700">{t('phone', { defaultValue: 'Số điện thoại' })}</span>}
            rules={[
              { required: true, message: t('phone_required', { defaultValue: 'Vui lòng nhập số điện thoại' }) },
              { pattern: /^[0-9]{10,11}$/, message: t('phone_invalid', { defaultValue: 'Số điện thoại phải là 10-11 số' }) },
            ]}
            className="mb-4"
          >
            <Input
              value={customerInfo?.sdt}
              onChange={(e) => setCustomerInfo({ ...customerInfo, sdt: e.target.value })}
              className="rounded-lg h-10"
              placeholder={t('phone_placeholder', { defaultValue: 'Nhập số điện thoại' })}
            />
          </Form.Item>
          <Form.Item
            name="cccd"
            label={<span className="text-sm text-gray-700">{t('id_number', { defaultValue: 'Số CMND/CCCD' })}</span>}
            rules={[
              { required: true, message: t('id_number_required', { defaultValue: 'Vui lòng nhập số CMND/CCCD' }) },
              { pattern: /^[0-9]{9}$|^[0-9]{12}$/, message: t('id_number_invalid', { defaultValue: 'Số CMND/CCCD phải là 9 hoặc 12 số' }) },
            ]}
            className="mb-4"
          >
            <Input
              value={customerInfo?.cccd}
              onChange={(e) => setCustomerInfo({ ...customerInfo, cccd: e.target.value })}
              className="rounded-lg h-10"
              placeholder={t('id_number_placeholder', { defaultValue: 'Nhập số CMND/CCCD' })}
            />
          </Form.Item>
        </div>
        <Form.Item
          name="ghiChu"
          label={<span className="text-sm text-gray-700">{t('notes', { defaultValue: 'Ghi chú (tùy chọn)' })}</span>}
          className="mb-4"
        >
          <Input.TextArea
            rows={3}
            className="rounded-lg"
            placeholder={t('notes_placeholder', { defaultValue: 'Nhập ghi chú hoặc yêu cầu đặc biệt' })}
          />
        </Form.Item>
        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            className="bg-blue-600 hover:bg-blue-700 border-0 rounded-xl h-12 text-base font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            {t('confirm_booking', {
              defaultValue: isMultiBooking ? 'Xác nhận đặt tất cả' : 'Xác nhận đặt phòng',
            })}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CustomerInfoForm;