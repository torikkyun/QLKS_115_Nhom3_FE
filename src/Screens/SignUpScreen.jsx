import React, { useState } from "react";
import InputField from "../Components/InputField";
import Button from "../Components/Button";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Image/Logo.png";
import HotelImage from "../assets/Image/Hotel.jpg";
import { register } from "../apis/Auth";

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (value.trim() !== "") {
      setErrors({ ...errors, [name]: false });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.");
        console.error("File size too large:", file.size);
        return;
      }

      const avatarUrl = URL.createObjectURL(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData({
          ...formData,
          avatar: avatarUrl,
          avatarBase64: base64String,
        });
        setErrors({ ...errors, avatar: false });
        console.log("Avatar converted to base64:", base64String);
      };
      reader.onerror = () => {
        console.error("Error reading file:", file);
        alert("Không thể đọc file ảnh. Vui lòng thử lại.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const newErrors = {};
    const stringFields = ["firstName", "lastName", "phoneNumber", "email", "cccd", "password"];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const cccdRegex = /^\d{12}$/;

    // Xác thực dữ liệu
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
    console.log("Form validation errors:", newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setIsLoading(true);
        const { firstName, lastName, phoneNumber, email, cccd, password, maVaiTro, avatarBase64 } = formData;

        const payload = {
          ho: lastName,
          ten: firstName,
          sdt: phoneNumber,
          email: email,
          cccd: cccd,
          matKhau: password,
          maVaiTro: parseInt(maVaiTro),
        };

        console.log("API URL:", `${import.meta.env.VITE_API_BASE_URL}/Auth/register`);
        console.log("Payload sent to API:", payload);
        const response = await register(payload);
        console.log("API response:", response);

        if (avatarBase64) {
          try {
            // Lấy danh sách avatar hiện tại từ localStorage (nếu có)
            const existingAvatars = localStorage.getItem("userAvatars");
            let avatarMap = existingAvatars ? JSON.parse(existingAvatars) : {};

            // Thêm avatar mới vào danh sách, sử dụng email làm key
            avatarMap[email] = avatarBase64;

            // Lưu lại danh sách avatar vào localStorage
            localStorage.setItem("userAvatars", JSON.stringify(avatarMap));
            console.log("Avatar saved to localStorage for email:", email, avatarBase64);

            // Xóa key userAvatar cũ (nếu có) để tránh xung đột
            localStorage.removeItem("userAvatar");
          } catch (error) {
            console.error("Error saving avatar to localStorage:", error);
            alert("Không thể lưu ảnh đại diện vào localStorage. Kích thước ảnh có thể quá lớn.");
          }
        }

        const successMessage = `
          Đăng ký thành công!
          Họ: ${payload.ho}
          Tên: ${payload.ten}
          Số điện thoại: ${payload.sdt}
          Email: ${payload.email}
          CCCD: ${payload.cccd}
          Mật khẩu: ${payload.matKhau}
          Vai trò: ${payload.maVaiTro}
        `;
        alert(successMessage);

        navigate("/login");
      } catch (error) {
        console.error("Registration error:", error);
        let errorMessage = error.message;
        if (error.message.includes("Failed to fetch")) {
          errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối hoặc API server.";
        }
        alert(`Đăng ký thất bại: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ textSizeAdjust: "100%" }}>
      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <img src={Logo} className="w-27 h-27 mx-auto pb-4" alt="Logo" />

          <div className="flex space-x-4 mb-6">
            {[
              { label: "First name", name: "firstName", type: "text", id: "firstNameInput" },
              { label: "Last name", name: "lastName", type: "text", id: "lastNameInput" },
            ].map(({ label, name, type, id }) => (
              <div className="w-1/2" key={name}>
                <InputField
                  label={label}
                  type={type}
                  id={id}
                  name={name}
                  value={formData[name]}
                  onChange={handleInputChange}
                  placeholder={`Enter your ${label.toLowerCase()}`}
                  error={isSubmitted && errors[name]}
                />
                {isSubmitted && errors[name] && (
                  <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
                )}
              </div>
            ))}
            <div className="w-1/2 flex justify-center items-center">
              <label htmlFor="avatarInput" className="sr-only">
                Upload avatar
              </label>
              <Button
                type="button"
                className="w-24 h-24 rounded-full border-2 border-gray-300 flex items-center justify-center"
                onClick={() => document.getElementById("avatarInput").click()}
              >
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Avatar Preview"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-3xl">+</span>
                )}
              </Button>
              <input
                type="file"
                id="avatarInput"
                name="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              {isSubmitted && errors.avatar && (
                <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>
              )}
            </div>
          </div>

          {[
            { label: "Phone number", name: "phoneNumber", type: "tel", id: "phoneNumberInput" },
            { label: "Email address", name: "email", type: "email", id: "emailInput" },
            { label: "CCCD", name: "cccd", type: "text", id: "cccdInput" },
            { label: "Mật khẩu", name: "password", type: "password", id: "passwordInput" },
          ].map(({ label, name, type, id }) => (
            <div className="relative" key={name}>
              <InputField
                label={label}
                type={name === "password" && showPassword ? "text" : type}
                id={id}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                placeholder={`Enter your ${label.toLowerCase()}`}
                error={isSubmitted && errors[name]}
                autoComplete={
                  name === "email" ? "email" : name === "password" ? "new-password" : undefined
                }
              >
                {name === "password" && (
                  <Button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </Button>
                )}
              </InputField>
              {isSubmitted && errors[name] && (
                <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
              )}
            </div>
          ))}

          <div className="mb-4">
            <label htmlFor="maVaiTroInput" className="block mb-1 font-semibold text-gray-700">
              Vai trò
            </label>
            <select
              id="maVaiTroInput"
              name="maVaiTro"
              value={formData.maVaiTro}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={1}>Admin</option>
              <option value={2}>Nhân viên</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className={`w-full mx-auto bg-indigo-600 text-white py-3 px-4 rounded-lg ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
            } transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
          >
            {isLoading ? "Submitting..." : "Sign Up"}
          </Button>

          <p className="text-center text-indigo-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>

      <div className="flex-1 hidden md:block">
        <img src={HotelImage} alt="Hotel" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default SignUpScreen;