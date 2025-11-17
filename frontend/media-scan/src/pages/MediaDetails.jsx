import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ThemeBarChart from "../components/charts/ThemeBarChart";

export default function MediaDetails() {
  const { mediaName } = useParams();
  const decodedMediaName = decodeURIComponent(mediaName);

  const [mediaData, setMediaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/v1/dashboard/media/${decodedMediaName}`);

        if (!response.ok) {
          throw new Error('Failed to fetch media details data from API');
        }

        const data = await response.json();
        setMediaData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaDetails();
  }, [decodedMediaName]);

  if (loading) {
    return <div className="text-center py-10">Chargement des détails du média...</div>;
  }

  if (error || !mediaData) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold text-red-500">Erreur</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          {error || `Le média "${decodedMediaName}" n'a pas été trouvé.`}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">{mediaData.name}</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Détails et analyses pour ce média.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Informations Générales</h3>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200 dark:sm:divide-gray-700">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                {mediaData.description}
              </dd>
            </div>
            {Object.entries(mediaData.scores).map(([scoreName, scoreValue]) => (
              <div key={scoreName} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{scoreName}</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {scoreValue}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* SentimentPieChart is removed as per-media sentiment data is not in the new data source */}
        <ThemeBarChart data={mediaData.themes} />
      </div>

      {/* Articles list is removed as the data is not available in the root JSON files */}
    </div>
  );
}
