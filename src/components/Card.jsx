import { Link } from "react-router-dom";
// Helper to strip HTML tags for clean preview
const stripHtmlTags = (htmlString) => {
  if (!htmlString) return "";
  const doc = new DOMParser().parseFromString(htmlString, 'text/html');
  return doc.body.textContent || "";
};

export default function Card({ title, image, link, desc, category }) {
  const cleanDescription = stripHtmlTags(desc || "");
  const preview = cleanDescription.length > 100 ? cleanDescription.slice(0, 100) + "..." : cleanDescription;

  return (
    <div className="bg-white rounded shadow-md overflow-hidden flex flex-col border max-w-sm mx-auto">
      {/* Image */}
     <div className="h-56 w-full px-4 pt-4 overflow-hidden">
        <img
          src={image}
          alt={title || "Blog image"}
          className="object-cover w-full h-full rounded-t-lg border-b"
        />
       
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          {title}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-700 mb-2">
          {preview}
        </p>

        {/* Category */}
        {category && (
          <span class="bg-blue-100 w-fit text-blue-600 text-xs px-2 py-1 rounded-full mb-3">
            Category: {category}
          </span>
        )}

        {/* Full-width Read More Button */}
        <Link
          to={link}
          className="block w-full text-center px-4 py-2 bg-black text-white text-sm font-semibold rounded-md hover:bg-gray-800 transition"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}
