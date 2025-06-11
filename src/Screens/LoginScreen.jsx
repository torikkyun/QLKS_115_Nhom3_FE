import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react"; // Sử dụng biểu tượng từ lucide-react
import Hotel from "../assets/Image/Hotel.jpg";
import { login } from "../apis/Auth";

const LoginScreen = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading
  const navigate = useNavigate();

  // Regex kiểm tra email
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  // Regex kiểm tra số điện thoại
  const phoneRegex = /^[0-9]{10,15}$/;

  // Danh sách ánh xạ vai trò
  const roleMapping = {
    1: "Quản lý",
    2: "Lễ tân",
    3: "Phục vụ",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newErrors = {};

    // Kiểm tra email hoặc số điện thoại
    if (!emailOrPhone) {
      newErrors.emailOrPhone = "Please enter your email or phone number.";
    } else if (!emailRegex.test(emailOrPhone) && !phoneRegex.test(emailOrPhone)) {
      newErrors.emailOrPhone = "Please enter a valid email or phone number.";
    }

    // Kiểm tra mật khẩu
    if (!password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    // Nếu không có lỗi, gọi API login
    if (Object.keys(newErrors).length === 0) {
      try {
        // Xóa token cũ để tránh xung đột
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Gọi hàm login
        const data = await login(emailOrPhone, password);

        // Ánh xạ vai trò từ số sang chuỗi
        const roleId = data.user?.vaiTro;
        const roleName = roleMapping[roleId];
        if (!roleName) {
          throw new Error("Vai trò không hợp lệ. Chỉ Quản lý, Lễ tân hoặc Phục vụ được phép đăng nhập!");
        }

        // Lưu token và thông tin người dùng
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        if (data.user) {
          const userData = {
            name: data.user.ho + " " + data.user.ten || "Unknown User",
            email: data.user.email || emailOrPhone,
            avatar:
              data.user.avatar ||
              "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740",
            role: roleName,
            maNhanVien: data.user.maNhanVien,
          };
          localStorage.setItem("user", JSON.stringify(userData));
        }

        // Chuyển hướng dựa trên vai trò
        if (roleName === "Quản lý") {
          navigate("/admin/dashboard");
        } else if (roleName === "Lễ tân" || roleName === "Phục vụ") {
          navigate('/employee/rooms'); // Chuyển hướng cho Nhân viên
        }
      } catch (error) {
        setErrors({ api: error.message || "Email hoặc mật khẩu không đúng" });
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-gray-50 overflow-hidden">
      {/* Image Section */}
      <div className="hidden md:block md:w-1/2 relative">
        <img src={Hotel} alt="Hotel" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-opacity-40 flex items-end p-6">
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-3">Effortless Hotel Management</h2>
            <p className="text-sm">Discover the finest hotels from all over the world.</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6 flex flex-col h-full max-h-[65vh]">
          <h2 className="text-xl font-bold mb-4 text-center">
            Welcome to <span className="text-indigo-600">8 BROSS</span>
          </h2>

          {/* Social Login Buttons */}
          <button
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg py-2 px-3 mb-3 text-sm hover:bg-gray-50 transition"
            disabled={isLoading}
          >
            <img src="https://img.icons8.com/color/20/000000/google-logo.png" alt="Google" />
            Login with Google
          </button>
          <button
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg py-2 px-3 mb-4 text-sm hover:bg-blue-700 transition"
            disabled={isLoading}
          >
            <img src="https://img.icons8.com/ios-filled/20/ffffff/facebook-new.png" alt="Facebook" />
            Login with Facebook
          </button>

          {/* Divider */}
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-white text-gray-500 text-xs">OR</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700">Email or Phone</label>
              <div className="relative">
                <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Email or Phone Number"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
              {errors.emailOrPhone && (
                <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errors.emailOrPhone}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errors.password}</p>
              )}
            </div>

            {errors.api && <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errors.api}</p>}

            <div className="text-right">
              <Link to="/forgot-password" className="text-xs text-indigo-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition focus:ring-1 focus:ring-indigo-500 focus:ring-offset-1 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-4 w-4 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form> 
              
          <p className="text-center mt-3 text-gray-600 text-xs">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;