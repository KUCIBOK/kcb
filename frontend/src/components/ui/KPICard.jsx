import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Design System - KPI Card Component
 * 
 * Displays key performance indicators with icon, value, and trend
 * 
 * Features:
 * - Icon with customizable color
 * - Large value display
 * - Trend indicator (up/down/neutral)
 * - Previous period comparison
 * - Loading state
 */

export function KPICard({
  icon: Icon,
  label,
  value,
  trend, // { value: '+12%', direction: 'up' | 'down' | 'neutral' }
  subtitle,
  loading = false,
  iconColor = 'text-indigo-400',
  iconBgColor = 'bg-indigo-900/20',
  className = ''
}) {
  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return 'text-gray-400';
    
    switch (trend.direction) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className={`bg-card border border-gray-800 rounded-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
          </div>
          <div className="h-8 bg-gray-700 rounded w-24 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all duration-200 ${className}`}>
      {/* Icon and Trend */}
      <div className="flex items-center justify-between mb-4">
        {Icon && (
          <div className={`${iconBgColor} ${iconColor} p-2.5 rounded-lg`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{trend.value}</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-1">
        <div className="text-2xl font-bold text-white">
          {value}
        </div>
      </div>

      {/* Label */}
      <div className="text-sm text-gray-400">
        {label}
      </div>

      {/* Subtitle (optional) */}
      {subtitle && (
        <div className="text-xs text-gray-500 mt-2">
          {subtitle}
        </div>
      )}
    </div>
  );
}

export default KPICard;
