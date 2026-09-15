import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  accentColor?: string;
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  accentColor = '#1E3C65',
  badge,
}) => {
  return (
    <div className="bg-white border border-[#F0F0F3] rounded-2xl p-5 shadow-xs transition-all hover:border-[#1E3C65]/30">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
          {label}
        </span>
        {Icon && (
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl lg:text-3xl font-extrabold text-[#010313] tracking-tight">
          {value}
        </span>
        {badge && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FCEBE5] text-[#FF001E]">
            {badge}
          </span>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="flex items-center gap-2 mt-2">
          {trend && (
            <span
              className={`text-xs font-bold ${
                trendPositive ? 'text-[#1E3C65]' : 'text-[#FF001E]'
              }`}
            >
              {trend}
            </span>
          )}
          {subtitle && <span className="text-xs text-[#9CA3AF] truncate">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
