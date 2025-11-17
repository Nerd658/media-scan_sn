import { useState } from "react";
import { history as allHistory } from "../data/history";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function HistoryTable() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterTheme, setFilterTheme] = useState("Tous");
  const [filterSentiment, setFilterSentiment] = useState("Tous");

  const themes = ["Tous", ...new Set(allHistory.map(item => item.resultat_analyse.theme))];
  const sentiments = ["Tous", ...new Set(allHistory.map(item => item.resultat_analyse.sentiment))];

  const filteredHistory = allHistory.filter((item) => {
    const itemDate = new Date(item.date_analyse);
    const textMatch = item.texte_original.toLowerCase().includes(searchText.toLowerCase());
    const themeMatch = filterTheme === "Tous" || item.resultat_analyse.theme === filterTheme;
    const sentimentMatch = filterSentiment === "Tous" || item.resultat_analyse.sentiment === filterSentiment;
    const dateMatch = (!startDate || !endDate) || (itemDate >= startDate && itemDate <= endDate);

    return textMatch && themeMatch && sentimentMatch && dateMatch;
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">Historique des analyses</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
            Liste des dernières analyses de texte effectuées.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Exporter
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="my-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Text */}
          <div>
            <label htmlFor="search-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Rechercher un texte
            </label>
            <input
              type="text"
              name="search-text"
              id="search-text"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Rechercher..."
            />
          </div>

          {/* Filter by Theme */}
          <div>
            <label htmlFor="filter-theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Filtrer par thème
            </label>
            <select
              id="filter-theme"
              name="filter-theme"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
              value={filterTheme}
              onChange={(e) => setFilterTheme(e.target.value)}
            >
              {themes.map(theme => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
          </div>

          {/* Filter by Sentiment */}
          <div>
            <label htmlFor="filter-sentiment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Filtrer par sentiment
            </label>
            <select
              id="filter-sentiment"
              name="filter-sentiment"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
              value={filterSentiment}
              onChange={(e) => setFilterSentiment(e.target.value)}
            >
              {sentiments.map(sentiment => (
                <option key={sentiment} value={sentiment}>{sentiment}</option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Filtrer par date
            </label>
            <div className="flex items-center gap-x-2 mt-1">
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                    placeholderText="Début"
                    calendarClassName="dark-datepicker"
                />
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                    placeholderText="Fin"
                    calendarClassName="dark-datepicker"
                />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-0">
                    Texte Original
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Thème
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Sentiment
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Toxicité
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                {filteredHistory.map((item) => (
                  <tr key={item._id}>
                    <td className="py-4 pl-4 pr-3 text-sm text-gray-500 dark:text-gray-400 sm:pl-0 max-w-sm truncate">
                      {item.texte_original}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{item.resultat_analyse.theme}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{item.resultat_analyse.sentiment}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{item.resultat_analyse.toxicite}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{new Date(item.date_analyse).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
