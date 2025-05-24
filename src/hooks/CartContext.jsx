import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [room, setRoom] = useState(null);
  const [hotel, setHotel] = useState(null);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        selectedServices,
        setSelectedServices,
        room,
        setRoom,
        hotel,
        setHotel,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};