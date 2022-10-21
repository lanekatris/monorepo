export function MetricCard({ metric, text, color = 'blue' }) {
  return (
    <div className="metric-card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 max-w-72 w-full">
      <div className="flex items-center text-gray-900 dark:text-gray-100">
        {text}
      </div>

      <p
        className={`mt-2 text-3xl font-bold spacing-sm text-${color}-500 dark:text-white`}
      >
        {metric}
      </p>
    </div>
  );
}
