import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function History() {
  const { theme } = useTheme();
  const [trendsData, setTrendsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState([]);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/v1/dashboard/trends');
        if (!response.ok) {
          throw new Error('Failed to fetch trends data from API');
        }
        const data = await response.json();
        setTrendsData(data);
        // By default, select the first media to display
        if (Object.keys(data).length > 0) {
          setSelectedMedia([Object.keys(data)[0]]);
        }
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  const handleMediaSelection = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedMedia((prev) => [...prev, value]);
    } else {
      setSelectedMedia((prev) => prev.filter((media) => media !== value));
    }
  };

  // Process data for the chart
  const chartData = trendsData ? trendsData[Object.keys(trendsData)[0]].dates.map((date, index) => {
    const entry = { date };
    selectedMedia.forEach(mediaName => {
      if (trendsData[mediaName] && trendsData[mediaName].counts[index] !== undefined) {
        entry[mediaName] = trendsData[mediaName].counts[index];
      }
    });
    return entry;
  }) : [];

  if (loading) {
    return <div className="text-center py-10">Chargement des tendances...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Erreur: {error}</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">Tendance des Publications</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Évolution du nombre de publications par jour pour les médias sélectionnés.
        </p>
      </div>

      {/* Media Selection Checkboxes */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Sélectionnez les médias à afficher :</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {trendsData && Object.keys(trendsData).map((name) => (
            <div key={name} className="flex items-center">
              <input
                id={`checkbox-${name}`}
                type="checkbox"
                value={name}
                checked={selectedMedia.includes(name)}
                onChange={handleMediaSelection}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor={`checkbox-${name}`} className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                {name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6" style={{ height: '500px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
            <XAxis dataKey="date" tick={{ fill: theme === 'dark' ? '#F3F4F6' : '#111827' }} />
            <YAxis tick={{ fill: theme === 'dark' ? '#F3F4F6' : '#111827' }} />
            <Tooltip
                contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                    borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                }}
            />
            <Legend />
            {selectedMedia.map((mediaName, index) => (
              <Line key={mediaName} type="monotone" dataKey={mediaName} stroke={COLORS[index % COLORS.length]} strokeWidth={2} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}