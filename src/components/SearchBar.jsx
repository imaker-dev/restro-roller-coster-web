import React, { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { Search, X } from "lucide-react";

const SearchBar = ({
  placeholder = "Search...",
  onSearch,
  className = "",
  width = "w-full",
  debounceTime = 500,
  value = "", // NEW PROP
}) => {
  const [searchValue, setSearchValue] = useState(value);

  // Sync external value changes
  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => {
      onSearch?.(value);
    }, debounceTime),
    [onSearch, debounceTime]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Manual submit
  const handleSearch = (e) => {
    e.preventDefault();

    debouncedSearch.cancel(); // prevent duplicate calls
    onSearch?.(searchValue);
  };

  const handleSearchValueChange = (e) => {
    const value = e.target.value;

    setSearchValue(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    debouncedSearch.cancel();

    setSearchValue("");
    onSearch?.("");
  };

  return (
    <form onSubmit={handleSearch} className={`relative ${width}`}>
      <input
        id="form-search"
        type="text"
        autoComplete="off"
        className={`${className} block w-full form-input pl-9 pr-8 py-2`}
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