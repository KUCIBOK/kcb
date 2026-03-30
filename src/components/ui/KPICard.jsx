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
  iconColor = 'text-kcb-or',
  iconBgColor = 'bg-kcb-or/10',
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
    if (!trend) return 'text-kcb-pierre';
    
    switch (trend.direction) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-kcb-pierre';
    }
  };

  if (loading) {
    return (
      <div className={`bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-white/[0.08] rounded-[4px]"></div>
          </div>
          <div className="h-8 bg-white/[0.08] rounded-[4px] w-24 mb-2"></div>
          <div className="h-4 bg-white/[0.08] rounded-[4px] w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-6 hover:border-white/[0.12] transition-all duration-200 ${className}`}>
      {/* Icon and Trend */}
      <div className="flex items-center justify-between mb-4">
        {Icon && (
          <div className={`${iconBgColor} ${iconColor} p-2.5 rounded-[4px]`}>
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
      <div className="text-sm text-kcb-pierre">
        {label}
      </div>

      {/* Subtitle (optional) */}
      {subtitle && (
        <div className="text-xs text-kcb-sable mt-2">
          {subtitle}
        </div>
      )}
    </div>
  );
}

export default KPICard;
