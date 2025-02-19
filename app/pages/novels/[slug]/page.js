'use client'
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const NovelDetail = () => {
  const params = useParams();
  const slug = params.slug;
  const [novel, setNovel] = useState([]);

  // Fetch data based on slug
  useEffect(() => {
    if (slug) {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/public/novels/${slug}`);
          if (!response.ok) {
            throw new Error('Failed to fetch novel details');
          }
          const data = await response.json();
          setNovel(data.novel); // Assuming the API returns a single novel object
          console.log(data)
        } catch (error) {
          console.error('Error fetching novel details:', error);
        }
      };

      fetchData();
    }
  }, [slug]);

  if (!novel) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Thumbnail */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={novel.thumbnail}
            alt={novel.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{novel.title}</h1>
          <p className="text-gray-600 text-sm mb-6 line-clamp-3">{novel.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Updated: {new Date(novel.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovelDetail;