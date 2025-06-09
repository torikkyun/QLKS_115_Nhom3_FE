import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        width: "100%",
        height: "455px",
        backgroundColor: "#1A1E43",
        padding: "64px 150px",
        color: "white",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Upper Div */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "40px",
        }}
      >
        {/* Column 1: Logo + Description */}
        <div>
          <h2 style={{ margin: 0 }}>QLKS</h2>
          <p style={{ marginTop: "12px", lineHeight: "1.6" }}>
            Giải pháp quản lý khách sạn thông minh, nhanh chóng và hiệu quả.
          </p>
        </div>

        {/* Column 2: Navigation Links */}
        <div>
          <h3>Liên kết</h3>
          <ul style={{ listStyle: "none", padding: 0, marginTop: "12px" }}>
            <li><a href="#" style={linkStyle}>Trang chủ</a></li>
            <li><a href="#" style={linkStyle}>Dịch vụ</a></li>
            <li><a href="#" style={linkStyle}>Giới thiệu</a></li>
            <li><a href="#" style={linkStyle}>Liên hệ</a></li>
          </ul>
        </div>

        {/* Column 3: Contact + Social */}
        <div>
          <h3>Liên hệ</h3>
          <p style={{ marginTop: "12px", lineHeight: "1.6" }}>
            📍 123 Đường ABC, Quận XYZ, TP.HCM<br />
            ✉️ contact@example.com<br />
            ☎️ 0123 456 789
          </p>

          {/* Social Icons */}
          <div style={{ marginTop: "20px", display: "flex", gap: "16px" }}>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/twitter/twitter-original.svg" alt="Twitter" style={iconStyle} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" alt="Facebook" style={iconStyle} />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" style={iconStyle} />
            </a>
          </div>
        </div>
      </div>

      {/* Lower Div */}
      <div style={{ textAlign: "center", 
        marginTop: "64px", 
        fontSize: "14px", 
        opacity: 0.7, 
        borderTop: "0.5px solid white",
        paddingTop: "20px",}}>
        © 2025 Công ty TNHH QLKS. All rights reserved.
      </div>
    </footer>
  );
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  marginBottom: "8px",
  display: "block",
};

const iconStyle = {
  width: "24px",
  height: "24px",
  backgroundColor:'white',
  borderRadius: "50%",
  padding: "4px",
};

export default Footer;
