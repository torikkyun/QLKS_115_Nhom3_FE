import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBox = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setQuery(''); 
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-5xl max-h-50 mx-auto bg-white rounded-full shadow-lg p-2 flex items-center gap-2 transition-all mb-15 duration-300 hover:shadow-xl animate__animated animate__fadeIn"
      aria-label="Search rooms"
    >
      <div className="relative flex-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm phòng, số phòng..."
          className="w-full bg-transparent pl-10 pr-4 py-2.5 text-gray-800 rounded-full focus:outline-none focus:ring-0 placeholder-gray-400 text-sm font-medium"
          required
          aria-label="Room search input"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 transition-colors duration-200 group-hover:text-blue-500" />
      </div>
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium py-2 px-4 rounded-full transition-all duration-300 flex items-center gap-1 hover:shadow-md"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
        Tìm
      </button>
    </form>
  );
};

export default SearchBox;