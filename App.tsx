import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_DATA } from './constants';
import type { Organization, Team, Project } from './types';
import Header from './components/Header';
import Breadcrumbs from './components/Breadcrumbs';
import SelectionCard from './components/SelectionCard';
import ProjectCard from './components/ProjectCard';
import ProjectDetail from './components/ProjectDetail';
import { FolderIcon, AiIcon, ChartBarIcon, ShieldCheckIcon } from './components/icons';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedSubTeamId, setSelectedSubTeamId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const selectedOrg = useMemo(() => MOCK_DATA.find(org => org.id === selectedOrgId), [selectedOrgId]);
  const selectedTeam = useMemo(() => selectedOrg?.teams.find(team => team.id === selectedTeamId), [selectedOrg, selectedTeamId]);
  const selectedSubTeam = useMemo(() => selectedTeam?.subTeams?.find(subTeam => subTeam.id === selectedSubTeamId), [selectedTeam, selectedSubTeamId]);
  const selectedProject = useMemo(() => {
    const teamWithProjects = selectedSubTeamId ? selectedSubTeam : selectedTeam;
    return teamWithProjects?.projects?.find(proj => proj.id === selectedProjectId);
  }, [selectedTeam, selectedSubTeam, selectedSubTeamId, selectedProjectId]);
  
  const resetSelection = (level: 'org' | 'team' | 'subteam' | 'project' = 'org') => {
    if (level === 'org') setSelectedOrgId(null);
    if (level === 'org' || level === 'team') setSelectedTeamId(null);
    if (level === 'org' || level === 'team' || level === 'subteam') setSelectedSubTeamId(null);
    setSelectedProjectId(null);
  };

  const handleOrgSelect = (org: Organization) => {
    setSelectedOrgId(org.id);
  };

  const handleTeamSelect = (team: Team) => {
    setSelectedTeamId(team.id);
  };
  
  const handleSubTeamSelect = (subTeam: Team) => {
    setSelectedSubTeamId(subTeam.id);
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProjectId(project.id);
  };

  const renderContent = () => {
    if (selectedProject) {
      return <ProjectDetail project={selectedProject} onBack={() => setSelectedProjectId(null)} />;
    }

    if (selectedSubTeam) {
        return (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Projects in {selectedSubTeam.name}</h2>
              <div className="flex flex-col gap-6">
                {(selectedSubTeam.projects && selectedSubTeam.projects.length > 0) ? (
                  selectedSubTeam.projects.map(proj => (
                    <ProjectCard key={proj.id} project={proj} onSelect={() => handleProjectSelect(proj)} />
                  ))
                ) : <p>No projects in this team.</p>}
              </div>
            </div>
          );
    }
    
    if (selectedTeam) {
        const hasSubTeams = !!selectedTeam.subTeams && selectedTeam.subTeams.length > 0;
        const hasProjects = !!selectedTeam.projects && selectedTeam.projects.length > 0;
        
        return (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">{hasSubTeams ? `Teams in ${selectedTeam.name}` : `Projects in ${selectedTeam.name}`}</h2>
              <div className={hasProjects ? "flex flex-col gap-6" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
                 {hasSubTeams ? (
                    selectedTeam.subTeams!.map(subTeam => (
                        <SelectionCard key={subTeam.id} icon={<FolderIcon className="w-8 h-8 text-micron-blue"/>} title={subTeam.name} onClick={() => handleSubTeamSelect(subTeam)} />
                    ))
                 ) : hasProjects ? (
                    selectedTeam.projects!.map(proj => (
                        <ProjectCard key={proj.id} project={proj} onSelect={() => handleProjectSelect(proj)} />
                    ))
                 ) : (
                    <p>No teams or projects found.</p>
                 )}
              </div>
            </div>
        );
    }

    if (selectedOrg) {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Teams in {selectedOrg.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedOrg.teams.map(team => (
              <SelectionCard key={team.id} icon={<FolderIcon className="w-8 h-8 text-micron-blue"/>} title={team.name} onClick={() => handleTeamSelect(team)} />
            ))}
          </div>
        </div>
      );
    }

    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <div className="text-center py-12 px-4 bg-white dark:bg-dark-card rounded-xl shadow-lg">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
                    AI-Powered Project Oversight
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-micron-gray dark:text-gray-300">
                    Welcome to the Micron AI PMO Portal. Gain intelligent insights, automate updates, and proactively manage your project portfolio with the power of AI.
                </p>
            </div>
    
            {/* Key Features Section */}
            <div>
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center p-6 bg-white dark:bg-dark-card rounded-lg shadow-md">
                        <AiIcon className="w-12 h-12 text-micron-blue mx-auto mb-4"/>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">AI-Powered Updates</h3>
                        <p className="text-micron-gray dark:text-gray-400">
                            Automatically parse updates from PowerPoint, Confluence, and Jira to keep your project data current with minimal effort.
                        </p>
                    </div>
                    <div className="text-center p-6 bg-white dark:bg-dark-card rounded-lg shadow-md">
                        <ChartBarIcon className="w-12 h-12 text-micron-blue mx-auto mb-4"/>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Centralized Dashboard</h3>
                        <p className="text-micron-gray dark:text-gray-400">
                            Navigate through organizations, teams, and projects in a single, unified interface for a clear overview of the entire portfolio.
                        </p>
                    </div>
                    <div className="text-center p-6 bg-white dark:bg-dark-card rounded-lg shadow-md">
                        <ShieldCheckIcon className="w-12 h-12 text-micron-blue mx-auto mb-4"/>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Proactive Risk Management</h3>
                        <p className="text-micron-gray dark:text-gray-400">
                            Easily track project status, identify risks, and view mitigation strategies to stay ahead of potential issues.
                        </p>
                    </div>
                </div>
            </div>
    
            {/* Get Started Section */}
            <div>
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Get Started</h2>
                    <p className="mt-2 text-lg text-micron-gray dark:text-gray-400">Select an organization to begin exploring projects.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {MOCK_DATA.map(org => (
                    <SelectionCard key={org.id} icon={<FolderIcon className="w-8 h-8 text-micron-blue"/>} title={org.name} onClick={() => handleOrgSelect(org)} />
                  ))}
                </div>
            </div>
            
            <div className="p-6 bg-white dark:bg-dark-card rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 text-center">Supported Input Sources</h3>
                <p className="text-sm text-micron-gray dark:text-gray-400 mt-1 text-center">Our platform integrates with various enterprise systems for seamless project analysis.</p>
                <div className="flex justify-center items-center space-x-8 mt-4">
                    <span className="font-bold text-lg text-red-500">PowerPoint</span>
                    <span className="font-bold text-lg text-blue-600">Confluence</span>
                    <span className="font-bold text-lg text-blue-800">Jira</span>
                </div>
            </div>
        </div>
      );
  };
  
  const breadcrumbItems = [
    ...(selectedOrg ? [{ label: selectedOrg.name, onClick: () => resetSelection('team') }] : []),
    ...(selectedTeam ? [{ label: selectedTeam.name, onClick: () => resetSelection('subteam') }] : []),
    ...(selectedSubTeam ? [{ label: selectedSubTeam.name, onClick: () => resetSelection('project') }] : []),
    ...(selectedProject ? [{ label: selectedProject.name, onClick: () => {} }] : []),
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header onHomeClick={() => resetSelection()} theme={theme} onThemeToggle={toggleTheme} />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        {breadcrumbItems.length > 0 && <Breadcrumbs items={breadcrumbItems} />}
        <div className="mt-6">
          {renderContent()}
        </div>
      </main>
      <footer className="bg-gray-100 dark:bg-gray-800 text-center p-4 text-sm text-micron-gray dark:text-gray-400">
        <p>© 2025 Micron Technology, Inc. All rights reserved. | Developed by Arun (akarunanidhi)</p>
      </footer>
    </div>
  );
};

export default App;
