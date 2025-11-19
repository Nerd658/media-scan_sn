import React, { useState, useEffect, useMemo } from 'react';

const POSTS_PER_PAGE = 20;

export default function AllPosts() {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // State for filters
  const [mediaFilter, setMediaFilter] = useState('Tous');
  const [themeFilter, setThemeFilter] = useState('Tous');

  // State for filter options
  const [mediaOptions, setMediaOptions] = useState([]);
  const [themeOptions, setThemeOptions] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/all_posts_classified.json');
        if (!response.ok) {
          throw new Error('Failed to fetch posts data');
        }
        const data = await response.json();
        setAllPosts(data);

        // Extract unique media and themes for filter dropdowns
        const uniqueMedia = ['Tous', ...new Set(data.map(post => post.media))];
        const uniqueThemes = ['Tous', ...new Set(data.map(post => post.theme))];
        setMediaOptions(uniqueMedia);
        setThemeOptions(uniqueThemes);

        setError(null);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Apply filters
  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      const mediaMatch = mediaFilter === 'Tous' || post.media === mediaFilter;
      const themeMatch = themeFilter === 'Tous' || post.theme === themeFilter;
      return mediaMatch && themeMatch;
    });
  }, [allPosts, mediaFilter, themeFilter]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [mediaFilter, themeFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Chargement des articles...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Erreur: {error}</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">Tous les Articles</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Liste de tous les articles scrapés et analysés.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-x-6">
        {/* Filter by Media */}
        <div className="flex items-center gap-x-2">
          <label htmlFor="mediaFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Média :
          </label>
          <select
            id="mediaFilter"
            name="mediaFilter"
            className="block w-auto rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={mediaFilter}
            onChange={(e) => setMediaFilter(e.target.value)}
          >
            {mediaOptions.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        {/* Filter by Theme */}
        <div className="flex items-center gap-x-2">
          <label htmlFor="themeFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Thème :
          </label>
          <select
            id="themeFilter"
            name="themeFilter"
            className="block w-auto rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={themeFilter}
            onChange={(e) => setThemeFilter(e.target.value)}
          >
            {themeOptions.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
          {currentPosts.length > 0 ? (
            currentPosts.map((post, index) => (
              <li key={startIndex + index} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                    {post.media} - <span className="text-gray-500">{post.theme}</span>
                  </p>
                  <div className="ml-2 flex flex-shrink-0">
                    <p className="inline-flex rounded-full bg-gray-100 dark:bg-gray-700 px-2 text-xs font-semibold leading-5 text-gray-800 dark:text-gray-200">
                      {new Date(post.post_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {post.preview}
                  </p>
                </div>
                <div className="mt-2 flex justify-between">
                  <div className="flex space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Likes: <span className="font-medium">{post.like_count}</span></span>
                    <span>Partages: <span className="font-medium">{post.share_count}</span></span>
                    <span>Commentaires: <span className="font-medium">{post.comments_count}</span></span>
                  </div>
                  {post.url && (
                    <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      Voir le post
                    </a>
                  )}
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-4 sm:px-6 text-center text-gray-500 dark:text-gray-400">
              Aucun article trouvé pour les filtres sélectionnés.
            </li>
          )}
        </ul>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Précédent
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} sur {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
