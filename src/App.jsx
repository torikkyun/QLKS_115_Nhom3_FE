import React from 'react';

import LoginScreen from './Screens/LoginScreen';
import Footer from './assets/Components/Footer';
import Item from './assets/Components/RoomCard';
import UserCard from './assets/Components/UserCard';
function App() {
  
  return (
    
    <div>
        <UserCard
          // image= "https://randomuser.me/api/portraits/women/68.jpg"
          // name="Lê Thị Mai"
          // info= "Phục vụ phòng - Ca tối"
          // onEdit={() => alert(`Sửa thông tin của ${user.name}`)}
          // onDelete={() => alert(`Xoá người dùng ${user.name}`)}
        />
      
      <Footer />
    </div>
  );
}

export default App;
