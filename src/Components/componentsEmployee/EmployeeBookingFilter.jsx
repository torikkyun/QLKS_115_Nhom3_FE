import React, { useState } from 'react';
import { Input, Select, Button } from 'antd';

const { Option } = Select;

const EmployeeBookingFilter = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const handleSearch = () => {
    onFilterChange({ search });
  };

  const handleReset = () => {
    setSearch('');
    onFilterChange({ search: '' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <Input
        placeholder="Tìm theo mã phòng, mã KH, tên KH, NV"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full"
      />
      <div className="flex space-x-2">
        <Button
          type="primary"
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Tìm kiếm
        </Button>
        <Button onClick={handleReset}>Xóa</Button>
      </div>
    </div>
  );
};

export default EmployeeBookingFilter;