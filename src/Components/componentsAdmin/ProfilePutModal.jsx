import React, { useEffect, useState } from 'react';
import { updateStaff, getStaffById } from '../../apis/apistaff';

const ProfilePutModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    ho: '',
    ten: '',
    sdt: '',
    email: '',
    cccd: '',
    vaiTro: '',
  });

  const selectedId = JSON.parse(localStorage.getItem('user'))?.maNhanVien;

  // Lấy dữ liệu từ API khi modal mở và có ID
  useEffect(() => {
    if (isOpen && selectedId) {
      getStaffById(selectedId)
        .then(data => {
          setFormData({
            ho: data.ho || '',
            ten: data.ten || '',
            sdt: data.sdt || '',
            email: data.email || '',
            cccd: data.cccd || '',
            vaiTro: data.vaiTro?.toString() || '',
          });
        })
        .catch(err => {
          console.error('Lỗi khi fetch dữ liệu:', err);
        });
    } else {
      setFormData({
        ho: '',
        ten: '',
        sdt: '',
        email: '',
        cccd: '',
        vaiTro: '',
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!selectedId) {
      alert('Không tìm thấy ID nhân viên.');
      return;
    }

    try {
      const updatedStaff = await updateStaff({ maNhanVien: selectedId, ...formData });
      onSave(updatedStaff); // callback nếu cần
      onClose();
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi cập nhật.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(75,85,99,0.4)] flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Thông tin nhân viên</h2>

        <div className="space-y-3">
          <div>
            <label className="text-sm">First name</label>
            <input
              name="ho"
              value={formData.ho}
              onChange={handleChange}
              placeholder="Nhập họ"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="text-sm">Last name</label>
            <input
              name="ten"
              value={formData.ten}
              onChange={handleChange}
              placeholder="Nhập tên"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="text-sm">Phone Number</label>
            <input
              name="sdt"
              value={formData.sdt}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="text-sm">Email Address</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email"
              className="w-full p-2 border rounded"
              readOnly
            />
          </div>

          <div>
            <label className="text-sm">CCCD</label>
            <input
              name="cccd"
              value={formData.cccd}
              onChange={handleChange}
              placeholder="Nhập CCCD"
              className="w-full p-2 border rounded"
            />
          </div>

        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Hủy</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Lưu</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePutModal;
