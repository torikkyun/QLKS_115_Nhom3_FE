import { Modal } from 'antd';

const CustomerDeleteConfirm = ({ visible, onConfirm, onCancel }) => {
  return (
    <Modal
      title="Xác nhận xóa"
      visible={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{ className: 'bg-red-500 hover:bg-red-600' }}
      className="rounded-lg"
    >
      <p className="text-gray-700">Bạn có chắc chắn muốn xóa không?</p>
    </Modal>
  );
};

export default CustomerDeleteConfirm;