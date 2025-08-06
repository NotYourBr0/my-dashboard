import { useState, useEffect } from 'react';
import Card from '../components/Card';
import { FaPlus } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
const baseURL = import.meta.env.VITE_API_URL;
export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state
  const navigate = useNavigate();
  const location = useLocation();

  // Effect to fetch the data initially
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
         const res = await fetch(`${baseURL}/api/blogs`);
        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setBlogs([]); // Ensure blogs is an empty array on error
      } finally {
        setLoading(false); // Set loading to false after fetch is complete
      }
    };

    fetchBlogs();
  }, []);

  // New useEffect to handle filtering when the search query or blogs data changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      // Filter the blogs based on the search query
      const filtered = blogs.filter((blog) => {
        return (
          blog.text.toLowerCase().includes(lowercasedQuery) ||
          blog.description.toLowerCase().includes(lowercasedQuery) ||
          (blog.category && blog.category.name.toLowerCase().includes(lowercasedQuery))
        );
      });
      setFilteredBlogs(filtered);
    } else {
      // If there's no search query, show all blogs
      setFilteredBlogs(blogs);
    }
  }, [blogs, location.search]);

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

  return (
    <div className=" max-w-7xl mx-auto bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-blue-50 px-6 py-12">
        <h1 className="text-4xl font-bold text-black ">
          Blog Posts
        </h1>
        <p className="pt-4">A hub for the latest business trends and insights.</p>
      </div>

      {/* Conditional Rendering for Blogs */}
      {filteredBlogs.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center justify-center bg-white rounded-xl shadow-lg mt-10 animate-scale-in">
          <p className="text-2xl font-semibold text-gray-600 mb-4">
            No blog posts found.
          </p>
          <p className="text-md text-gray-500 mb-6">
            Check back later for exciting new content!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-7">
          {filteredBlogs.map((blog, index) => (
            <div
              key={blog._id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card
                title={blog.text}
                image={blog.image}
                link={`/blogs/${blog._id}`}
                desc={blog.description.slice(0, 50) + '...'}
                category={blog.category?.name}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
