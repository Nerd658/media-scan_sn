import { NavLink } from "react-router-dom";
import { stats } from "../data/stats";
import { ArrowUpIcon } from "@heroicons/react/20/solid";
import SentimentPieChart from "../components/charts/SentimentPieChart";
import ThemeBarChart from "../components/charts/ThemeBarChart";
import TopMediaTable from "../components/TopMediaTable";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dashboard() {
  const mainStats = [
    { name: "Total Analyses", value: stats.total_analyses, change: "12.5%", changeType: "increase" },
    { name: "Contenus Toxiques", value: stats.total_toxiques, change: "2.8%", changeType: "increase" },
    { name: "Contenu Sensible", value: stats.total_sensibles, change: "3.2%", changeType: "increase" },
    { name: "Sentiment Positif", value: stats.repartition_sentiments.positif, change: "5.4%", changeType: "decrease" },
  ];

  const slugify = (text) => {
    return text
      .toString()
            .toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Vue d'overview des analyses de médias.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8">
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <SentimentPieChart data={stats.repartition_sentiments} />
        <ThemeBarChart data={stats.repartition_themes} />
      </div>

      {/* Top Media Table */}
      <div>
        <TopMediaTable data={stats.top_media} />
      </div>

    </div>
  );
}