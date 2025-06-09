import React from "react";

const UserCard = ({
  image = "https://randomuser.me/api/portraits/lego/1.jpg",
  name = "Tên người dùng",
  info = "Chức vụ hoặc mô tả ngắn",
  onEdit = () => alert("Chỉnh sửa người dùng"),
  onDelete = () => alert("Xoá người dùng"),
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "16px",
        maxWidth: "500px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
    >
      {/* Ảnh bên trái */}
      <img
        src={image}
        alt={name}
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "12px",
          objectFit: "cover",
          marginRight: "20px",
        }}
      />

      {/* Nội dung bên phải */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ margin: 0 }}>{name}</h3>
          <p style={{ margin: "4px 0", color: "#555" }}>{info}</p>
        </div>

        {/* Nút ở dưới */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
          <button onClick={onEdit} style={buttonStyle("#007BFF")}>Chỉnh sửa</button>
          <button onClick={onDelete} style={buttonStyle("#DC3545")}>Xoá</button>
        </div>
      </div>
    </div>
  );
};

const buttonStyle = (bg) => ({
  padding: "8px 12px",
  backgroundColor: bg,
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
});

export default UserCard;
