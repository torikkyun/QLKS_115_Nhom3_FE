import { createBrowserRouter } from "react-router-dom";
import LoginScreen from "../Screens/LoginScreen";
import SignUpScreen from "../Screens/SignUpScreen";
import DashboardPage from "../Screens/Customers/DashboardPage";
import RoomManagement from "../Screens/Admin/RoomManagement";
import EmployeeManegement from "../Screens/Admin/EmployeeManagement";
import PromotionsPage from "../Screens/Admin/PromotionManagement";
import AdminDashBoard from "../Screens/Admin/AdminDashBoard";
import ServiceManagement from "../Screens/Admin/ServiceManagement";
import BillManagement from "../Screens/Admin/BillManagement";
import DetailRoomPage from "../Screens/Customers/DettailRoomPage";
import CartPage from "../Screens/Customers/CartPage";
// import Intro from "../Screens/Customers/Intro";
import PromotionPage from "../Screens/Customers/PromotionPage";
import AboutUsPage from "../Screens/Customers/AboutUsPage";
import InvoicePage from "../Screens/Customers/InvoicePage";
import RoomsPage from "../Screens/Customers/RoomsPage";
import LookupInvoicePage from "../Screens/Customers/LookupInvoicePage";
import ContactPage from "../Screens/Customers/ContactPage";
import EmployeeCustomerList from "../Screens/Employee/EmployeeCustomerList";
import EmployeeRoomList from "../Screens/Employee/EmployeeRoomList";
import EmployeeBookingList from "../Screens/Employee/EmployeeBookingList";
import AdminBookingList from "../Screens/Admin/AdminBookingList";
import NotFound from "../Common/NotFoud";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <DashboardPage />,
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
        element: <DashboardPage />, // Home.jsx
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
        element: <BillManagement />,
    },
    {
        path: "/user/detailroom/:maPhong",
        element: <DetailRoomPage />, // DetailRoom.jsx
    },
    {
        path: "/user/CartPage",
        element: <CartPage />,
    },
    {
        path: "/user/promotion/:maKhuyenMai",
        element: <PromotionPage />,
    },
    {
        path: "/user/aboutus",
        element: <AboutUsPage />,
    },
    {
        path: "/user/invoice/:maDatPhong",
        element: <InvoicePage />,
    },
    {
        path: "user/rooms",
        element: <RoomsPage />,
    },
    {
        path: "/user/lookupinvoice",
        element: <LookupInvoicePage />,
    },
    {
        path: "/user/contact",
        element: <ContactPage />,
    },
    {
        path: "/employee/rooms",
        element: <EmployeeRoomList />
    },
    {
        path: "/employee/customers",
        element: <EmployeeCustomerList />
    },
    {
        path: "/admin/room-bookings",
        element: <AdminBookingList />
    },
    {
        path: "/employee/bookings",
        element: <EmployeeBookingList />
    },
    {
        path: "/common/notfoud",
        element: <NotFound/>,
    }

]);