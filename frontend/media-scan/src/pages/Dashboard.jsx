import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { stats } from "../data/stats";
import { ArrowUpIcon } from "@heroicons/react/20/solid";
import SentimentPieChart from "../components/charts/SentimentPieChart";
import ThemeBarChart from "../components/charts/ThemeBarChart";
import TopMediaTable from "../components/TopMediaTable";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const tourSteps = [
  {
    id: "welcome-dashboard",
    title: "Bienvenue sur votre Tableau de Bord Media-Scan !",
    content: "Ceci est une visite guidée rapide pour vous familiariser avec l'interface.",
    placement: "center",
  },
  {
    id: "main-stats",
    title: "Statistiques Clés",
    content: "Cette section vous donne un aperçu rapide des métriques importantes comme le total des analyses et les contenus toxiques.",
    placement: "bottom",
  },
  {
    id: "sentiment-chart",
    title: "Analyse des Sentiments",
    content: "Visualisez la répartition des sentiments (positif, négatif, neutre) des contenus analysés ici.",
    placement: "right",
  },
  {
    id: "theme-chart",
    title: "Répartition Thématique",
    content: "Ce graphique montre les principaux thèmes abordés dans les médias.",
    placement: "left",
  },
  {
    id: "top-media-table",
    title: "Top Médias",
    content: "Consultez les médias les plus performants ou pertinents dans ce tableau.",
    placement: "top",
  },
  {
    id: "sidebar-navigation",
    title: "Navigation Principale",
    content: "Utilisez cette barre latérale pour accéder aux différentes sections de l'application : Historique, Analyse, Alertes, etc.",
    placement: "right",
  },
  {
    id: "end-tour",
    title: "Fin de la Visite",
    content: "C'est tout pour cette visite rapide ! N'hésitez pas à explorer les fonctionnalités par vous-même.",
    placement: "center",
  },
];

export default function Dashboard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [tourActive, setTourActive] = useState(false);

  useEffect(() => {
    // Optionally, start tour automatically for new users
    const hasSeenTour = localStorage.getItem('hasSeenDashboardTour');
    if (!hasSeenTour) {
      setTourActive(true);
      localStorage.setItem('hasSeenDashboardTour', 'true');
    }
  }, []);

  const startTour = () => {
    setCurrentStep(0);
    setTourActive(true);
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setTourActive(false); // End tour
    }
  };

  const skipTour = () => {
    setTourActive(false);
  };

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

  const renderTooltip = () => {
    if (!tourActive) return null;

    const step = tourSteps[currentStep];
    const targetElement = document.getElementById(step.id);

    if (!targetElement && step.id !== "end-tour") return null; // Don't render if target not found (unless it's the end step)

    const rect = targetElement ? targetElement.getBoundingClientRect() : { top: window.innerHeight / 2, left: window.innerWidth / 2 };

    const tooltipClasses = "absolute bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-4 rounded-lg shadow-lg z-[10001] max-w-xs text-left";

    const dynamicTooltipStyle = {};

    // Basic placement logic (can be greatly improved)
    if (step.placement === "center") {
        dynamicTooltipStyle.top = `${rect.top + rect.height / 2 - 100}px`; // Adjust for tooltip height
        dynamicTooltipStyle.left = `${rect.left + rect.width / 2 - 150}px`; // Adjust for tooltip width
    } else if (step.placement === "bottom") {
        dynamicTooltipStyle.top = `${rect.bottom + 10}px`;
        dynamicTooltipStyle.left = `${rect.left}px`;
    } else if (step.placement === "right") {
        dynamicTooltipStyle.top = `${rect.top}px`;
        dynamicTooltipStyle.left = `${rect.right + 10}px`;
    } else if (step.placement === "left") {
        dynamicTooltipStyle.top = `${rect.top}px`;
        dynamicTooltipStyle.left = `${rect.left - 310}px`; // 300px (max-w-xs) + 10px offset
    } else if (step.placement === "top") {
        dynamicTooltipStyle.top = `${rect.top - 150}px`; // Adjust for tooltip height + 10px offset
        dynamicTooltipStyle.left = `${rect.left}px`;
    }

    // Ensure tooltip stays within viewport (basic check)
    if (parseInt(dynamicTooltipStyle.left) < 0) dynamicTooltipStyle.left = '10px';
    if (parseInt(dynamicTooltipStyle.top) < 0) dynamicTooltipStyle.top = '10px';
    // More comprehensive checks for right/bottom edges would be needed for a production-ready solution

    const highlightStyle = {
        position: 'absolute',
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
        borderRadius: '8px',
        zIndex: 10000,
        pointerEvents: 'none', // Allow clicks to pass through
    };

    return (
      <>
        {step.id !== "end-tour" && <div style={highlightStyle}></div>}
        <div className={tooltipClasses} style={dynamicTooltipStyle}>
          <button
            onClick={skipTour}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Close tour"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <h3 className="font-bold text-lg mb-2">{step.title}</h3>
          <p className="text-sm mb-4">{step.content}</p>
          <div className="flex justify-end space-x-2">
            {currentStep > 0 && step.id !== "end-tour" && (
                <button onClick={() => setCurrentStep(currentStep - 1)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Précédent</button>
            )}
            <button onClick={skipTour} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Passer</button>
            <button onClick={nextStep} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              {currentStep === tourSteps.length - 1 ? 'Terminer' : 'Suivant'}
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div>
      {renderTooltip()}

      <div className="mb-8 flex justify-between items-center">
        <h1 id="welcome-dashboard" className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">Dashboard</h1>
        <button
          onClick={startTour}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition-colors duration-200"
        >
          Démarrer la Visite Guidée
        </button>
      </div>

      <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
        Vue d'overview des analyses de médias.
      </p>

      {/* Stats Grid */}
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div id="sentiment-chart">
          <SentimentPieChart data={stats.repartition_sentiments} />
        </div>
        <div id="theme-chart">
          <ThemeBarChart data={stats.repartition_themes} />
        </div>
      </div>

      {/* Top Media Table */}
      <div id="top-media-table">
        <TopMediaTable data={stats.top_media} />
      </div>

    </div>
  );
}