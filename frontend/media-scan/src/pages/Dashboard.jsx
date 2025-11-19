import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ArrowUpIcon } from "@heroicons/react/20/solid";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import ThemeBarChart from "../components/charts/ThemeBarChart";
import TopMediaTable from "../components/TopMediaTable";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dashboard() {
  // State for our different data sources
  const [topMediaData, setTopMediaData] = useState(null);
  const [themeDistributionData, setThemeDistributionData] = useState(null);
  const [mainStats, setMainStats] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const [allPosts, setAllPosts] = useState([]); // Store all posts for export

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all necessary data in parallel
        const [rankingRes, themesRes, alertsRes, allPostsRes] = await Promise.all([
          fetch('http://localhost:8000/api/v1/dashboard/influence-ranking'),
          fetch('http://localhost:8000/api/v1/dashboard/themes'),
          fetch('http://localhost:8000/api/v1/dashboard/alerts'),
          fetch('/data/all_posts_classified.json') // Fetch the new posts data
        ]);

        if (!rankingRes.ok || !themesRes.ok || !alertsRes.ok || !allPostsRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const rankingData = await rankingRes.json();
        const themesData = await themesRes.json();
        const alertsData = await alertsRes.json();
        const allPostsData = await allPostsRes.json(); // Get the posts data

        // Set recent posts
        setRecentPosts(allPostsData.slice(0, 4));

        // --- Process Data for TopMediaTable ---
        const articlesPerMedia = {};
        for (const mediaName in themesData.by_media) {
          articlesPerMedia[mediaName] = Object.values(themesData.by_media[mediaName]).reduce((sum, count) => sum + count, 0);
        }
        const processedTopMedia = rankingData.map(media => ({
          name: media.media,
          score: media.score_influence_total.toFixed(2),
          articles: articlesPerMedia[media.media] || 0,
        }));
        setTopMediaData(processedTopMedia);

        // --- Process Data for ThemeBarChart ---
        const processedThemes = themesData.global_themes.reduce((acc, theme) => {
          acc[theme.theme] = theme.count;
          return acc;
        }, {});
        setThemeDistributionData(processedThemes);

        // --- Process Data for Main Stats Grid ---
        const totalAnalyses = allPostsData.length; // Use the length of the new data
        const sensitiveAlerts = alertsData.filter(alert => alert.comment_text);
        const totalSensible = sensitiveAlerts.length;
        const totalToxiques = sensitiveAlerts.filter(alert => alert.true_category === 'toxic').length;
        const totalInactivity = alertsData.filter(alert => alert.type && alert.type.toLowerCase() === 'inactivité').length;

        setMainStats([
            { name: "Total Analyses", value: totalAnalyses, href: "/all-posts" },
            { name: "Contenus Toxiques", value: totalToxiques, href: "/analysis/contenus-toxiques" },
            { name: "Contenu Sensible", value: totalSensible, href: "/analysis/contenu-sensible" },
            { name: "Inactivité", value: totalInactivity, href: "/alerts?type=Inactivité" },
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
  }, []); // Removed dateRange from dependency array

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
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
          {/* DatePicker removed */}
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
                  {item.change && ( // Conditionally render the change percentage
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
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gray-50 dark:bg-gray-700/50 px-4 py-4 sm:px-6">
                    <div className="text-sm">
                      {item.href && (
                        <NavLink
                          to={item.href}
                          className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          Voir tout<span className="sr-only"> {item.name} stats</span>
                        </NavLink>
                      )}
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
        {themeDistributionData ? (
          <div id="theme-chart">
            <ThemeBarChart data={themeDistributionData} />
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">Données de thèmes non disponibles.</div>
        )}

        {/* Recent Posts List */}
        {recentPosts ? (
          <div id="recent-posts">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contenus Récents</h2>
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
              <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentPosts.map((post, index) => (
                  <li key={index} className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">{post.media}</p>
                      {post.url && (
                        <a href={post.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                          Voir le post
                        </a>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {post.preview}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">Pas de contenus récents.</div>
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