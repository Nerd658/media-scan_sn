import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function AllMedia() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/influence_ranking.json');
        if (!response.ok) {
          throw new Error('Failed to fetch media data');
        }
        const data = await response.json();
        setMediaList(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Chargement des médias...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Erreur: {error}</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">Tous les Médias</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Liste de toutes les sources de médias collectées, classées par score d'influence.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mediaList.map((media) => (
          <NavLink
            key={media.media}
            to={`/media/${encodeURIComponent(media.media)}`}
            className="col-span-1 flex flex-col divide-y divide-gray-200 dark:divide-gray-700 rounded-lg bg-white dark:bg-gray-800 text-center shadow transition-transform transform hover:scale-105"
          >
            <div className="flex flex-1 flex-col p-8">
              <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">{media.media}</h3>
              <dl className="mt-1 flex flex-grow flex-col justify-between">
                {/* Description is omitted as it's not in the new data source */}
                <dd className="mt-3">
                  <span className="rounded-full bg-green-100 dark:bg-green-900 px-2 py-1 text-xs font-medium text-green-800 dark:text-green-200">
                    Score: {media.score_influence_total.toFixed(2)}
                  </span>
                </dd>
              </dl>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
