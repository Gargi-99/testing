// src/components/Search.jsx
import React, { useState } from 'react';

const Search = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (event) => {
        setQuery(event.target.value);
        onSearch(event.target.value);
    };

    return (
        <input
            type="text"
            className="form-control"
            placeholder="Search tasks..."
            value={query}
            onChange={handleInputChange}
        />
    );
};

export default Search;
