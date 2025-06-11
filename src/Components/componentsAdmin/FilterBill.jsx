
import React from 'react';
import { Input, Select, DatePicker, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const FilterPanel = ({ onFilter, initialValues = {} }) => {
  const [filters, setFilters] = React.useState({
    search: initialValues.search || '',
    status: initialValues.status || '',
    dateRange: initialValues.dateRange || [],
    minTotal: initialValues.minTotal || '',
    maxTotal: initialValues.maxTotal || '',
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e) => {
    handleFilterChange('search', e.target.value);
  };

  const handleDateChange = (dates) => {
    handleFilterChange('dateRange', dates);
  };

  const applyFilters = () => {
    onFilter({
      search: filters.search,
      status: filters.status,
      dateFrom: filters.dateRange[0] ? filters.dateRange[0].toISOString() : '',
      dateTo: filters.dateRange[1] ? filters.dateRange[1].toISOString() : '',
      minTotal: filters.minTotal || '',
      maxTotal: filters.maxTotal || '',
    });
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: '',
      dateRange: [],
      minTotal: '',
      maxTotal: '',
    });
    onFilter({
      search: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      minTotal: '',
      maxTotal: '',
    });
  };

  return (
    <div className=" rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm theo tên khách hàng hoặc mã đăt phòng"
          value={filters.ten}
          onChange={handleSearch}
          className="w-full"
        />
        <Select
          placeholder="Trạng thái"
          value={filters.tenTinhTrang}
          onChange={(value) => handleFilterChange('status', value)}
          allowClear
          className="w-full"
        >
          <Option value="Đã thanh toán">Đã thanh toán</Option>
          <Option value="Chưa thanh toán">Chưa thanh toán</Option>
        </Select>
        <RangePicker
          value={filters.ngayDatPhong}
          onChange={handleDateChange}
          format="DD/MM/YYYY"
          className="w-full"
        />
        <Input
          placeholder="Tổng tiền từ (VND)"
          value={filters.minTotal}
          onChange={(e) => handleFilterChange('minTotal', e.target.value)}
          className="w-full"
          type="number"
        />
        <Input
          placeholder="Tổng tiền đến (VND)"
          value={filters.maxTotal}
          onChange={(e) => handleFilterChange('maxTotal', e.target.value)}
          className="w-full"
          type="number"
        />
        <div className="flex space-x-2">
          <Button type="primary" onClick={applyFilters} className="w-full">
            Lọc
          </Button>
          <Button onClick={resetFilters} className="w-full">
            Xóa lọc
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;