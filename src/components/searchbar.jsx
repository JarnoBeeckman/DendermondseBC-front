import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div>
      <input 
        type="text" 
        placeholder="Search..."
        value={searchQuery}
        onChange={handleInputChange} 
      />
    </div>
  );
}