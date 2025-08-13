import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import parse from 'html-react-parser'; // Import the HTML parser

const baseURL = import.meta.env.VITE_API_URL; // Ensure baseURL is defined here

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        // Use baseURL for the API call
        const res = await fetch(`${baseURL}/api/blogs/${id}`);
        if (!res.ok) throw new Error("Blog not found");
        const data = await res.json();
        setBlog(data); // `data` should now contain `text`, `description`, `image`, `category` (populated object), `tags` (populated array)
      } catch (err) {
        setBlog(null);
        console.error("Failed to fetch blog details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
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

  if (!blog) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50 p-6 animate-fade-in-up">
        <div className="bg-white rounded-xl shadow-lg p-10 text-center transform scale-95 animate-scale-in">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Oops! Blog Not Found
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            The blog post you are looking for does not exist or has been moved.
          </p>
          <button
            onClick={() => navigate("/blogs")}
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
            <span>Back to All Blogs</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-100 py-1 px-2 sm:px-6 lg:px-8 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-8xl w-full transform scale-95 animate-scale-in-up">
        {/* Blog Image */}
        <div className="relative py-10 px-14 flex items-center justify-center bg-gray-50 border">
          <img
            
            src={blog.image}
            alt={blog.text} 
            className="w-full h-70 sm:h-full object-fill object-center border"
          />
          
        </div>

        
        <div className="p-6 sm:p-8 md:p-10 space-y-6">
        <h1 className=" text-3xl sm:text-4xl lg:text-3xl font-semibold text-black leading-tight drop-shadow-lg">
            {blog.text} 
          </h1>
          {blog.category && (
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-700">
              Category: {blog.category.name}
            </h2>
          )}
          {blog.tags && blog.tags.length > 0 && (
              <p className="text-gray-600 text-base">
                  Tags: {blog.tags.map(tag => tag.name).join(', ')}
              </p>
          )}

          {/* This is the key change: using parse() for the description */}
          <div className="text-gray-800 text-lg leading-relaxed blog-description-content">
            {parse(blog.description)}
          </div>
          {/* Add some basic styling to make lists, paragraphs, etc., within the parsed HTML look better */}
          <style jsx>{`
            .blog-description-content p {
              margin-bottom: 1em; /* Add space between paragraphs */
            }
            .blog-description-content ul {
              list-style: disc;
              margin-left: 1.5em;
              padding-left: 0;
            }
            .blog-description-content ol {
              list-style: decimal;
              margin-left: 1.5em;
              padding-left: 0;
            }
            .blog-description-content li {
              margin-bottom: 0.5em;
            }
            .blog-description-content strong {
                font-weight: bold;
            }
            .blog-description-content em {
                font-style: italic;
            }
            /* You may need to add more styles based on the specific HTML tags in your descriptions */
          `}</style>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
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
            <span>Back to Blogs</span>
          </button>
        </div>
      </div>
    </div>
  );
}
