import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_API_URL; // Declare baseURL here

// Helper function to strip HTML tags from a string
const stripHtmlTags = (htmlString) => {
  if (!htmlString) return "";
  const doc = new DOMParser().parseFromString(htmlString, 'text/html');
  return doc.body.textContent || "";
};

export default function Interview() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredInterviews, setFilteredInterviews] = useState([]); // New state for filtered interviews
  const navigate = useNavigate();
  const location = useLocation(); // Hook to access the URL's search query

  // Effect to fetch the data initially
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        // Use baseURL for the API call
        const res = await fetch(`${baseURL}/api/interviews`);
        const data = await res.json();

        const mappedData = data.map((item) => {
          let formattedInterviewDate = item.Date || "Not available";
          if (formattedInterviewDate.includes('-') && formattedInterviewDate.split('-').length === 3) {
            const [y, m, d] = formattedInterviewDate.split('-');
            formattedInterviewDate = `${d}/${m}/${y}`;
          }

          return {
            _id: item._id,
            name: item.Name,
            position: item.Position,
            company: item.CompanyName,
            // Use baseURL for the image path
            image: `${baseURL}/uploads/interviews/${item.Image}`,
            description: stripHtmlTags(item.Description),
            companyURL: item.CompanyURL,
            interviewDate: formattedInterviewDate,
          };
        });

        setInterviews(mappedData);
      } catch (err) {
        console.error("Failed to fetch interviews:", err);
        setInterviews([]); // Ensure interviews is an empty array on error
      } finally {
        setLoading(false); // Set loading to false after fetch attempt
      }
    };

    fetchInterviews();
  }, []);

  // New useEffect to handle filtering when the search query or interviews data changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      // Filter the interviews based on the search query
      const filtered = interviews.filter((interview) => {
        return (
          interview.name.toLowerCase().includes(lowercasedQuery) ||
          interview.position.toLowerCase().includes(lowercasedQuery) ||
          interview.company.toLowerCase().includes(lowercasedQuery) ||
          interview.description.toLowerCase().includes(lowercasedQuery)
        );
      });
      setFilteredInterviews(filtered);
    } else {
      // If there's no search query, show all interviews
      setFilteredInterviews(interviews);
    }
  }, [interviews, location.search]);

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

  // Use filteredInterviews instead of interviews for rendering
  return (
    <div className="max-w-7xl mx-auto bg-white min-h-screen">
      <div className="bg-blue-50 px-6 py-12">
        <h1 className="text-4xl font-bold text-black ">Interview Insights</h1>
        <p className="pt-4">Discover valuable perspectives from industry experts.</p>
      </div>
      {filteredInterviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-l shadow-lg animate-fade-in">
          <p className="text-2xl font-semibold text-gray-600 mb-4">No interviews found.</p>
          <p className="text-md text-gray-500">Check back later for new interview experiences!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-7 animate-fade-in">
          {filteredInterviews.map((interview, index) => (
            <div
              key={interview._id}
              className={`bg-white rounded shadow-md overflow-hidden flex flex-col border
                                       transition-all duration-300 ease-in-out transform
                                       hover:scale-[1.02] hover:shadow-lg
                                       animate-fadeInUp`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="h-56 w-full px-4 pt-4 overflow-hidden relative">
                <img
                  src={interview.image}
                  alt={interview.name}
                  className="object-contain w-full h-full rounded-lg"
                />
                {/* Position Overlay */}
                <div className="absolute top-6 left-6 bg-black bg-opacity-75 text-white text-sm font-semibold py-1 px-3 rounded-lg">
                  {interview.position}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                  {interview.name}
                </h2>

                {/* Company URL as hyperlink */}
                <a
                  href={interview.companyURL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 underline mb-2"
                >
                  {interview.company}
                </a>

                {/* Description - Now HTML tags are stripped */}
                <p className="text-sm text-gray-700 mb-4 flex-grow">
                  {interview.description.length > 200
                    ? `${interview.description.slice(0, 200)}...`
                    : interview.description}
                </p>

                {/* Full Interview Button */}
                <div className="mt-auto text-right">
                  <Link
                    to={`/interviews/${interview._id}`}
                    className="inline-block px-4 py-2 bg-black text-white text-sm font-semibold rounded hover:bg-blue-900 transition-colors duration-200"
                  >
                    Full Interview
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
