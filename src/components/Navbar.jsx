import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const baseURL = import.meta.env.VITE_API_URL; // Declare baseURL here

// Custom hook for debouncing a value
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to cancel the timeout if value or delay changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const resourcesDropdownRef = useRef(null);
  const { user, logout } = useContext(AuthContext);

  // Debounce the search query to prevent excessive URL updates
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Effect to sync the search bar with the URL's search parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search") || "";
    setSearchQuery(query);
  }, [location.search]);

  // New effect to handle live search functionality
  useEffect(() => {
    // Get the current base path
    let currentPath = location.pathname;
    if (currentPath.includes('/interviews')) {
      currentPath = '/interviews';
    } else if (currentPath.includes('/blogs')) {
      currentPath = '/blogs';
    } else {
      currentPath = '/';
    }

    if (debouncedSearchQuery.trim()) {
      // If there is a debounced query, update the URL
      navigate(`${currentPath}?search=${encodeURIComponent(debouncedSearchQuery.trim())}`, { replace: true });
    } else if (location.search) {
      // If the query is empty but the URL has a search param, remove it
      navigate(currentPath, { replace: true });
    }
  }, [debouncedSearchQuery, location.pathname, navigate]);

  // Effect to close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close profile dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      // Close resources dropdown
      if (resourcesDropdownRef.current && !resourcesDropdownRef.current.contains(event.target)) {
        setIsResourcesDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Corrected handleLogout function ---
  const handleLogout = (event) => {
      // Stop the click event from bubbling up to the document
      event.stopPropagation();
      logout();
      navigate("/login");
      // Also close the profile dropdown when logging out
      setIsProfileDropdownOpen(false); 
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleResourcesDropdown = () => {
    setIsResourcesDropdownOpen(prevState => !prevState);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // New handler to close both the mobile menu and the resources dropdown
  const closeMobileMenus = useCallback(() => {
    setIsMobileMenuOpen(false);
    setIsResourcesDropdownOpen(false);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-lg px-6 py-6 flex justify-between items-center transition-all duration-300 ease-in-out z-50 ">
      {/* Logo Image */}
      <Link to="/">
        <img src={'/dash2.png'} alt="Dashboard Logo" className="h-12 w-44 " />
      </Link>
      {/* Navigation Links - Desktop */}
      <ul className="hidden md:flex space-x-8 text-black text-l">
        <li>
          <Link
            to="/"
            className="hover:text-blue-500 transition-colors duration-200 ease-in-out relative group"
          >
            Home
          </Link>
        </li>
        {/* Resources Dropdown Menu - Desktop */}
        <li
          className="relative"
          ref={resourcesDropdownRef}
        >
          <div
            className="hover:text-blue-500 transition-colors duration-200 ease-in-out relative group flex  items-center gap-1 cursor-pointer"
            onClick={toggleResourcesDropdown} // Click handler for desktop dropdown
          >
            Resources
            <svg
              className={`w-4 h-4 transform transition-transform duration-300 ${isResourcesDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
          <div
            className={`absolute left-0 top-full mt-2 bg-white rounded-lg shadow-xl p-2 w-48 transition-opacity duration-200 z-10 ${
              isResourcesDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          >
            <Link
              to="/interviews"
              onClick={() => setIsResourcesDropdownOpen(false)} // Close dropdown on click
              className="block px-4 py-2 text-gray-800 hover:bg-blue-100 rounded-lg transition-colors duration-200"
            >
              Interviews
            </Link>
            <Link
              to="/allservices"
              onClick={() => setIsResourcesDropdownOpen(false)} // Close dropdown on click
              className="block px-4 py-2 text-gray-800 hover:bg-blue-100 rounded-lg transition-colors duration-200"
            >
              More Services...
            </Link>
          </div>
        </li>
        <li>
          <Link
            to="/blogs"
            className="hover:text-blue-500 transition-colors duration-200 ease-in-out relative group"
          >
            Blogs
          </Link>
        </li>
      </ul>

      {/* Search and Sign In/User Profile - Desktop */}
      <div className="hidden md:flex items-center space-x-4">
        {/* The form has been replaced with a div for live search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="border-2 border-grey px-4 py-2 rounded-full pl-10 text-gray-800 outline-none focus:ring-2 focus:ring-blue-600"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {/* Search icon */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 p-0 m-0 border-none bg-transparent cursor-pointer">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>
        {user ? (
          <div className="relative text-center" ref={dropdownRef}>
            <div
              className="bg-blue-200 text-black font-bold w-10 h-10 flex items-center justify-center rounded-full cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105"
              onClick={toggleProfileDropdown}
            >
              {user.name[0]}
            </div>
            <div
              className={`absolute right-0 mt-2 bg-white shadow-2xl rounded-lg p-4 w-40 transition-opacity duration-200 z-20 ${
                isProfileDropdownOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <p className="font-semibold text-blue-600">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <button onMouseDown={handleLogout} onClick={handleLogout} className="mt-3 w-fit bg-white text-black border py-1 px-2 rounded hover:bg-blue-50 ">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 items-center">
            <Link
              to="/login"
              className="bg-white text-black px-3 py-2 rounded-lg font-semibold border hover:bg-blue-50"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-white text-black px-3 py-2 rounded-lg font-semibold border hover:bg-blue-50 "
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-black focus:outline-none transition-transform duration-300 ease-in-out transform hover:scale-110 active:scale-90">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-blue-700 p-6 transform ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden flex flex-col items-start space-y-6 shadow-xl`}
      >
        <button onClick={() => setIsMobileMenuOpen(false)} className="text-white self-end focus:outline-none transition-transform duration-300 ease-in-out transform hover:scale-110 active:scale-90">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <ul className="flex flex-col space-y-4 text-white text-xl font-medium w-full">
          <li>
            <Link
              to="/"
              onClick={closeMobileMenus} // Close all mobile menus on click
              className="block py-2 hover:text-blue-200 transition-colors duration-200 ease-in-out"
            >
              Home
            </Link>
          </li>
          {/* Resources Dropdown Menu - Mobile */}
          <li>
            <div className="flex items-center justify-between cursor-pointer py-2">
              <span onClick={toggleResourcesDropdown} className="hover:text-blue-200 transition-colors duration-200 ease-in-out">
                Resources
              </span>
              <button onClick={toggleResourcesDropdown} className="p-1">
                <svg
                  className={`w-4 h-4 transform transition-transform duration-300 ${isResourcesDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                  fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${isResourcesDropdownOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <ul className="pl-4 space-y-2 text-sm">
                <li>
                  <Link
                    to="/interviews"
                    onClick={closeMobileMenus} // Close all mobile menus on click
                    className="block py-2 hover:text-blue-200 transition-colors duration-200"
                  >
                    Interviews
                  </Link>
                </li>
                <li>
                  <Link
                    to="/allservices"
                    onClick={closeMobileMenus} // Close all mobile menus on click
                    className="block py-2 hover:text-blue-200 transition-colors duration-200"
                  >
                    More Services...
                  </Link>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <Link
              to="/blogs"
              onClick={closeMobileMenus} // Close all mobile menus on click
              className="block py-2 hover:text-blue-200 transition-colors duration-200 ease-in-out"
            >
              Blogs
            </Link>
          </li>
        </ul>
        <div className="w-full mt-6">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="border-2 border-blue-400 focus:border-blue-200 px-4 py-2 rounded-full pl-10 text-gray-800 outline-none w-full focus:ring-2 focus:ring-blue-300 transition-all duration-300 ease-in-out"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 p-0 m-0 border-none bg-transparent cursor-pointer">
              <svg
                className="w-5 h-5 "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <div
                className="bg-white text-blue-700 font-bold w-10 h-10 flex items-center justify-center rounded-full cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105"
                onClick={toggleProfileDropdown}
              >
                {user.name[0]}
              </div>
              <div
                className={`absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-4 w-56 transition-opacity duration-200 z-20 ${
                  isProfileDropdownOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <button onClick={handleLogout} onMouseDown={handleLogout} className="mt-3 w-full bg-red-500 text-white py-1 rounded hover:bg-red-400 transition-colors duration-200 ease-in-out transform hover:scale-105 active:scale-95">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 w-full">
              <Link
                to="/login"
                onClick={closeMobileMenus} // Close all mobile menus on click
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-300 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md text-center"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={closeMobileMenus} // Close all mobile menus on click
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-2 rounded-full font-semibold shadow-md text-center"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
