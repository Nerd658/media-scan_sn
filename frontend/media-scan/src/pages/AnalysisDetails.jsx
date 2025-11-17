import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { mockAnalyses } from '../data/mockAnalyses';

export default function AnalysisDetails() {
  const { statType } = useParams();
  const [analyses, setAnalyses] = useState(mockAnalyses);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for filters
  const [filterSentiment, setFilterSentiment] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const filteredAnalyses = analyses.filter(analysis => {
    // Apply statType specific filters first
    if (statType === 'contenus-toxiques' && analysis.sentiment !== 'negatif') { // Assuming 'negatif' for toxic
      return false;
    }
    if (statType === 'sentiment-positif' && analysis.sentiment !== 'positif') {
      return false;
    }
    if (statType === 'contenu-sensible' && !analysis.sensitive) {
      return false;
    }
    // Apply general filters
    if (filterSentiment && analysis.sentiment !== filterSentiment) {
      return false;
    }
    if (filterSource && !analysis.source.toLowerCase().includes(filterSource.toLowerCase())) {
      return false;
    }
    if (filterStartDate && new Date(analysis.date) < new Date(filterStartDate)) {
      return false;
    }
    if (filterEndDate && new Date(analysis.date) > new Date(filterEndDate)) {
      return false;
    }
    return true;
  });

  if (loading) {
    return <div className="text-center text-gray-500 dark:text-gray-400">Chargement des analyses...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 dark:text-red-400">Erreur: {error.message}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white mb-4">
        Détails de l'analyse : {statType.replace(/-/g, ' ')}
      </h1>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 mb-6">
        Cette page affiche les analyses détaillées pour "{statType.replace(/-/g, ' ')}" et permet de les filtrer.
      </p>

      {/* Filtering Options */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Options de Filtrage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="sentiment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sentiment</label>
            <select
              id="sentiment"
              name="sentiment"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={filterSentiment}
              onChange={(e) => setFilterSentiment(e.target.value)}
            >
              <option value="">Tous</option>
              <option value="positif">Positif</option>
              <option value="negatif">Négatif</option>
              <option value="neutre">Neutre</option>
            </select>
          </div>
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Source Média</label>
            <input
              type="text"
              id="source"
              name="source"
              className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              placeholder="Ex: Le Pays"
            />
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date de début</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date de fin</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Analyses Table */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Analyses ({filteredAnalyses.length})</h2>
        {filteredAnalyses.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Aucune analyse trouvée avec les filtres actuels.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                    Texte
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Sentiment
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Source
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Date
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Voir</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-800">
                {filteredAnalyses.map((analysis) => (
                  <tr key={analysis.id}>
                    <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6 max-w-sm truncate">
                      {analysis.text}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {analysis.sentiment}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {analysis.source}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(analysis.date).toLocaleDateString()}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <a href={analysis.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                        Voir le post<span className="sr-only">, {analysis.text}</span>
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
