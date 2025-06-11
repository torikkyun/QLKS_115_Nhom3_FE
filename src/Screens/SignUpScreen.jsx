import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Image/Logo.png";
import HotelImage from "../assets/Image/Hotel.jpg";
import { register } from "../apis/Auth";
import { Eye, EyeOff, User, Phone, Mail, CreditCard, Lock } from "lucide-react";

const SignUpScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    cccd: "",
    password: "",
    avatar: null,
    avatarBase64: null,
    maVaiTro: 1,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sử dụng useCallback để tối ưu hiệu suất
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleAvatarChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra định dạng file
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file ảnh (JPG, PNG, ...)");
        return;
      }
      // Kiểm tra kích thước file
      if (file.size > 2 * 1024 * 1024) {
        alert("Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.");
        return;
      }

      const avatarUrl = URL.createObjectURL(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData((prev) => ({
          ...prev,
          avatar: avatarUrl,
          avatarBase64: base64String,
        }));
        setErrors((prev) => ({ ...prev, avatar: false }));
        console.log("Avatar converted to base64 successfully");
      };
      reader.onerror = () => {
        console.error("Error reading file:", file);
        alert("Không thể đọc file ảnh. Vui lòng thử lại.");
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitted(true);

      const newErrors = {};
      const stringFields = ["firstName", "lastName", "phoneNumber", "email", "cccd", "password"];
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\d{10}$/;
      const cccdRegex = /^\d{12}$/;

      stringFields.forEach((key) => {
        if (formData[key].trim() === "") {
          newErrors[key] = "This field is required";
        }
        if (key === "email" && !emailRegex.test(formData.email)) {
          newErrors[key] = "Invalid email format";
        }
        if (key === "phoneNumber" && !phoneRegex.test(formData.phoneNumber)) {
          newErrors[key] = "Phone number must be 10 digits";
        }
        if (key === "cccd" && !cccdRegex.test(formData.cccd)) {
          newErrors[key] = "CCCD must be 12 digits";
        }
        if (key === "password" && formData.password.length < 8) {
          newErrors[key] = "Password must be at least 8 characters";
        }
      });

      if (!formData.avatar) {
        newErrors.avatar = "Avatar is required";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        try {
          setIsLoading(true);
          const { firstName, lastName, phoneNumber, email, cccd, password, maVaiTro, avatarBase64 } = formData;

          const payload = {
            ho: lastName,
            ten: firstName,
            sdt: phoneNumber,
            email,
            cccd,
            matKhau: password,
            maVaiTro: parseInt(maVaiTro),
          };

          console.log("Sending payload to API:", payload);
          const response = await register(payload);
          console.log("API response:", response);

          if (avatarBase64) {
            try {
              const existingAvatars = localStorage.getItem("userAvatars");
              let avatarMap = existingAvatars ? JSON.parse(existingAvatars) : {};
              avatarMap[email] = avatarBase64;
              localStorage.setItem("userAvatars", JSON.stringify(avatarMap));
              localStorage.removeItem("userAvatar");
              console.log("Avatar saved to localStorage for email:", email);
            } catch (error) {
              console.error("Error saving avatar to localStorage:", error);
              alert("Không thể lưu ảnh đại diện vào localStorage.");
            }
          }

          alert("Đăng ký thành công!");
          navigate("/login");
        } catch (error) {
          console.error("Registration error:", error);
          let errorMessage = error.message || "Đăng ký thất bại.";
          if (error.message.includes("Failed to fetch")) {
            errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối.";
          } else if (error.response) {
            // Xử lý lỗi từ server (nếu sử dụng axios)
            errorMessage = error.response.data?.message || "Lỗi từ server.";
          }
          alert(`Đăng ký thất bại: ${errorMessage}`);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [formData, navigate]
  );

  return (
    <div className="h-screen w-full flex bg-gray-50 overflow-hidden">
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 flex flex-col h-full max-h-[90vh]">
          <img src={Logo} className="w-16 h-16 mx-auto mb-4" alt="Logo" loading="lazy" />

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            {/* First Name, Last Name, Avatar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700">First Name</label>
                <div className="relative">
                  <User className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First name"
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>
                {isSubmitted && errors.firstName && (
                  <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700">Last Name</label>
                <div className="relative">
                  <User className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last name"
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>
                {isSubmitted && errors.lastName && (
                  <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errors.lastName}</p>
                )}
              </div>
              <div className="flex flex-col items-center">
                <label className="block mb-1 text-xs font-medium text-gray-700">Avatar</label>
                <div
                  className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => document.getElementById("avatarInput").click()}
                >
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt="Avatar Preview"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-xl">+</span>
                  )}
                </div>
                <input
                  type="file"
                  id="avatarInput"
                  name="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                {isSubmitted && errors.avatar && (
                  <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errors.avatar}</p>
                )}
              </div>
            </div>

            {/* Other Fields */}
            {[
              { name: "phoneNumber", label: "Phone Number", type: "tel", icon: Phone },
              { name: "email", label: "Email", type: "email", icon: Mail },
              { name: "cccd", label: "CCCD", type: "text", icon: CreditCard },
              { name: "password", label: "Password", type: showPassword ? "text" : "password", icon: Lock },
            ].map(({ name, label, type, icon: Icon }) => (
              <div className="mb-3" key={name}>
                <label className="block mb-1 text-xs font-medium text-gray-700">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    placeholder={label}
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition"
                    autoComplete={name === "email" ? "email" : name === "password" ? "new-password" : undefined}
                  />
                  {name === "password" && (
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
                {isSubmitted && errors[name] && (
                  <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errors[name]}</p>
                )}
              </div>
            ))}

            {/* Role Selection */}
            <div className="mb-4">
              <label className="block mb-1 text-xs font-medium text-gray-700">Role</label>
              <select
                name="maVaiTro"
                value={formData.maVaiTro}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition"
              >
                <option value={1}>Quản trị</option>
                <option value={2}>Nhân viên</option>
              </select>
            </div>

            {/* Submit Button */}
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
                  Submitting...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>

            {/* Login Link */}
            <p className="text-center text-gray-600 mt-3 text-xs">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden md:block md:w-1/2">
        <img src={HotelImage} alt="Hotel" className="w-full h-full object-cover" loading="lazy" />
      </div>
    </div>
  );
};

export default SignUpScreen;