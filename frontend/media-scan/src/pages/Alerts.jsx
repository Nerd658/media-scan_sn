import { useState, useEffect } from "react";

export default function Alerts() {
  const [filterSeverity, setFilterSeverity] = useState("Toutes");
  const [allAlerts, setAllAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const [monitoringRes, sensitiveRes] = await Promise.all([
          fetch('/data/monitoring_alerts.json'),
          fetch('/data/sensitive_alerts.json')
        ]);

        if (!monitoringRes.ok || !sensitiveRes.ok) {
          throw new Error('Failed to fetch alerts data');
        }

        const monitoringAlerts = await monitoringRes.json();
        const sensitiveAlerts = await sensitiveRes.json();

        // Process and add severity to monitoring alerts
        const processedMonitoring = monitoringAlerts.map((alert, index) => ({
          id: `mon-${index}`,
          type: alert.type === 'pic_engagement' ? 'Pic d\'engagement' : 'Inactivité',
          severity: 'Moyenne',
          message: alert.message,
          media: alert.media,
          date: alert.date,
          details: alert.post_link ? `Lien: ${alert.post_link}` : null,
        }));

        // Process and add severity to sensitive alerts
        const processedSensitive = sensitiveAlerts.map((alert, index) => ({
          id: `sen-${alert.comment_id || index}`,
          type: `Contenu ${alert.true_category}`,
          severity: 'Haute',
          message: `"${alert.comment_text}"`,
          media: alert.media_page,
          date: new Date().toISOString(), // The sensitive_alerts.json file doesn't have a date, so we use current date as placeholder
          details: `Score du modèle: ${alert.model_score.toFixed(2)}`,
        }));

        // Combine and sort alerts by date
        const combined = [...processedMonitoring, ...processedSensitive];
        combined.sort((a, b) => new Date(b.date) - new Date(a.date));

        setAllAlerts(combined);
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
    if (filterSeverity === "Toutes") return true;
    return alert.severity === filterSeverity;
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

      {/* Filter by Severity */}
      <div className="mb-6 flex items-center gap-x-4">
        <label htmlFor="severityFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Filtrer par sévérité :
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
              Aucune alerte trouvée pour la sévérité sélectionnée.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
