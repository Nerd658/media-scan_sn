import React from 'react';

const ComparisonTable = ({ mediaToCompare }) => {
  if (!mediaToCompare || mediaToCompare.length === 0) {
    return null;
  }

  // Extract all unique metric keys from all media
  const metrics = [
    "Total Articles",
    "Score d'Influence",
    "Sentiment Positif",
    "Sentiment Négatif",
    "Sentiment Neutre",
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tableau Comparatif</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Métrique
              </th>
              {mediaToCompare.map(media => (
                <th key={media.name} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {media.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {metrics.map(metric => (
              <tr key={metric}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{metric}</td>
                {mediaToCompare.map(media => (
                  <td key={`${media.name}-${metric}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {getMetricValue(media, metric)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const getMetricValue = (media, metric) => {
  switch (metric) {
    case "Total Articles":
      return media.total_articles;
    case "Score d'Influence":
      return media.score_influence;
    case "Sentiment Positif":
      return media.repartition_sentiments.positif;
    case "Sentiment Négatif":
      return media.repartition_sentiments.negatif;
    case "Sentiment Neutre":
      return media.repartition_sentiments.neutre;
    default:
      return "N/A";
  }
};

export default ComparisonTable;
