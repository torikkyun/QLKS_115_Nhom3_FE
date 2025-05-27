import { createBrowserRouter } from "react-router-dom";
import LoginScreen from "../Screens/LoginScreen";
import SignUpScreen from "../Screens/SignUpScreen";
import Dashboard from "../Screens/Customers/Dashboard";
import RoomManagement from "../Screens/Admin/RoomManagement";
import EmployeeManegement from "../Screens/Admin/EmployeeManagement";
import PromotionsPage from "../Screens/Admin/PromotionManagement";
import AdminDashBoard from "../Screens/Admin/AdminDashBoard";
import ServiceManagement from "../Screens/Admin/ServiceManagement";
import BillManagement from "../Screens/Admin/BillManagement";
import DetailRoom from "../Screens/Customers/DettailRoom";
import CartPage from "../Screens/Customers/CartPage";
// import Intro from "../Screens/Customers/Intro";
import PromotionScreen from "../Screens/Customers/PromotionScreen";
import AboutUs from "../Screens/Customers/AboutUs";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Dashboard />,
    },
    {
        path: "/login",
        element: <LoginScreen />,
    },
    {
        path: "/signup",
        element: <SignUpScreen />,
    },
    {
        path: "/user/home",
        element: <Dashboard />, // Home.jsx
    },
    {
        path: "/admin/dashboard",
        element: <AdminDashBoard />
    },
    {
        path: "/admin/room_management",
        element: <RoomManagement />,
    },
    {
        path: "/admin/room_management/staff",
        element: <EmployeeManegement />,
    },
    {
        path: "/admin/room_management/promotions",
        element: <PromotionsPage />,
    },
    {
        path: "/admin/room_management/services",
        element: <ServiceManagement />,
    },
    {
        path: "/admin/bill",
        element: <BillManagement/>,
    },
    {
        path: "/user/detailroom/:maPhong",
        element: <DetailRoom />, // DetailRoom.jsx
    },
    {
        path: "/user/CartPage",
        element: <CartPage/>, 
    },
    {
        path: "/user/promotion/:maKhuyenMai",
        element: <PromotionScreen />,
    },
    {
        path: "/user/aboutus",
        element: <AboutUs />,
    }

]);