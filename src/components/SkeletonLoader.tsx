import React from 'react';

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white border border-[#F0F0F3] rounded-2xl p-5 animate-pulse ${className}`}>
    <div className="h-4 bg-[#F0F0F3] rounded-md w-1/3 mb-4"></div>
    <div className="h-8 bg-[#F0F0F3] rounded-md w-2/3 mb-3"></div>
    <div className="h-3 bg-[#F0F0F3] rounded-md w-1/2"></div>
  </div>
);

export const SkeletonDashboard: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-10 bg-[#F0F0F3] rounded-xl w-1/3"></div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
    <div className="h-72 bg-[#F0F0F3] rounded-2xl"></div>
  </div>
);
