import { useState } from "react";

const mockAnalysisResult = {
  theme: "Politique",
  sentiment: "neutre",
  toxicite: 0.15,
  mots_cles: ["gouvernement", "loi", "assemblée"],
};

export default function Analyze() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text) return;

    setLoading(true);
    setResult(null);

    // Simulate API call
    setTimeout(() => {
      setResult(mockAnalysisResult);
      setLoading(false);
    }, 1500);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">Analyser un Texte</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Collez un texte ci-dessous pour l'analyser avec le modèle IA.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="w-full mb-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
          <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-t-lg">
            <label htmlFor="comment" className="sr-only">
              Votre texte
            </label>
            <textarea
              id="comment"
              rows="8"
              className="w-full px-0 text-sm text-gray-900 bg-white dark:bg-gray-800 border-0 focus:ring-0 dark:text-white dark:placeholder-gray-400"
              placeholder="Écrivez un texte à analyser..."
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
          </div>
          <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
            <button
              type="submit"
              className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-indigo-600 rounded-lg focus:ring-4 focus:ring-indigo-200 hover:bg-indigo-700"
              disabled={loading}
            >
              {loading ? "Analyse en cours..." : "Lancer l'analyse"}
            </button>
          </div>
        </div>
      </form>

      {loading && (
        <div className="mt-8 text-center">
          <p className="dark:text-white">Chargement des résultats...</p>
        </div>
      )}

      {result && (
        <div className="mt-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">Résultats de l'Analyse</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Thème</dt>
                  <dd className="mt-1 text-lg text-gray-900 dark:text-white">{result.theme}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Sentiment</dt>
                  <dd className="mt-1 text-lg text-gray-900 dark:text-white">{result.sentiment}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Score de Toxicité</dt>
                  <dd className="mt-1 text-lg text-gray-900 dark:text-white">{result.toxicite}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Mots-clés détectés</dt>
                  <dd className="mt-1 text-lg text-gray-900 dark:text-white">
                    {result.mots_cles.map((keyword) => (
                      <span key={keyword} className="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300 mr-2 mb-2">
                        {keyword}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
