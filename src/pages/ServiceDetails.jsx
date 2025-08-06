import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import parse from 'html-react-parser'; // To parse HTML description from TinyMCE

const baseURL = import.meta.env.VITE_API_URL; // Declare baseURL here

export default function ServiceDetails() {
  const { id } = useParams(); // Get the service ID from the URL
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        // Use baseURL for the API call
        const res = await fetch(`${baseURL}/api/services/${id}`);
        if (!res.ok) {
          // If response is not ok, it might be a 404 or other error
          const errorData = await res.json();
          throw new Error(errorData.message || "Service not found");
        }
        const data = await res.json();
        setService(data);
      } catch (err) {
        setService(null);
        setError(err.message || "Failed to fetch service details.");
        console.error("Error fetching service details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]); // Re-fetch if the service ID changes in the URL

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Loading service details...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50 p-6 animate-fade-in-up">
        <div className="bg-white rounded-xl shadow-lg p-10 text-center transform scale-95 animate-scale-in">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Oops! Service Not Found
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            {error || "The service you are looking for does not exist or has been moved."}
          </p>
          <button
            onClick={() => navigate(-1)} // Changed to navigate(-1) for flexibility
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 mx-auto"
          >
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            <span>Back to Services</span> {/* Changed text to be more general */}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-100 py-1 px-2 sm:px-6 lg:px-8 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-8xl w-full transform scale-95 animate-scale-in-up">
        {/* Service Image */}
        <div className="relative py-10 px-14 flex items-center justify-center bg-gray-50 border">
          {/* Corrected image source path to use baseURL */}
          <img
            src={`${baseURL}/uploads/services/${service.image}`}
            alt={service.serviceName} 
            className="w-full h-70 sm:h-full object-fill object-center border"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x400/e0e0e0/555555?text=Image+Not+Found"; }}
          />
        </div>

        <div className="p-6 sm:p-8 md:p-10 space-y-6">
          <h1 className="text-3xl sm:text-4xl lg:text-3xl font-semibold text-black leading-tight drop-shadow-lg">
            {service.serviceName} 
          </h1>
          {service.category && (
            <div className="flex">
              <p className="text-xl sm:text-2xl font-semibold text-black">
                Category︰</p> 
              <p className="text-xl sm:text-2xl font-semibold text-blue-700">{service.category}
              </p>
            </div>
          )}
          
          {/* Using parse() for the description */}
          {/* ADDED TAILWIND CLASS: overflow-x-auto and max-w-full */}
          <div className="text-gray-800 text-lg leading-relaxed service-description-content overflow-x-auto max-w-full">
            {parse(service.description)}
          </div>
          
          {/* Basic styling for parsed HTML content - consider moving to a CSS file */}
          <style jsx>{`
            .service-description-content p {
              margin-bottom: 1em;
              word-wrap: break-word; /* Ensure long words break */
            }
            .service-description-content ul {
              list-style: disc;
              margin-left: 1.5em;
              padding-left: 0;
            }
            .service-description-content ol {
              list-style: decimal;
              margin-left: 1.5em;
              padding-left: 0;
            }
            .service-description-content li {
              margin-bottom: 0.5em;
              word-wrap: break-word; /* Ensure long words break */
            }
            .service-description-content strong {
                font-weight: bold;
            }
            .service-description-content em {
                font-style: italic;
            }
            /* Add this for images within the description */
            .service-description-content img {
              max-width: 100%; /* Ensure images don't overflow */
              height: auto;
              display: block; /* Remove extra space below image */
              margin: 1em 0; /* Add some vertical spacing */
            }
            /* Add this for tables within the description */
            .service-description-content table {
              width: 100% !important; /* Force table to fit container */
              table-layout: fixed; /* Helps with column sizing */
              border-collapse: collapse;
            }
            .service-description-content th,
            .service-description-content td {
              border: 1px solid #ccc;
              padding: 8px;
              text-align: left;
              word-wrap: break-word; /* Ensure text in cells breaks */
            }
          `}</style>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)} // Go back to the previous page (All Services)
            className="inline-flex items-center space-x-2 bg-black hover:bg-gray-700 text-white px-6 py-3 rounded-lg shadow-md"
          >
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            <span>Back to Services</span>
          </button>
        </div>
      </div>
    </div>
  );
}
