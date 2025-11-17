import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowUpIcon } from "@heroicons/react/20/solid";
import SentimentPieChart from "../components/charts/SentimentPieChart";
import ThemeBarChart from "../components/charts/ThemeBarChart";
import TopMediaTable from "../components/TopMediaTable";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Note: The guided tour is temporarily disabled as it was tied to static IDs
// that may not be present during loading states. It can be re-enabled later.

export default function Dashboard() {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  // State for our different data sources
  const [topMediaData, setTopMediaData] = useState(null);
  const [themeDistributionData, setThemeDistributionData] = useState(null);
  const [mainStats, setMainStats] = useState(null);
  // Sentiment data is missing from the new source, so we won't load it for now.

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all necessary data in parallel
        const [rankingRes, themesRes, sensitiveAlertsRes] = await Promise.all([
          fetch('/data/influence_ranking.json'),
          fetch('/data/monitoring_themes_distribution.json'),
          fetch('/data/sensitive_alerts.json')
        ]);

        if (!rankingRes.ok || !themesRes.ok || !sensitiveAlertsRes.ok) {
          throw new Error('Failed to fetch one or more data files');
        }

        const rankingData = await rankingRes.json();
        const themesData = await themesRes.json();
        const sensitiveAlertsData = await sensitiveAlertsRes.json();

        // --- Process Data for TopMediaTable ---
        // 1. Calculate total articles per media from themes distribution
        const articlesPerMedia = {};
        for (const mediaName in themesData.by_media) {
          articlesPerMedia[mediaName] = Object.values(themesData.by_media[mediaName]).reduce((sum, count) => sum + count, 0);
        }

        // 2. Merge ranking data with article counts
        const processedTopMedia = rankingData.map(media => ({
          name: media.media,
          score: media.score_influence_total.toFixed(2), // Format the score
          articles: articlesPerMedia[media.media] || 0, // Get calculated article count
        }));
        setTopMediaData(processedTopMedia);


        // --- Process Data for ThemeBarChart ---
        // Transform the 'global' array into the key-value object the component expects
        const processedThemes = themesData.global.reduce((acc, theme) => {
          acc[theme.theme] = theme.count;
          return acc;
        }, {});
        setThemeDistributionData(processedThemes);


        // --- Process Data for Main Stats Grid ---
        const totalAnalyses = Object.values(articlesPerMedia).reduce((sum, count) => sum + count, 0);
        const totalSensible = sensitiveAlertsData.length;
        const totalToxiques = sensitiveAlertsData.filter(alert => alert.true_category === 'toxic').length;

        setMainStats([
            { name: "Total Analyses", value: totalAnalyses, change: "12.5%", changeType: "increase" },
            { name: "Contenus Toxiques", value: totalToxiques, change: "2.8%", changeType: "increase" },
            { name: "Contenu Sensible", value: totalSensible, change: "3.2%", changeType: "increase" },
            { name: "Sentiment Positif", value: 'N/A', change: "5.4%", changeType: "decrease" },
        ]);


        setError(null);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]); // We can add dateRange here later to re-fetch data

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  if (loading) {
    return <div className="text-center py-10">Chargement des données...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Erreur: {error}</div>;
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <h1 id="welcome-dashboard" className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update);
            }}
            isClearable={true}
            placeholderText="Filtrer par date"
            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {/* Tour button can be re-added later */}
        </div>
      </div>

      <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
        Vue d'ensemble des analyses de médias.
      </p>

      {/* Stats Grid */}
      {mainStats && (
        <div id="main-stats" className="mb-8">
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {mainStats.map((item) => (
              <div
                key={item.name}
                className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
              >
                <dt>
                  <p className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">{item.name}</p>
                </dt>
                <dd className="flex items-baseline pb-6 sm:pb-7">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{item.value}</p>
                  <p
                    className={classNames(
                      item.changeType === "increase" ? "text-green-600" : "text-red-600",
                      "ml-2 flex items-baseline text-sm font-semibold"
                    )}
                  >
                    <ArrowUpIcon
                      className={classNames(
                        item.changeType === "increase" ? "self-center" : "self-center transform rotate-180",
                        "h-5 w-5 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                    <span className="sr-only"> {item.changeType === "increase" ? "Increased" : "Decreased"} by </span>
                    {item.change}
                  </p>
                  <div className="absolute inset-x-0 bottom-0 bg-gray-50 dark:bg-gray-700/50 px-4 py-4 sm:px-6">
                    <div className="text-sm">
                      <NavLink
                        to={`/analysis/${slugify(item.name)}`}
                        className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        Voir tout<span className="sr-only"> {item.name} stats</span>
                      </NavLink>
                    </div>
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* SentimentPieChart is hidden for now as data is not available from the new source */}
        {/* <div id="sentiment-chart">
          <SentimentPieChart data={...} />
        </div> */}
        {themeDistributionData ? (
          <div id="theme-chart">
            <ThemeBarChart data={themeDistributionData} />
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">Données de thèmes non disponibles.</div>
        )}
      </div>

      {/* Top Media Table */}
      {topMediaData ? (
        <div id="top-media-table">
          <TopMediaTable data={topMediaData} />
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">Données des top médias non disponibles.</div>
      )}

    </div>
  );
}