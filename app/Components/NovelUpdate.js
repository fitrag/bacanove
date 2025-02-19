'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const NovelUpdate = () => {
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/public/novels');
        if (!response.ok) {
          throw new Error('Failed to fetch novels');
        }
        const data = await response.json();
        setNovels(data.novels); // Access the "novels" array from the response
      } catch (err) {
        setError(err.message); // Set error message
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Latest Novel Updates
      </h1>

      {/* Loading State */}
      {loading && (
        <p className="text-center text-gray-600 col-span-full">Loading...</p>
      )}

      {/* Error State */}
      {error && (
        <p className="text-center text-red-600 col-span-full">
          Error: {error}
        </p>
      )}

      {/* Display Novels */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {novels.length > 0 ? (
            novels.map((novel) => (
              <div
                key={novel.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={novel.thumbnail}
                    alt={novel.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {novel.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {novel.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Updated: {new Date(novel.updated_at).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/pages/novels/${novel.slug}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">
              No novels available at the moment.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default NovelUpdate;