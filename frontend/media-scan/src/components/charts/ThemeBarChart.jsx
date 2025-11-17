import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeBarChart({ data }) {
  const { theme } = useTheme();
  const chartData = Object.keys(data).map((key) => ({
    name: key,
    value: data[key],
  }));

  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-4 shadow h-full transition-colors">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Répartition des Thèmes</h3>
        <ResponsiveContainer width="100%" height={300}>
        <BarChart
            data={chartData}
            margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
            <XAxis dataKey="name" tick={{ fill: theme === 'dark' ? '#F3F4F6' : '#111827' }} />
            <YAxis tick={{ fill: theme === 'dark' ? '#F3F4F6' : '#111827' }} />
            <Tooltip
                contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                    borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                    color: theme === 'dark' ? '#FFFFFF' : '#000000'
                }}
            />
            <Legend
                wrapperStyle={{
                    color: theme === 'dark' ? '#FFFFFF' : '#000000',
                    paddingTop: '20px'
                }}
            />
            <Bar dataKey="value" fill="#4F46E5" />
        </BarChart>
        </ResponsiveContainer>
    </div>
  );
}
