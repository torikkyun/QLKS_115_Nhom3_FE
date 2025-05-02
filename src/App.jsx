import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginScreen from "./Screens/LoginScreen";
import SignUpScreen from "./Screens/SignUpScreen";
import Dashboard from "./Screens/Customers/Dashboard";
import RoomList from "./Screens/Employee/RoomList";
import CustomerList from "./Screens/Employee/CustomerList";
import BookingList from "./Screens/Employee/BookingList";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/" element={<LoginScreen />} />
        <Route path="user/home" element={<Dashboard />} />
        <Route path="employee/rooms" element={<RoomList />} />
        <Route path="employee/customers" element={<CustomerList />} />
        <Route path="employee/bookings" element={<BookingList />} />
      </Routes>
    </Router>
  );
}

export default App;