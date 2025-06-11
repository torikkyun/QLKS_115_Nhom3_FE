import React from 'react';
import { Link } from 'react-router-dom'; // Sử dụng react-router-dom để điều hướng (nếu bạn dùng routing)

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <h2 className="text-4xl font-semibold text-gray-600 mt-4">Page Not Found</h2>
        <p className="text-lg text-gray-500 mt-2">
          Oops! The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <p className="mt-4">
          <Link
            to="/user/home"
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            Go back to homepage
          </Link>
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;