import { useState, useEffect } from "react";

export default function Alerts() {
  const [filterSeverity, setFilterSeverity] = useState("Toutes");
  const [filterType, setFilterType] = useState("Toutes"); // New state for type filter
  const [allAlerts, setAllAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/v1/dashboard/alerts');

        if (!response.ok) {
          throw new Error('Failed to fetch alerts data from API');
        }

        const combinedAlerts = await response.json();

        // Process the combined data to add severity and map fields for display
        const processedAlerts = combinedAlerts.map((alert, index) => {
          // Check if it's a sensitive alert by looking for a unique field like 'comment_text'
          if (alert.comment_text) {
            return {
              id: `sen-${alert.comment_id || index}`,
              type: `Contenu ${alert.true_category}`,
              severity: 'Haute',
              message: `"${alert.comment_text}"`,
              media: alert.media_page,
              date: new Date().toISOString(), // Placeholder date
              details: `Score du modèle: ${alert.model_score.toFixed(2)}`,
            };
          } else {
            // It's a monitoring alert
            return {
              id: `mon-${index}`,
              type: alert.type === 'pic_engagement' ? 'Pic d\'engagement' : 'Inactivité',
              severity: 'Moyenne',
              message: alert.message,
              media: alert.media,
              date: alert.date,
              details: alert.post_link ? `Lien: ${alert.post_link}` : null,
            };
          }
        });

        // Sort alerts by date
        processedAlerts.sort((a, b) => new Date(b.date) - new Date(a.date));

        setAllAlerts(processedAlerts);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const filteredAlerts = allAlerts.filter((alert) => {
    const severityMatch = filterSeverity === "Toutes" || alert.severity === filterSeverity;
    const typeMatch = filterType === "Toutes" || 
                      (filterType === "Contenu" && alert.type.startsWith("Contenu")) ||
                      alert.type === filterType;
    return severityMatch && typeMatch;
  });

  const severityColors = {
    Haute: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    Moyenne: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    Faible: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  };

  if (loading) {
    return <div className="text-center py-10">Chargement des alertes...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Erreur: {error}</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">Système d'Alertes</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Notifications importantes concernant les analyses de médias.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-x-6">
        {/* Filter by Severity */}
        <div className="flex items-center gap-x-2">
          <label htmlFor="severityFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Sévérité :
          </label>
          <select
            id="severityFilter"
            name="severityFilter"
            className="block w-auto rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
          >
            <option>Toutes</option>
            <option>Haute</option>
            <option>Moyenne</option>
            <option>Faible</option>
          </select>
        </div>
        {/* Filter by Type */}
        <div className="flex items-center gap-x-2">
          <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Type :
          </label>
          <select
            id="typeFilter"
            name="typeFilter"
            className="block w-auto rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option>Toutes</option>
            <option>Contenu</option>
            <option>Pic d'engagement</option>
            <option>Inactivité</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <li key={alert.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                    {alert.type}
                  </p>
                  <div className="ml-2 flex flex-shrink-0">
                    <p
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${severityColors[alert.severity]}`}
                    >
                      {alert.severity}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      {alert.message}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                    <p>
                      Média: <span className="font-medium">{alert.media}</span> -{" "}
                      <time dateTime={alert.date}>{new Date(alert.date).toLocaleDateString()}</time>
                    </p>
                  </div>
                </div>
                {alert.details && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-500">
                    Détails: {alert.details}
                  </p>
                )}
              </li>
            ))
          ) : (
            <li className="px-4 py-4 sm:px-6 text-center text-gray-500 dark:text-gray-400">
              Aucune alerte trouvée pour les filtres sélectionnés.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
