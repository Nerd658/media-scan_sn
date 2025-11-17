import { NavLink } from "react-router-dom";
import { allMedia } from "../data/allMedia";

export default function AllMedia() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">Tous les Médias</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Liste de toutes les sources de médias collectées.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {allMedia.map((media) => (
          <NavLink
            key={media.name}
            to={`/media/${encodeURIComponent(media.name)}`}
            className="col-span-1 flex flex-col divide-y divide-gray-200 dark:divide-gray-700 rounded-lg bg-white dark:bg-gray-800 text-center shadow transition-transform transform hover:scale-105"
          >
            <div className="flex flex-1 flex-col p-8">
              <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">{media.name}</h3>
              <dl className="mt-1 flex flex-grow flex-col justify-between">
                <dt className="sr-only">Description</dt>
                <dd className="text-sm text-gray-500 dark:text-gray-400">{media.description}</dd>
                <dd className="mt-3">
                  <span className="rounded-full bg-green-100 dark:bg-green-900 px-2 py-1 text-xs font-medium text-green-800 dark:text-green-200">
                    Score: {media.score}
                  </span>
                </dd>
              </dl>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
