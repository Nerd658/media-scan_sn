import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ComparisonBarChart = ({ mediaToCompare }) => {
  if (!mediaToCompare || mediaToCompare.length === 0) {
    return null;
  }

  // Get all theme names
  const themeNames = [...new Set(mediaToCompare.flatMap(media => Object.keys(media.themes)))];

  // Prepare data for the chart
  const chartData = themeNames.map(theme => {
    const themeData = { name: theme };
    mediaToCompare.forEach(media => {
      themeData[media.name] = media.themes[theme] || 0;
    });
    return themeData;
  });

  // Define colors for the bars
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Comparaison des Thèmes</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {mediaToCompare.map((media, index) => (
            <Bar key={media.name} dataKey={media.name} fill={colors[index % colors.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonBarChart;
