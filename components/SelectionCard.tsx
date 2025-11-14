
import React from 'react';
import { ChevronRightIcon } from './icons';

interface SelectionCardProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}

const SelectionCard: React.FC<SelectionCardProps> = ({ icon, title, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 flex items-center justify-between cursor-pointer
                 hover:shadow-xl hover:scale-105 transition-transform duration-200 ease-in-out"
    >
      <div className="flex items-center">
        {icon}
        <h3 className="text-xl font-semibold ml-4 text-gray-800 dark:text-gray-200">{title}</h3>
      </div>
      <ChevronRightIcon className="w-6 h-6 text-micron-gray" />
    </div>
  );
};

export default SelectionCard;
