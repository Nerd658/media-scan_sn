import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function AnalysisDetails() {
  const { statType } = useParams();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);

      // Map URL param to a more readable title
      const titleMap = {
        'total-analyses': 'Total des Analyses',
        'contenus-toxiques': 'Contenus Toxiques',
        'contenu-sensible': 'Contenu Sensible',
        'sentiment-positif': 'Sentiment Positif',
      };
      setTitle(titleMap[statType] || statType);

      if (statType === 'total-analyses' || statType === 'sentiment-positif') {
        setError('Les données détaillées pour cette catégorie ne sont pas encore disponibles.');
        setAnalyses([]);
        setLoading(false);
        return;
      }

      try {
        let apiUrl = 'http://localhost:8000/api/v1/dashboard/alerts/sensitive';
        if (statType === 'contenus-toxiques') {
          apiUrl += '?category=toxic';
        } else if (statType === 'contenu-sensible') {
          // For 'contenu-sensible', we fetch all sensitive alerts
          // No specific category filter needed, as the endpoint returns all sensitive alerts by default if no category is specified
        }

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch sensitive alerts data from API');
        }
        let data = await response.json();

        // Map the data to the structure expected by the table
        const mappedData = data.map(item => ({
          id: item.comment_id,
          text: item.comment_text,
          category: item.true_category, // Use category instead of sentiment
          source: item.media_page,
          date: new Date().toISOString(), // Placeholder date if not available from API
          url: item.post_link || '#', // Assuming post_link might be available or default to '#'
          score: item.model_score,
        }));

        setAnalyses(mappedData);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [statType]);

  if (loading) {
    return <div className="text-center text-gray-500 dark:text-gray-400 py-10">Chargement des analyses...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white mb-4">
        Détails : {title}
      </h1>
      
      {error && <p className="text-center text-yellow-500 dark:text-yellow-400 mb-6">{error}</p>}

      {/* Analyses Table */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Analyses ({analyses.length})</h2>
        {analyses.length === 0 && !error ? (
          <p className="text-gray-500 dark:text-gray-400">Aucune analyse trouvée pour cette catégorie.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                    Texte du Commentaire
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Catégorie
                  </th>
                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Score
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Média
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Voir</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-800">
                {analyses.map((analysis) => (
                  <tr key={analysis.id}>
                    <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6 max-w-md truncate">
                      {analysis.text}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {analysis.category}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {analysis.score.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {analysis.source}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <a href={analysis.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                        Voir le post
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
