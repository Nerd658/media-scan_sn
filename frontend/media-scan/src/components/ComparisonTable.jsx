import React from 'react';

const ComparisonTable = ({ mediaToCompare }) => {
  if (!mediaToCompare || mediaToCompare.length === 0) {
    return null;
  }

  // Define metrics based on the new data structure from MediaDetailsSchema
  const metrics = [
    "Score d'Influence Total",
    "Score d'Audience",
    "Score d'Engagement",
    "Score de Régularité",
    "Score de Diversité",
    "Nombre de Thèmes Abordés",
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
  if (!media || !media.scores) return "N/A";

  switch (metric) {
    case "Score d'Influence Total":
      return media.scores["Score d'Influence Total"];
    case "Score d'Audience":
      return media.scores["Score d'Audience"];
    case "Score d'Engagement":
      return media.scores["Score d'Engagement"];
    case "Score de Régularité":
      return media.scores["Score de Régularité"];
    case "Score de Diversité":
      return media.scores["Score de Diversité"];
    case "Nombre de Thèmes Abordés":
      return media.themes ? Object.keys(media.themes).length : 0;
    default:
      return "N/A";
  }
};

export default ComparisonTable;
