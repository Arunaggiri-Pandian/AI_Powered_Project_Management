import React from 'react';
import { ChevronRightIcon } from './icons';

interface BreadcrumbItem {
  label: string;
  onClick: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="inline-flex items-center">
              {index > 0 && <ChevronRightIcon className="w-4 h-4 text-gray-400" />}
              <button
                onClick={item.onClick}
                disabled={isLast}
                className={`inline-flex items-center text-sm font-medium ${
                  isLast
                    ? 'text-gray-500 dark:text-gray-400 cursor-default'
                    : 'text-micron-blue hover:text-blue-800 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
