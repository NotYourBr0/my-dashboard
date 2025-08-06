import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast

const baseURL = import.meta.env.VITE_API_URL; // Declare baseURL here

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use baseURL for the API call
      const res = await fetch(`${baseURL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        
        toast.success('Login successful!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        window.location.reload()
        navigate('/');
      } else {
        toast.error(data.message || 'Login failed.', { // Added fallback message
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (err) {
      console.error('Login failed:', err.message);
      toast.error('Something went wrong. Please try again later.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4 sm:p-6 lg:p-8"> {/* Changed background to light blue */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 sm:p-8 animate-fade-in-up"> {/* Removed hover:scale, kept animate-fade-in-up */}
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-gray-800 tracking-tight">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition duration-200 ease-in-out placeholder-gray-500" // Simplified input transitions
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition duration-200 ease-in-out placeholder-gray-500" // Simplified input transitions
          />
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 ease-in-out flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2" // Simplified button transitions and color
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-blue-600 hover:text-blue-800 font-medium transition duration-200" // Consistent blue link
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
