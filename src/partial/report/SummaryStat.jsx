'use client';

const colorStyles = {
  blue: 'bg-blue-100 text-blue-600 border-blue-200',
  green: 'bg-green-100 text-green-600 border-green-200',
  purple: 'bg-purple-100 text-purple-600 border-purple-200',
  yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200',
  red: 'bg-red-100 text-red-600 border-red-200',
};

const trendColors = {
  up: 'text-green-600',
  down: 'text-red-600',
  neutral: 'text-gray-500',
};

export function SummaryStat({
  label,
  value,
  subtext,
  icon: Icon,
  color,
  trend,
  trendValue,
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-white via-white to-gray-50 p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-md">
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative z-10">
        {/* Icon */}
        <div className={`mb-4 inline-flex rounded-lg border p-3 ${colorStyles[color]}`}>
          <Icon size={24} />
        </div>

        {/* Label */}
        <p className="text-sm font-medium text-gray-600">{label}</p>

        {/* Main value */}
        <p className="mt-2 text-3xl font-bold text-gray-900">
          {value}
        </p>

        {/* Subtext and trend */}
        <div className="mt-3 flex items-center justify-between">
          {subtext && (
            <p className="text-xs text-gray-500">{subtext}</p>
          )}
          {trend && trendValue && (
            <div className={`text-xs font-semibold ${trendColors[trend]}`}>
              {trend === 'up' && '↑'} {trend === 'down' && '↓'} {trendValue}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
