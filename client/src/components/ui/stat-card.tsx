import React from "react";

// StatCard component
interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  statValue: number | string;
  variant: 'purple' | 'blue' | 'green' | 'orange' | 'red';
  avatars?: boolean;
}

export function StatCard({ title, icon, statValue, variant, avatars = false }: StatCardProps) {
  const gradientClasses = {
    purple: "before:from-purple-100 before:via-transparent dark:before:from-purple-800/30 dark:before:via-transparent",
    blue: "before:from-blue-100 before:via-transparent dark:before:from-blue-800/30 dark:before:via-transparent",
    green: "before:from-green-100 before:via-transparent dark:before:from-green-800/30 dark:before:via-transparent",
    orange: "before:from-orange-100 before:via-transparent dark:before:from-orange-800/30 dark:before:via-transparent",
    red: "before:from-red-100 before:via-transparent dark:before:from-red-800/30 dark:before:via-transparent"
  };

  const iconColorClasses = {
    purple: "text-purple-500",
    blue: "text-blue-500",
    green: "text-green-500",
    orange: "text-orange-500",
    red: "text-red-500"
  };

  return (
    <div className={`relative overflow-hidden p-4 sm:p-5 bg-white border border-gray-200 rounded-xl shadow-2xs before:absolute before:top-0 before:end-0 before:size-full before:bg-linear-to-br ${gradientClasses[variant]} dark:bg-neutral-800 dark:border-neutral-700`}>
      <div className="relative z-10">
        <div className="flex justify-between gap-x-3 pb-4">
          <span className="inline-flex justify-center items-center align-middle size-8 rounded-lg bg-white text-gray-700 shadow-xs dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400">
            <span className={`size-4 md:size-6 ${iconColorClasses[variant]}`}>
              {icon}
            </span>
          </span>
          <div></div>
        </div>
        <h2 className="text-sm md:text-sm text-gray-800 dark:text-neutral-200">
          {title}
        </h2>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-3">
          <h3 className="text-base md:text-2xl font-semibold text-gray-800 dark:text-neutral-200">
            {statValue}
          </h3>
        </div>
      </div>
    </div>
  );
} 