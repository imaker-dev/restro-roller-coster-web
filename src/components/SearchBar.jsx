import React, { useState, useCallback } from "react";
import { debounce } from "lodash";
import { Search, X } from "lucide-react";

const SearchBar = ({
  placeholder = "search...",
  onSearch,
  className = "",
  width = "w-full",
  debounceTime = 1000, // default debounce time
}) => {
  const [searchValue, setSearchValue] = useState("");

  // Debounce the onSearch function
  const debouncedSearch = useCallback(
    debounce((value) => {
      onSearch(value);
    }, debounceTime),
    [onSearch, debounceTime]
  );

  // Handle manual form submit
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  const handleSearchValueChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchValue("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSearch} className={`relative ${width}`}>
      <input
        id="form-search"
        autoComplete="off"
        className={`${className}  block w-full form-input pl-9 pr-6 py-2 `}
        placeholder={placeholder}
        value={searchValue}
        onChange={handleSearchValueChange}
      />
      {searchValue && (
        <button
          type="button"
          className="absolute inset-y-0 right-2 flex items-center"
          onClick={clearSearch}
          aria-label="Clear Search"
        >
          <X className="w-4 h-4 text-slate-400 hover:text-slate-500" />
        </button>
      )}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-slate-400" />
      </div>
    </form>
  );
};

export default SearchBar;
