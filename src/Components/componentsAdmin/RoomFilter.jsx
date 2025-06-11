import React, { useState } from 'react';
import { Input, Select, Button } from 'antd';

const { Option } = Select;

const RoomFilter = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');

  const handleSearch = () => {
    onFilterChange({ search, status, type });
  };

  const handleReset = () => {
    setSearch('');
    setStatus('');
    setType('');
    onFilterChange({ search: '', status: '', type: '' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <Input
        placeholder="Tìm theo số phòng hoặc mã phòng"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full"
      />
      <Select
        placeholder="Chọn trạng thái"
        value={status}
        onChange={(value) => setStatus(value)}
        className="w-full"
        allowClear
      >
        <Option value="0">Đã sử dụng</Option>
        <Option value="1">Trống</Option>
        
      </Select>
     
      <div className="flex space-x-2">
        <Button
          type="primary"
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Tìm kiếm
        </Button>
        <Button onClick={handleReset}>Xóa bộ lọc</Button>
      </div>
    </div>
  );
};

export default RoomFilter;