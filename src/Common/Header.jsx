import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Avatar, Dropdown, Menu, Badge, Button } from 'antd';
import {
  SearchOutlined,
  BellOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ExceptionMap } from 'antd/es/result';
import ProfilePutModal from '../Components/componentsAdmin/ProfilePutModal';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      } 
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => setIsProfileModalOpen(true)}>
        Hồ sơ
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Cài đặt
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <div className="bg-blue-900 shadow-md p-4">
      <Row align="middle" justify="space-between">
        <Col>
          <Input
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
          />
        </Col>
        <Col>
          {user ? (
            <Row align="middle" gutter={16}>
              <Col>
                <Badge count={5}>
                  <Button
                    icon={<BellOutlined />}
                    shape="circle"
                    className="text-gray-600"
                  />
                </Badge>
              </Col>
              <Col>
                <Dropdown overlay={menu} trigger={['click']}>
                  <div className="flex items-center cursor-pointer wrap">
                    <Avatar src={user.avatar} />
                    <div className='flex flex-col'>
                      <span className="ml-2 text-gray-200 font-semibold">{user.name}</span>
                      <span className="ml-2 text-gray-300">{user.email}</span>
                    </div>
                  </div>
                </Dropdown>
              </Col>
            </Row>
          ) : (
            <Button type="primary" onClick={handleLogin}>
              Đăng nhập
            </Button>
          )}
        </Col>
      </Row >
      <ProfilePutModal
  isOpen={isProfileModalOpen}
  onClose={() => setIsProfileModalOpen(false)}
  onSave={(updatedData) => {
    // Cập nhật lại user trong localStorage nếu cần
    const user = { ...JSON.parse(localStorage.getItem('user')), ...updatedData };
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    setIsProfileModalOpen(false);
  }}
/>
    </div >
  );
};
    
export default Header;