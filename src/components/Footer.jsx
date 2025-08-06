// src/components/Footer.jsx
import { Link } from "react-router-dom"; 

export default function Footer() {
  const headingClass = "relative inline-block text-2xl font-bold text-white mb-4 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-1/3 after:bg-white";

  return (
    <footer className="bg-black text-white p-8 mt-16 relative overflow-hidden">
      {/* Background shape/overlay for visual interest */}
      <div className="absolute top-0 left-0 w-full h-full bg-blue-950 opacity-10 blur-3xl rounded-full transform scale-150 -translate-y-1/2 -translate-x-1/2 animate-pulse-slow"></div>

      {/* Large background text */}
      <div className="absolute inset-0 flex items-center justify-center text-white text-9xl font-extrabold opacity-10 z-0 pointer-events-none font-serif">
        Kartik Swami
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 text-center md:text-left">
          {/* Personal Info / About Section (Column 1) */}
          <div className="space-y-3">
            <h3 className={headingClass}>Kartik Swami</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              A passionate and dedicated Computer Science student with a strong interest in programming and problem-solving. Embraces modern technologies and Generative Al tools to boost productivity, creativity, and efficiency. Motivated by innovation and explores real-world problem-solving through code, Al, and machine learning.
            </p>
          </div>
          
          {/* Links & Contact Section (Column 2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Quick Links */}
            <div className="space-y-3">
              <h3 className={headingClass.replace('text-2xl', 'text-xl')}>Links</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/blogs" className="hover:text-white transition-colors">Blogs</Link></li>
                <li><Link to="/interviews" className="hover:text-white transition-colors">Interviews</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
              </ul>
            </div>
            
            {/* Contact Details */}
            <div className="space-y-3">
              <h3 className={headingClass.replace('text-2xl', 'text-xl')}>Contact</h3>
              <p className="text-sm text-gray-300">Jaipur, Rajasthan, India</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-300 flex items-center justify-center md:justify-start">
                  <svg className="w-4 h-4 mr-2 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.89 3.76 5.21 6.65 6.65l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.46.57 3.57.12.35.03.75-.24 1.02l-2.2 2.2z" />
                  </svg>
                  +91-6378019172
                </p>
                <p className="text-sm text-gray-300 flex items-center justify-center md:justify-start">
                  <svg className="w-4 h-4 mr-2 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  ks806425@gmail.com
                </p>
              </div>
            </div>
          </div>

          {/* Social Media Section (Column 3) */}
          <div className="space-y-3">
            <h3 className={headingClass}>Follow Me</h3>
            <div className="flex justify-center md:justify-start space-x-4 mt-4">
              <a href="https://github.com/NotYourBr0" className="bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors" aria-label="GitHub">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="w-6 h-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M512 0C229.25 0 0 229.25 0 512c0 226.25 146.625 418.125 350.25 485.625 25.625 4.75 34.875-11.125 34.875-24.375 0-12.25-.5-52.625-.75-98-142.5 30.75-172.75-61.5-172.75-61.5-23.25-59-56.75-74.875-56.75-74.875-46.75-31.75 3.5-31.125 3.5-31.125 51.5 3.625 78.625 52.75 78.625 52.75 45.625 78.5 119.75 55.625 149 42.5 4.75-33 17.875-55.625 32.75-68.25-113.5-12.75-232.75-56.75-232.75-252.875 0-55.75 19.875-101.375 52.625-137.25-5.25-12.75-23-64.875 5-135.25 0 0 43-13.75 140.75 52.375 40.875-11.375 84-17.125 128-17.375 44 .25 87.125 6 128 17.375 97.625-66.125 140.625-52.375 140.625-52.375 28.125 70.375 10.375 122.5-4.875 135.25 32.75 35.875 52.625 81.5 52.625 137.25 0 196.25-119.25 240-233.125 252.875 18.25 15.75 34.625 46.5 34.625 94.625 0 68.25-.625 123.25-.625 140.125 0 13.25 9.125 29.25 35.125 24.375C877.375 930.125 1024 738.25 1024 512 1024 229.25 794.75 0 512 0z"></path></svg>
              </a>
              <a href="https://linkedin.com/in/kartik--swami" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-500 transition-colors" aria-label="LinkedIn">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-3v-9h3v9zm-1.5-10.324c-.927 0-1.676-.749-1.676-1.676s.749-1.676 1.676-1.676 1.676.749 1.676 1.676-.749 1.676-1.676 1.676zm11.5 10.324h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-9h3v1.765c1.396-2.586 7-2.777 7 2.476v4.759z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Separator Line */}
        <hr className="border-t border-gray-700 my-10" />

        {/* Copyright */}
        <div className="flex justify-between items-center text-gray-500 text-xs">
          <p>© 2025 Kartik Swami. All rights reserved.</p>
          <a href="#" aria-label="Back to top" className="bg-white text-black p-2 rounded-full hover:bg-gray-400 transition-colors flex items-center justify-center">
            Back to top
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-5 transform " viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a.75.75 0 01-.75-.75V3.627L5.605 7.478a.75.75 0 01-1.06-1.06L9.44 2.44a.75.75 0 011.12 0l4.905 4.02a.75.75 0 01-1.06 1.06L10.75 3.627V17.25a.75.75 0 01-.75.75z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}