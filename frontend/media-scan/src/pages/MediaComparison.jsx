import { useState, useEffect } from "react";
import ComparisonTable from "../components/ComparisonTable";
import ComparisonBarChart from "../components/charts/ComparisonBarChart";

export default function MediaComparison() {
  const [allMediaNames, setAllMediaNames] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [mediaToCompare, setMediaToCompare] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all available media names initially
  useEffect(() => {
    const fetchAllMediaNames = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/dashboard/influence-ranking');
        if (!response.ok) {
          throw new Error('Failed to fetch media names');
        }
        const data = await response.json();
        setAllMediaNames(data.map(media => media.media));
      } catch (err) {
        console.error("Error fetching all media names:", err);
        setError("Impossible de charger la liste des médias.");
      }
    };
    fetchAllMediaNames();
  }, []);

  // Fetch details for selected media
  useEffect(() => {
    const fetchMediaToCompare = async () => {
      if (selectedMedia.length === 0) {
        setMediaToCompare([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        selectedMedia.forEach(name => queryParams.append('media_names', name));
        
        const response = await fetch(`http://localhost:8000/api/v1/dashboard/media/compare?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch comparison data');
        }
        const data = await response.json();
        setMediaToCompare(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching media to compare:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaToCompare();
  }, [selectedMedia]);

  const handleMediaSelection = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedMedia((prev) => [...prev, value]);
    } else {
      setSelectedMedia((prev) => prev.filter((media) => media !== value));
    }
  };

  if (loading && selectedMedia.length > 0) {
    return <div className="text-center py-10">Chargement des données de comparaison...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Erreur: {error}</div>;
  }

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
          {allMediaNames.map((name) => (
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
      {mediaToCompare.length > 0 ? (
        <div className="space-y-8">
          <ComparisonTable mediaToCompare={mediaToCompare} />
          <ComparisonBarChart mediaToCompare={mediaToCompare} />
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          Veuillez sélectionner au moins un média pour voir la comparaison.
        </div>
      )}
    </div>
  );
}
