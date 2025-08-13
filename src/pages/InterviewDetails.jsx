import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import parse from 'html-react-parser'; // Import the parser

const baseURL = import.meta.env.VITE_API_URL; // Ensure baseURL is defined here

export default function InterviewDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        // Use baseURL for the API call
        const res = await fetch(`${baseURL}/api/interviews/${id}`);
        if (!res.ok) throw new Error("Interview not found");
        const data = await res.json();

        const mappedData = {
          _id: data._id,
          name: data.Name,
          position: data.Position,
          company: data.CompanyName,
          // Use baseURL for the image path
          image: `${baseURL}/uploads/interviews/${data.Image}`,
          description: data.Description, // Keep the raw HTML for now
          companyURL: data.CompanyURL
        };
        setInterview(mappedData);
      } catch (err) {
        setInterview(null);
        console.error("Failed to fetch interview details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [id]);

  if (loading) {
    return (
       <div className="h-screen flex items-center justify-center bg-gray-100">
        <style>
          {`
          @keyframes pulse-main {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.2);
              opacity: 0.7;
            }
          }
          @keyframes pulse-alt {
            0%, 100% {
              transform: scale(0.9);
              opacity: 0.5;
            }
            50% {
              transform: scale(1.1);
              opacity: 1;
            }
          }
          @keyframes rotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          .spinner-container {
            position: relative;
            width: 80px;
            height: 80px;
            animation: rotate 2s linear infinite;
          }
          .spinner-inner {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
          .spinner-main {
            border: 6px solid #4a90e2; /* Blue color */
            animation: pulse-main 2s infinite ease-in-out;
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          }
          .spinner-alt {
            border: 6px solid #50e3c2; /* Cyan color */
            animation: pulse-alt 2s infinite ease-in-out;
            animation-delay: -1s; /* Start with a delay */
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          }
          `}
        </style>
        <div className="spinner-container">
          <div className="spinner-inner spinner-main"></div>
          <div className="spinner-inner spinner-alt"></div>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50 p-6 animate-fade-in-up">
        <div className="bg-white rounded-xl shadow-lg p-10 text-center transform scale-95 animate-scale-in">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Oops! Interview Not Found
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            The interview details you are looking for do not exist or have been moved.
          </p>
          <button
            onClick={() => navigate("/interviews")}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105"
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
            <span>Back to All Interviews</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-100 py-1 px-2 sm:px-6 lg:px-3 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full transform scale-95 animate-scale-in-up">
        <div className="relative py-10 px-14 flex items-center justify-center bg-gray-50 border">
          <img
            src={interview.image}
            alt={interview.name}
            className="w-full h-70 sm:h-full object-fill object-center border "
          />
          
        </div>

        <div className="p-6 sm:p-8 md:p-10 space-y-6">
          <h1 className="text-gray-800 font-bold text-4xl" >
            {interview.name}
          </h1>
          
          {/* This is the key change: using parse() */}
          <div className="text-gray-800 text-lg leading-relaxed description-content">
            <span className="font-bold text-black">Description :</span>{" "}
            {parse(interview.description)}
          </div>
          {/* Add some basic styling to make lists and paragraphs look better */}
          <style jsx>{`
            .description-content ul {
              list-style: disc;
              margin-left: 1.5em;
              padding-left: 0;
            }
            .description-content li {
              margin-bottom: 0.5em;
            }
            .description-content p {
              margin-bottom: 1em; /* Add some spacing between paragraphs */
            }
            .description-content div {
                display: inline; /* To prevent new lines for every div */
            }
          `}</style>
          <p className="text-gray-800 text-lg">
            <span className="font-semibold text-black">Position :</span>{" "}
            <span className="bg-gray-100 text-black px-3 py-1 rounded-full text-base font-normal">
              {interview.position}
            </span>
          </p>
          <p className="text-gray-800 text-lg">
            <span className="font-semibold text-black">Company Name :</span>{" "}
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-base font-normal">
              {interview.company}
            </span>
          </p>
          {interview.companyURL && (
            <p className="text-gray-800 text-lg">
              <span className="font-semibold text-black">Company URL :</span>{" "}
              <a href={interview.companyURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {interview.companyURL}
              </a>
            </p>
          )}

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
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
            <span>Back to Interviews</span>
          </button>
        </div>
      </div>
    </div>
  );
}
