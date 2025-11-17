import { useState, useEffect } from "react";
import { mediaDetails as mockMediaDetails } from "../data/mediaDetails";
import SentimentPieChart from "../components/charts/SentimentPieChart";
import ThemeBarChart from "../components/charts/ThemeBarChart";

export default function MediaComparison() {
  const mediaNames = Object.keys(mockMediaDetails); // Use mock data for initial media names
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [mediaToCompare, setMediaToCompare] = useState([]);

  useEffect(() => {
    // Simulate fetching data based on selected media
    if (selectedMedia.length === 0) {
      setMediaToCompare([]);
      return;
    }
    setMediaToCompare(selectedMedia.map(name => mockMediaDetails[name]));
  }, [selectedMedia]);

  const handleMediaSelection = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedMedia((prev) => [...prev, value]);
    } else {
      setSelectedMedia((prev) => prev.filter((media) => media !== value));
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">Comparaison de Médias</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Comparez les performances et les analyses de différents médias.
        </p>
      </div>

      {/* Media Selection */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Sélectionnez les médias à comparer :</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaNames.map((name) => (
            <div key={name} className="flex items-center">
              <input
                id={`checkbox-${name}`}
                name="media-selection"
                type="checkbox"
                value={name}
                checked={selectedMedia.includes(name)}
                onChange={handleMediaSelection}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor={`checkbox-${name}`} className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                {name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Display */}
      {mediaToCompare.length === 0 && selectedMedia.length > 0 && (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          Aucune donnée de comparaison disponible pour les médias sélectionnés.
        </div>
      )}
      {mediaToCompare.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {mediaToCompare.map((media) => (
            <div key={media.name} className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{media.name}</h2>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 mb-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Articles Analysés</dt>
                  <dd className="mt-1 text-lg text-gray-900 dark:text-white">{media.total_articles}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Score d'Influence</dt>
                  <dd className="mt-1 text-lg text-gray-900 dark:text-white">{media.score_influence}</dd>
                </div>
              </dl>

              <div className="grid grid-cols-1 gap-4">
                <SentimentPieChart data={media.repartition_sentiments} />
                <ThemeBarChart data={media.repartition_themes} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
