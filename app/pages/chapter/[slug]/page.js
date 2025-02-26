'use client';
import Header from '@/app/Components/Header';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

const ChapterReader = () => {
  const params = useParams();
  const chapterSlug = params.slug; // Slug dari URL
  const [chapter, setChapter] = useState(null);
  const [pagination, setPagination] = useState(null);
  const CHAPTER_URL = `http://127.0.0.1:8000/api/public/chapters/${chapterSlug}`;
  const heroSectionRef = useRef(null);

  // Fetch data for the chapter
  useEffect(() => {
    if (chapterSlug) {
      const fetchChapter = async () => {
        try {
          const response = await fetch(CHAPTER_URL);
          if (!response.ok) {
            throw new Error('Failed to fetch chapter details');
          }
          const data = await response.json();
          setChapter(data.chapter); // Assuming the API returns a single chapter object
          setPagination(data.pagination); // Assuming the API returns a single chapter object
        } catch (error) {
          console.error('Error fetching chapter details:', error);
        }
      };
      fetchChapter();
    }
  }, [chapterSlug]);

  // Parallax Effect with Ref
  useEffect(() => {
    const handleScroll = () => {
      if (heroSectionRef.current) {
        const scrollY = window.scrollY;
        heroSectionRef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!chapter) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      {/* Hero Section */}
      <section
        ref={heroSectionRef}
        className="relative h-[150px] sm:h-[200px] md:h-[200px] overflow-hidden"
      >
        {/* Background Image with Overlay */}
        <img
          src={chapter.image || chapter.novel.thumbnail} // Use default image if no thumbnail is available
          alt={chapter.title}
          className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>

        {/* Content in Hero Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 flex flex-col items-center text-center">
          <h3 className="text-sm sm:text-lg text-white line-clamp-2">CHAPTER {chapter.order}</h3>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white line-clamp-2">{chapter.title}</h1>
          <p className="text-gray-300 text-xs sm:text-sm mt-2">
            Updated: {new Date(chapter.updated_at).toLocaleDateString()}
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <div className="container mx-auto px-4 sm:px-6 py-8 bg-white rounded-lg shadow-md absolute left-0 right-0">
        {/* Novel Details Section */}
        <div className="mb-8 bg-white rounded-2xl shadow-sm p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">About the Novel</h3>
          <div className="grid grid-cols-[1fr_3fr] gap-4">
            {/* Thumbnail */}
            <div className="w-full sm:w-32 md:w-48 relative rounded-lg overflow-hidden">
              <img
                src={chapter.novel.thumbnail}
                alt={chapter.novel.title}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>

            {/* Novel Information */}
            <div className="flex-1">
              <Link href={`/pages/novels/${chapter.novel.slug}`}>
                <h4 className="text-lg sm:text-lg font-bold text-gray-900 line-clamp-2">{chapter.novel.title}</h4>
              </Link>
              <p className="text-gray-600 text-md sm:text-sm mt-2">
                By {chapter.novel.contributor?.user?.name || 'Unknown Author'}
              </p>
              <p className="text-gray-700 mt-2 text-xs sm:text-sm line-clamp-3">{chapter.novel.description}</p>
              <div className="mt-2 flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-500 text-xs sm:text-sm">
                  Updated: {new Date(chapter.novel.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter Content */}
        <div className="prose max-w-full text-gray-700">
          <div dangerouslySetInnerHTML={{ __html: chapter.content }}></div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between mt-8 space-y-4 sm:space-y-0">
          {/* Previous Chapter Button */}
          {pagination?.prev ? (
            <Link
              href={`/pages/chapter/${pagination.prev.slug}`}
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-center"
            >
              Previous Chapter
            </Link>
          ) : (
            <span className="text-gray-500 text-center">No previous chapter</span>
          )}

          {/* Next Chapter Button */}
          {pagination?.next ? (
            <Link
              href={`/pages/chapter/${pagination.next.slug}`}
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-center"
            >
              Next Chapter
            </Link>
          ) : (
            <span className="text-gray-500 text-center">No next chapter</span>
          )}
        </div>
      </div>
    </>
  );
};

export default ChapterReader;