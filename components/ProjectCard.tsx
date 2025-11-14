
import React from 'react';
import { Project, ProjectStatus } from '../types';
import { ChevronRightIcon, DocumentIcon } from './icons';

interface ProjectCardProps {
  project: Project;
  onSelect: () => void;
}

const statusStyles: Record<ProjectStatus, string> = {
  'On Track': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'At Risk': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'Off Track': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  'Completed': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 flex flex-col justify-between cursor-pointer
                 hover:shadow-xl hover:scale-105 transition-transform duration-200 ease-in-out"
    >
      <div>
        <div className="flex items-start justify-between">
            <DocumentIcon className="w-8 h-8 text-micron-blue mb-3"/>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[project.status]}`}>
                {project.status}
            </span>
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">{project.name}</h3>
        <p className="text-sm text-micron-gray dark:text-gray-400 mt-2 line-clamp-3">{project.description}</p>
      </div>
      <div className="flex items-center justify-end mt-4">
        <span className="text-sm font-medium text-micron-blue">View Details</span>
        <ChevronRightIcon className="w-5 h-5 text-micron-blue ml-1" />
      </div>
    </div>
  );
};

export default ProjectCard;
