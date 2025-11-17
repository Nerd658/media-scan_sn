import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTheme } from "../../context/ThemeContext";

const COLORS = {
  positif: "#10B981",
  negatif: "#EF4444",
  neutre: "#6B7280",
};

export default function SentimentPieChart({ data }) {
  const { theme } = useTheme();
  const chartData = Object.keys(data).map((key) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: data[key],
  }));

  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-4 shadow h-full transition-colors">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Répartition des Sentiments</h3>
        <ResponsiveContainer width="100%" height={300}>
        <PieChart>
            <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            >
            {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase()]} />
            ))}
            </Pie>
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
        </PieChart>
        </ResponsiveContainer>
    </div>
  );
}
