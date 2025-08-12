import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../context/AuthContext';
const baseURL = import.meta.env.VITE_API_URL;

// This is the final updated Home component.
// It fetches a limited number of services and displays a maximum of
// two services per category.
export default function Home() {
  const [services, setServices] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [blogs, setBlogs] = useState([]); // NEW: State for blogs
  const [filteredCategories, setFilteredCategories] = useState({});
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState(null);
  const servicesSectionRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
    // --- NEW: State for the Review Modal ---
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  // --- FIX: Access user AND loading state from AuthContext
  const { user, loading: authLoading } = useContext(AuthContext);
console.log("User from context:", user);
console.log("BASE URL:", import.meta.env.VITE_API_URL);



  
  // Helper function to group services by category
  const groupServicesByCategory = (servicesToGroup) => {
    return servicesToGroup.reduce((acc, service) => {
      const categoryName = service.category;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(service);
      return acc;
    }, {});
  };

  // Effect to fetch services (with a limit of 12), FAQs, and blogs.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get("search") || "";
        
        // Fetch all data concurrently, using baseURL for all endpoints
        const [servicesRes, faqsRes, blogsRes] = await Promise.all([
          fetch(`${baseURL}/api/services/paginated?limit=12&search=${encodeURIComponent(searchQuery)}`),
          fetch(`${baseURL}/api/faqs`),
          fetch(`${baseURL}/api/blogs`), // NEW: Fetch blogs
        ]);

        if (!servicesRes.ok || !faqsRes.ok || !blogsRes.ok) {
          throw new Error('Failed to fetch data from one or more endpoints.');
        }

        const servicesData = await servicesRes.json();
        const faqsData = await faqsRes.json();
        const blogsData = await blogsRes.json(); // NEW: Parse blogs data
        
        setServices(servicesData.services);
        setFaqs(faqsData);
        setBlogs(blogsData); // NEW: Set blogs state

        if (searchQuery && servicesSectionRef.current) {
          servicesSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        toast.error('Failed to load data!');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.search]);

  // Effect to group the fetched services by category and filter FAQs.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");

    setLocalSearchQuery(searchQuery || '');
    
    // Group the services that were returned from the API call.
    const grouped = groupServicesByCategory(services);
    setFilteredCategories(grouped);

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const faqsToRender = faqs.filter(
        (faq) =>
          faq.question?.toLowerCase().includes(lowercasedQuery) ||
          faq.answer?.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredFaqs(faqsToRender);
    } else {
      setFilteredFaqs(faqs);
    }
  }, [services, faqs, location.search]);


  // Handler for the local search input
  const handleLocalSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchQuery(value);

    if (value.trim() === '') {
      navigate('/');
    }
  };

  // Handler for the "Find" button
  const handleSearchSubmit = () => {
    if (localSearchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(localSearchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  // Handler for "Enter" key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  // New handler for FAQ card clicks
  const handleFaqClick = (faqId) => {
    // If the clicked FAQ is already expanded, close it. Otherwise, open the new one.
    setExpandedFaqId(expandedFaqId === faqId ? null : faqId);
  };

  // --- NEW: Review Modal Handlers ---
  const handleRatingSelect = (emoji, status) => {
    setRating(status);
    setSelectedEmoji(emoji);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (loading) return;

   if (authLoading) {
  toast.info("Checking login status... please wait.");
  return;
}

if (!user || !user.id) {
  toast.error("Please login to submit a review.");
  return;
}

    
    if (!rating) {
      toast.error("Please select a rating before submitting.");
      return;
    }
    
    const reviewData = {
      user: user.id, 
      userName: user.name,
      rating,
      feedback,
    };

    try {
      // Use baseURL for the review submission endpoint
      const response = await fetch(`${baseURL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // If your backend requires an authorization token, you'll need to add it here.
          // For example: 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      toast.success('Thank you for your review!');
      setIsReviewModalOpen(false);
      setRating(null);
      setFeedback('');
      setSelectedEmoji(null);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.message || 'Failed to submit review. Please try again.');
    }
  };

  // Split the FAQs into two columns for stable layout
  const half = Math.ceil(filteredFaqs.length / 2);
  const leftColumnFaqs = filteredFaqs.slice(0, half);
  const rightColumnFaqs = filteredFaqs.slice(half);

  return (
    <div className="min-h-screen animate-fade-in over">
      <div className="max-w-7xl mx-auto">
        <style>
          {`
            // Custom CSS for the infinite scroll loop
            @keyframes scroll-loop {
              0% {
                transform: translateX(0%);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            .scroll-container {
              display: flex;
              animation: scroll-loop 60s linear infinite;
            }
            .scroll-item {
              flex-shrink: 0;
              margin-right: 1.5rem;
            }
          `}
        </style>

        {/* FirmsFinder - Find Top Digital Marketing IT Companies Section */}
        <section className="bg-blue-700 text-white py-16 px-4 sm:px-6 lg:px-8 text-center shadow-lg mb-12 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Find Top Digital Marketing IT Companies</h1>
          <p className="text-lg sm:text-xl opacity-90 mb-8">Discover and Compare the best AI and IT service providers worldwide</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <input
              type="text"
              placeholder="Search for categories and services..."
              className="px-6 py-3 rounded-lg w-full sm:w-96 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={localSearchQuery}
              onChange={handleLocalSearchChange}
              onKeyDown={handleKeyDown}
            />
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors duration-300"
              onClick={handleSearchSubmit}
            >
              Find
            </button>
          </div>
        </section>

        {/* Browse Services by Category Section - NOW DYNAMIC */}
        <section
          ref={servicesSectionRef}
          className="mb-12 animate-fade-in-up px-4 sm:px-6 lg:px-8"
          style={{ animationDelay: '0.2s' }}
        >
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Browse Services by Category</h2>
          {loading && <p className="text-center text-gray-600">Loading categories...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && !error && Object.keys(filteredCategories).length === 0 && (
            <p className="text-center text-2xl font-semibold text-gray-600">No services found for your search.</p>
          )}
          {!loading && !error && Object.keys(filteredCategories).length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(filteredCategories).map(([categoryName, servicesInGroup]) => (
                <div
                  key={categoryName}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="mr-2">&lt;</span>{categoryName}<span className="ml-2">&gt;</span>
                  </h3>
                  <ul className="text-gray-600 space-y-2">
                    {servicesInGroup.slice(0, 2).map((service, index) => (
                      <li key={service._id || index}>
                        <Link to={`/services/${service._id}`} className="text-blue-600 hover:underline hover:text-blue-800 transition-colors duration-200">
                          {service.serviceName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
  <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Our Latest Insights</h2>

  {/* Scroll container wrapper with overflow hidden */}
  {/* FIX: Changed 'overflow-hidden' to 'overflow-x-auto' to enable manual horizontal scrolling */}
  <div className="overflow-x-auto relative p-4 group scrollbar-hide">
    {loading && <p className="text-center text-gray-600">Loading blog posts...</p>}
    {error && <p className="text-center text-red-500">Failed to load blog posts.</p>}

    {!loading && !error && blogs.length > 0 && (
      <div className="scroll-track flex w-[200%] animate-scroll-x group-hover:pause-animation">
        {new Array(blogs.length * 2).fill(null).map((_, index) => {
          const blog = blogs[index % blogs.length];
          return (
            <div key={`${blog._id}-${index}`} className="scroll-item w-64 mr-4 shrink-0">
              <Link 
                to={`/blogs/${blog._id}`} 
                className="block bg-green-50 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <img 
                  src={blog.image} 
                  alt={blog.text} 
                  className="w-full h-40 object-cover rounded-t-xl"
                  onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x300/e0e0e0/555555?text=Blog+Image"; }}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{blog.text}</h3>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    )}
  </div>
</section>
        {/* Help others by sharing your experience */}
        <section className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center justify-between mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="md:w-1/2 text-center md:text-left mb-6 md:mb-0">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Help others by sharing your experience</h3>
            <p className="text-gray-600 text-lg mb-6">Your review can guide businesses in making informed choices. Be part of 60,000+ reviewers and share your insights.</p>
            <button 
              onClick={() => setIsReviewModalOpen(true)}
              // Use the authLoading state to disable the button
              disabled={authLoading} 
              className={`text-white px-8 py-3 rounded-lg font-semibold shadow-md transition-colors duration-300 ${
                authLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              Write a Review
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="./comp.png" 
              alt="Computer Monitor" 
              className="max-w-full h-auto" 
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x300/e0e0e0/555555?text=Image+Not+Found"; }}
            />
          </div>
        </section>

        {/* Frequently Asked Questions (FAQs) Section */}
        <section className="mb-12 animate-fade-in-up px-4 sm:px-6 lg:px-8" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Frequently Asked Questions (FAQs)</h2>
          {loading && <p className="text-center text-gray-600">Loading FAQs...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && !error && filteredFaqs.length === 0 && (
            <p className="text-center text-2xl font-semibold text-gray-600">No FAQs found for your search.</p>
          )}
          {!loading && !error && filteredFaqs.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="flex flex-col gap-6">
                {leftColumnFaqs.map((faq) => (
                  <div
                    key={faq._id}
                    className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300"
                    onClick={() => handleFaqClick(faq._id)}
                  >
                    <div className="flex justify-between items-center font-semibold text-gray-800">
                      {faq.question}
                      <span 
                        className={`transform transition-transform duration-300 ${expandedFaqId === faq._id ? 'rotate-180' : ''}`}
                      >
                        &#9660;
                      </span>
                    </div>
                    {expandedFaqId === faq._id && (
                      <p className="text-gray-600 mt-2 animate-fade-in">{faq.answer}</p>
                    )}
                  </div>
                ))}
              </div>
              {/* Right Column */}
              <div className="flex flex-col gap-6">
                {rightColumnFaqs.map((faq) => (
                  <div
                    key={faq._id}
                    className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300"
                    onClick={() => handleFaqClick(faq._id)} 
                  >
                    <div className="flex justify-between items-center font-semibold text-gray-800">
                      {faq.question}
                      <span 
                        className={`transform transition-transform duration-300 ${expandedFaqId === faq._id ? 'rotate-180' : ''}`}
                      >
                        &#9660;
                      </span>
                    </div>
                    {expandedFaqId === faq._id && (
                      <p className="text-gray-600 mt-2 animate-fade-in">{faq.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

      </div>
      {/* --- NEW: Review Modal JSX --- */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-30">
          <div className="relative bg-white rounded-lg shadow-xl p-8 max-w-lg w-full h-4/5 mt-24 animate-fade-in-up ">
            <h3 className="text-2xl font-bold text-gray-800 mb-1 text-center">Write a Review</h3>
            <button onClick={() => setIsReviewModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">&times;</button>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-6">
                <p className="font-semibold text-gray-700 mb-3">How was your experience?</p>
                <div className="flex justify-around items-center">
                  {[
                    { emoji: '😠', status: 'Bad' },
                    { emoji: '😐', status: 'Neutral' },
                    { emoji: '🙂', status: 'Good' },
                    { emoji: '😍', status: 'Excellent' }
                  ].map((item) => (
                    <div 
                      key={item.status} 
                      className={`flex flex-col items-center cursor-pointer transition-transform duration-200 transform hover:scale-110 ${selectedEmoji === item.emoji ? 'scale-110' : ''}`}
                      onClick={() => handleRatingSelect(item.emoji, item.status)}
                    >
                      <span className={`text-4xl p-2 rounded-full ${selectedEmoji === item.emoji ? 'bg-blue-200' : 'bg-transparent'}`}>{item.emoji}</span>
                      <span className="text-gray-600 text-sm mt-1">{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold " htmlFor="feedback">Your Feedback (Optional)</label>
                <textarea
                  id="feedback"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your thoughts..."
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
