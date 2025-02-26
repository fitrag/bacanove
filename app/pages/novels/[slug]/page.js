'use client';
import Header from '@/app/Components/Header';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

const NovelDetail = () => {
  const params = useParams();
  const slug = params.slug;
  const [novel, setNovel] = useState(null);
  const [relatedNovels, setRelatedNovels] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [filteredChapters, setFilteredChapters] = useState([]);
  const [filterMode, setFilterMode] = useState('latest'); // 'latest' or 'oldest'
  const [showFullSynopsis, setShowFullSynopsis] = useState(false); // State to toggle synopsis
  const NOVEL_URL = `http://127.0.0.1:8000/api/public/novels/${slug}`;
  const RELATED_NOVELS_URL = `http://127.0.0.1:8000/api/public/novels/${slug}/related`;
  const CHAPTERS_URL = `http://127.0.0.1:8000/api/public/novels/${slug}/chapters`;

  // Create a ref for the hero section
  const heroSectionRef = useRef(null);

  // Fetch data for the main novel
  useEffect(() => {
    if (slug) {
      const fetchData = async () => {
        try {
          const response = await fetch(NOVEL_URL);
          if (!response.ok) {
            throw new Error('Failed to fetch novel details');
          }
          const data = await response.json();
          setNovel(data.novel); // Assuming the API returns a single novel object
        } catch (error) {
          console.error('Error fetching novel details:', error);
        }
      };
      fetchData();
    }
  }, [slug]);

  // Fetch data for related novels
  useEffect(() => {
    if (slug) {
      const fetchRelatedNovels = async () => {
        try {
          const response = await fetch(RELATED_NOVELS_URL);
          if (!response.ok) {
            throw new Error('Failed to fetch related novels');
          }
          const data = await response.json();
          setRelatedNovels(data.related_novels || []); // Ensure relatedNovels is always an array
        } catch (error) {
          console.error('Error fetching related novels:', error);
        }
      };
      fetchRelatedNovels();
    }
  }, [slug]);

  // Fetch data for chapters
  useEffect(() => {
    if (slug) {
      const fetchChapters = async () => {
        try {
          const response = await fetch(CHAPTERS_URL);
          if (!response.ok) {
            throw new Error('Failed to fetch chapters');
          }
          const data = await response.json();
          setChapters(data.chapters || []); // Ensure chapters is always an array
        } catch (error) {
          console.error('Error fetching chapters:', error);
        }
      };
      fetchChapters();
    }
  }, [slug]);

  // Filter and sort chapters based on filterMode
  useEffect(() => {
    if (chapters.length > 0) {
      const sortedChapters =
        filterMode === 'latest'
          ? [...chapters].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)) // Terbaru
          : [...chapters].sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at)); // Terlama
      setFilteredChapters(sortedChapters);
    }
  }, [chapters, filterMode]);

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

  if (!novel) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  // Function to truncate synopsis text
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <>
      <Header />
      {/* Hero Section */}
      <section
        ref={heroSectionRef} // Use ref here
        className="relative h-[500px] overflow-hidden"
        style={{ transform: 'translateY(0px)' }}
      >
        {/* Background Image with Overlay */}
        <img
          src={novel.thumbnail}
          alt={novel.title}
          className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>

        {/* Content in Hero Section */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
          {/* Thumbnail */}
          <div className="w-32 h-48 md:w-48 md:h-64 relative rounded-lg overflow-hidden shadow-lg">
            <img
              src={novel.thumbnail}
              alt={novel.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Text Content */}
          <div className="text-white space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold line-clamp-2">{novel.title}</h1>
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-gray-300 text-sm">
                By {novel.contributor?.user?.name || 'Unknown Author'}
              </span>
            </div>
            {/* Updated Date */}
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
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
              <span className="text-gray-300 text-sm">
                Updated: {new Date(novel.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-8 absolute">
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-8">
          {/* Left Column: Description and Chapters */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
            {/* Synopsis */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Synopsis</h2>
              <div
                className="text-gray-600"
                dangerouslySetInnerHTML={{
                  __html: showFullSynopsis
                    ? novel.description
                    : truncateText(novel.description, 500),
                }}
              ></div>
              {novel.description.length > 500 && (
                <button
                  onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                  className="text-blue-500 hover:underline mt-2 block text-center w-full"
                >
                  {showFullSynopsis ? 'Tutup' : 'Baca Selengkapnya'}
                </button>
              )}
            </div>

            {/* Chapters List */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Chapters</h2>

              {/* Filter Buttons */}
              <div className="flex space-x-4 mb-4">
                <button
                  onClick={() => setFilterMode('latest')}
                  className={`px-4 py-2 rounded-md ${
                    filterMode === 'latest'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } transition-colors duration-200`}
                >
                  Terbaru
                </button>
                <button
                  onClick={() => setFilterMode('oldest')}
                  className={`px-4 py-2 rounded-md ${
                    filterMode === 'oldest'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } transition-colors duration-200`}
                >
                  Terlama
                </button>
              </div>

              {/* Display Chapters */}
              {filteredChapters.length > 0 ? (
                <div className="space-y-4">
                  {filteredChapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200"
                    >
                      {/* Chapter Title */}
                      <Link href={`/pages/chapter/${chapter.slug}`}>
                      <div className="flex items-center space-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <span className="text-gray-700 text-sm font-medium">CHAPTER {chapter.order} : {chapter.title}</span>
                      </div>
                      </Link>

                      {/* Updated Date */}
                      <span className="text-gray-500 text-xs">
                        {new Date(chapter.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No chapters available.</p>
              )}
            </div>
          </div>

          {/* Right Column: Related Novels */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Related Novels</h2>
            {relatedNovels.length > 0 ? (
              <div className="space-y-4">
                {relatedNovels.map((relatedNovel) => (
                  <div key={relatedNovel.id} className="flex items-center space-x-4">
                    {/* Thumbnail */}
                    <div className="w-16 h-24 relative rounded-lg overflow-hidden">
                      <img
                        src={relatedNovel.thumbnail}
                        alt={relatedNovel.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    {/* Title */}
                    <div>
                      <Link href={`/pages/novels/${relatedNovel.slug}`}>
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                        {relatedNovel.title}
                      </h3>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No related novels found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NovelDetail;