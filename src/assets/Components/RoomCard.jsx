import React from "react";

const Item = ({ image, title, price, address }) => {
  return (
    <div
      style={{
        width: "295px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <img
        src={image}
        alt={title}
        style={{ width: "295px", height: "220px", objectFit: "cover" }}
      />
      <div style={{ padding: "12px" }}>
        <h3 style={{ margin: "0 0 8px 0", fontWeight: "bold", fontSize: "16px" }}>{title}</h3>
        <p style={{ margin: "0 0 4px 0", color: "#E53935", fontWeight: "500" }}>{price}</p>
        <p style={{ margin: 0, color: "#555", fontSize: "14px" }}>{address}</p>
      </div>
    </div>
  );
};

export default Item;