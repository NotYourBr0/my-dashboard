import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import BlogDetails from "./pages/BlogDetails";
import Interviews from "./pages/Interviews";
import InterviewDetails from "./pages/InterviewDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AllServices from "./pages/AllServices";

// Import the ServiceDetails component from src/pages/
import ServiceDetails from "./pages/ServiceDetails"; // <<< ONLY ADDITION

import { AuthContext } from "./context/AuthContext";

function App() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // Simulate loading (you can replace this with real auth loading check)
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 800); // simulate short load
  }, []);

 if (loading) {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <style>
        {`
        .pacman-spinner {
          display: flex;
          align-items: center;
          gap: 20px;
          position: relative;
        }

        .pacman {
          width: 60px;
          height: 60px;
          background: #f8e131;
          border-radius: 50%;
          clip-path: polygon(0% 0%, 100% 0%, 100% 30%, 30% 50%, 100% 70%, 100% 100%, 0% 100%);
          animation: chomping 0.5s infinite;
          position: relative;
        }

        .pacman-eye {
          position: absolute;
          top: 12px;
          left: 35px;
          width: 6px;
          height: 6px;
          background: #000;
          border-radius: 50%;
          z-index: 10;
        }

        @keyframes chomping {
          0%, 100% {
            clip-path: polygon(0% 0%, 100% 0%, 100% 30%, 30% 50%, 100% 70%, 100% 100%, 0% 100%);
          }
          50% {
            clip-path: polygon(0% 0%, 100% 0%, 100% 50%, 100% 50%, 100% 50%, 100% 100%, 0% 100%);
          }
        }

        .dot-container {
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
        }

        .dot {
          width: 10px;
          height: 10px;
          background-color: #f8e131;
          border-radius: 50%;
          animation: move-dot 1.2s infinite linear;
        }

        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.15s; }
        .dot:nth-child(3) { animation-delay: 0.3s; }
        .dot:nth-child(4) { animation-delay: 0.45s; }
        .dot:nth-child(5) { animation-delay: 0.6s; }

        @keyframes move-dot {
          0% { opacity: 0; transform: translateX(0); }
          10% { opacity: 1; }
          100% { opacity: 0; transform: translateX(-70px); }
        }
        `}
      </style>

      <div className="pacman-spinner">
        <div className="pacman">
          <div className="pacman-eye"></div>
        </div>
        <div className="dot-container">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
}

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="bg-secondary min-h-screen flex flex-col">
      {!isAuthPage && <Navbar />}

      <main className={!isAuthPage ? "pt-24" : ""}>
        <Routes>
          {/* Only for unauthenticated users */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />

          {/* Protected routes */}
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/blogs" element={user ? <Blogs /> : <Navigate to="/login" />} />
          <Route path="/blogs/:id" element={user ? <BlogDetails /> : <Navigate to="/login" />} />
          <Route path="/interviews" element={user ? <Interviews /> : <Navigate to="/login" />} />
          <Route path="/interviews/:id" element={user ? <InterviewDetails /> : <Navigate to="/login" />} />
          <Route path="/allservices" element={<AllServices />} />
          {/* NEW: Route for Service Details */}
          <Route path="/services/:id" element={user ? <ServiceDetails /> : <Navigate to="/login" />} /> {/* <<< NEW LINE */}

          {/* Fallback for any other unmatched routes */}
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;
