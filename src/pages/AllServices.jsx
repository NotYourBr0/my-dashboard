import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const baseURL = import.meta.env.VITE_API_URL; // Ensure baseURL is defined here

export default function AllServices() {
  // State to hold the full, unsorted list of services from the API
  const [allServices, setAllServices] = useState([]);
  // State to hold the globally sorted list of services
  const [sortedServices, setSortedServices] = useState([]);
  // State to hold the services for the current page
  const [displayedServices, setDisplayedServices] = useState([]);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const limit = 6;

  // Effect to fetch all services from the API
  useEffect(() => {
    const fetchAllServices = async () => {
      try {
        // Fetch a large number of services to get the complete list
        // Using baseURL for the API call
        const res = await fetch(
          `${baseURL}/api/services/paginated?limit=1000&search=${searchQuery}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await res.json();
        setAllServices(data.services);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchAllServices();
  }, [searchQuery]); // Re-fetch all services if the search query changes

  // Effect to sort all services when they are fetched
  useEffect(() => {
    const getCharType = (char) => {
      if (!char) return 3; // Put items with no name at the end
      if (/[0-9]/.test(char)) return 2; // Numbers
      if (/[a-zA-Z]/.test(char)) return 3; // Alphabets
      return 1; // Symbols and all other characters
    };

    const servicesCopy = [...allServices];
    
    // Sort the entire list of services
    servicesCopy.sort((a, b) => {
      const charA = a.serviceName ? a.serviceName[0] : '';
      const charB = b.serviceName ? b.serviceName[0] : '';
      
      const typeA = getCharType(charA);
      const typeB = getCharType(charB);

      if (typeA !== typeB) {
        return typeA - typeB;
      }
      
      if (a.serviceName && b.serviceName) {
        return a.serviceName.localeCompare(b.serviceName);
      }
      
      return 0;
    });

    setSortedServices(servicesCopy);
    setTotalPages(Math.ceil(servicesCopy.length / limit));
  }, [allServices]); // Run this effect whenever allServices changes

  // Effect to handle client-side pagination
  useEffect(() => {
    // Calculate the start and end index for the current page
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Slice the globally sorted array to get the services for the current page
    setDisplayedServices(sortedServices.slice(startIndex, endIndex));
  }, [sortedServices, page, limit]); // Run this whenever sortedServices or the page changes

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to the first page for a new search
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header and Search Bar */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          Discover Our Services
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Browse trusted solutions tailored to your business needs.
        </p>
        <div className="max-w-xl mx-auto relative">
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full py-3 pl-12 pr-4 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
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

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto">
        {displayedServices.length === 0 && (
          <p className="text-center text-lg text-gray-500">
            No services found.
          </p>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayedServices.map((service) => (
            <Link
              to={`/services/${service._id}`}
              key={service._id}
              className="block"
            >
              <div
                className="bg-white rounded-lg shadow-md border hover:shadow-lg hover:border-blue-500 transition duration-300 p-6 flex items-center cursor-pointer"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                  {service.serviceName ? service.serviceName[0].toUpperCase() : ''}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {service.serviceName}
                  </h3>
                  <p className="text-sm text-gray-500">{service.category}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2"
            >
              Prev
            </button>
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-4 py-2 rounded-lg text-gray-800 font-bold transition-colors border-2 ${
                  page === pageNum ? "bg-blue-600 text-white" : "hover:bg-gray-200"
                }`}
              >
                {pageNum}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
