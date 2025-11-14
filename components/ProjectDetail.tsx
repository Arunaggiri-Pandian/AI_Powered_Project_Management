import React, { useState, useEffect, useCallback } from 'react';
import { Project, ProjectStatus, Risk, TimelineEvent } from '../types';
import {
    ArrowLeftIcon, CheckCircleIcon, ClockIcon, CircleIcon, PencilIcon, AiIcon, CloseIcon,
    ExclamationTriangleIcon, CalendarDaysIcon, FlagIcon
} from './icons';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

type ProposedChangeStatus = 'pending' | 'accepted' | 'rejected';
type ProposedChangeType = 'Timeline' | 'Risk' | 'Goal';

interface ProposedChange {
    type: ProposedChangeType;
    description: string;
    status: ProposedChangeStatus;
}

// Mock data for AI-suggested changes, only for specific projects for demo purposes
const MOCK_PROPOSED_CHANGES_YIELD: ProposedChange[] = [
    { type: 'Timeline', description: "Update milestone 'Staging Deployment' date to 2024-10-05.", status: 'pending' },
    { type: 'Risk', description: "Add new risk: 'Dependency on external vendor API may cause delays.' with Medium severity.", status: 'pending' },
    { type: 'Goal', description: "Mark goal 'Data Pipeline V1 Complete' as completed.", status: 'pending' },
    { type: 'Timeline', description: "Add new milestone: 'User Acceptance Testing' for 2024-10-20.", status: 'pending' },
];

const MOCK_PROPOSED_CHANGES_ANOMALY: ProposedChange[] = [
    { type: 'Timeline', description: "Add new milestone: 'Model Performance Review' for 2024-08-15.", status: 'pending' },
    { type: 'Risk', description: "Add new risk: 'False positive rate higher than expected, leading to alert fatigue.' with Medium severity.", status: 'pending' },
    { type: 'Goal', description: "Refine goal: 'Refine model to reduce false positive rate by 10%.'", status: 'pending' },
];

const statusStyles: Record<ProjectStatus, string> = {
    'On Track': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'At Risk': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'Off Track': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'Completed': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:blue-300',
};

const severityStyles: Record<Risk['severity'], string> = {
    'High': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'Medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'Low': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
}

const TimelineStatusIcon: React.FC<{status: TimelineEvent['status']}> = ({ status }) => {
    switch (status) {
        case 'Completed': return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
        case 'In Progress': return <ClockIcon className="w-6 h-6 text-yellow-500 animate-pulse" />;
        case 'Pending': return <CircleIcon className="w-6 h-6 text-gray-400 opacity-50" />;
        default: return null;
    }
};

const ChangeTypeIcon: React.FC<{type: ProposedChangeType}> = ({ type }) => {
    switch (type) {
        case 'Timeline': return <CalendarDaysIcon className="w-6 h-6 text-blue-500" />;
        case 'Risk': return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />;
        case 'Goal': return <FlagIcon className="w-6 h-6 text-green-500" />;
        default: return null;
    }
};

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<'options' | 'sources' | 'parsing' | 'summary' | 'review' | 'done'>('options');
  const [selectedSource, setSelectedSource] = useState('');
  const [editableProject, setEditableProject] = useState(project);
  const [proposedChanges, setProposedChanges] = useState<ProposedChange[]>([]);
  const [aiSummaryCounts, setAiSummaryCounts] = useState<Record<ProposedChangeType, number> | null>(null);
  const [parsingMessage, setParsingMessage] = useState('');

  useEffect(() => {
    setEditableProject(project);
  }, [project]);
  
  const finishParsing = useCallback(() => {
    let mockChanges: ProposedChange[] | null = null;

    if (project.id === 'proj-yield-pred') {
        mockChanges = MOCK_PROPOSED_CHANGES_YIELD;
    } else if (project.id === 'proj-anomaly-detect') {
        mockChanges = MOCK_PROPOSED_CHANGES_ANOMALY;
    }

    if (mockChanges) {
        const counts = mockChanges.reduce((acc, change) => {
            acc[change.type] = (acc[change.type] || 0) + 1;
            return acc;
        }, {} as Record<ProposedChangeType, number>);
        
        setAiSummaryCounts(counts);
        setProposedChanges(mockChanges);
        setModalStep('summary');
    } else {
        setModalStep('done');
    }
  }, [project.id, selectedSource]);

  useEffect(() => {
    if (modalStep !== 'parsing' || !selectedSource) {
      return;
    }

    let timeouts: number[] = [];

    if (selectedSource === 'Jira' || selectedSource === 'Confluence') {
      const messages = [
        `Making MCP call to ${selectedSource}...`,
        'Connection established.',
        'Now fetching project details...'
      ];
      
      messages.forEach((msg, index) => {
        timeouts.push(
          window.setTimeout(() => {
            setParsingMessage(msg);
          }, index * 1500)
        );
      });

      timeouts.push(
        window.setTimeout(() => {
          finishParsing();
        }, messages.length * 1500)
      );
      
    } else { // PowerPoint
      setParsingMessage('Our AI is analyzing the document to find the latest project information. This may take a moment.');
      const timeoutId = window.setTimeout(finishParsing, 3000);
      timeouts.push(timeoutId);
    }

    return () => {
        timeouts.forEach(clearTimeout);
    };
  }, [modalStep, selectedSource, finishParsing]);

  const handleUpdateFromSource = (source: string) => {
    setSelectedSource(source);
    setModalStep('parsing');
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
        setModalStep('options');
        setSelectedSource('');
        setProposedChanges([]);
        setAiSummaryCounts(null);
        setParsingMessage('');
    }, 300);
  };

  const handleReviewDecision = (index: number, decision: ProposedChangeStatus) => {
    const newChanges = [...proposedChanges];
    newChanges[index].status = decision;
    setProposedChanges(newChanges);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditableProject(prev => ({ ...prev, [name]: value }));
  };

  const renderModalContent = () => {
    switch(modalStep) {
        case 'options':
            return (
                <div>
                    <h3 className="text-lg font-medium text-center mb-6 text-gray-900 dark:text-gray-100">How would you like to update the project?</h3>
                    <div className="flex flex-col space-y-4">
                        <button onClick={() => { setIsEditing(true); closeModal(); }} className="flex items-center justify-center w-full px-4 py-3 font-semibold text-white bg-micron-blue rounded-lg hover:bg-blue-700 transition-colors">
                            <PencilIcon className="w-5 h-5 mr-2" />
                            Edit Manually
                        </button>
                        <button onClick={() => setModalStep('sources')} className="flex items-center justify-center w-full px-4 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                            <AiIcon className="w-5 h-5 mr-2" />
                            Update from Source with AI
                        </button>
                    </div>
                </div>
            );
        case 'sources':
            return (
                <div>
                    <h3 className="text-lg font-medium text-center mb-6 text-gray-900 dark:text-gray-100">Select an input source</h3>
                    <div className="flex justify-center items-center space-x-4">
                        <button onClick={() => handleUpdateFromSource('PowerPoint')} className="px-4 py-2 font-bold text-lg text-white bg-red-500 rounded-md hover:bg-red-600">PowerPoint</button>
                        <button onClick={() => handleUpdateFromSource('Confluence')} className="px-4 py-2 font-bold text-lg text-white bg-blue-600 rounded-md hover:bg-blue-700">Confluence</button>
                        <button onClick={() => handleUpdateFromSource('Jira')} className="px-4 py-2 font-bold text-lg text-white bg-blue-800 rounded-md hover:bg-blue-900">Jira</button>
                    </div>
                </div>
            );
        case 'parsing':
            return (
                <div className="text-center">
                    <AiIcon className="w-12 h-12 text-indigo-500 mx-auto mb-4 animate-spin"/>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Processing {selectedSource}...</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 min-h-[40px] flex items-center justify-center">
                        {parsingMessage}
                    </p>
                </div>
            );
        case 'summary':
            const totalChanges = proposedChanges.length;
            return (
                <div>
                    <div className="text-center">
                        <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-4"/>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Analysis Complete!</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            I've analyzed {selectedSource} and found {totalChanges} potential update{totalChanges === 1 ? '' : 's'}.
                        </p>
                    </div>
                    {aiSummaryCounts && (
                        <div className="mt-6 space-y-3 bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                            {Object.entries(aiSummaryCounts).map(([type, count]) => (
                                <div key={type} className="flex items-center">
                                    <ChangeTypeIcon type={type as ProposedChangeType} />
                                    <span className="ml-3 font-medium text-gray-700 dark:text-gray-300">{count} {type} Update{count > 1 ? 's' : ''}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    <button onClick={() => setModalStep('review')} className="mt-6 w-full px-4 py-2 font-semibold text-white bg-micron-blue rounded-lg hover:bg-blue-700 transition-colors">Review Changes</button>
                </div>
            );
        case 'review':
             return (
                <div>
                    <h3 className="text-lg font-medium text-center mb-4 text-gray-900 dark:text-gray-100">Review Proposed Changes</h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                        {proposedChanges.map((change, index) => (
                            <div key={index} className={`p-3 rounded-lg flex items-start gap-4 transition-all ${
                                change.status === 'accepted' ? 'bg-green-50 dark:bg-green-900/50 border-l-4 border-green-500' : 
                                change.status === 'rejected' ? 'bg-red-50 dark:bg-red-900/50 border-l-4 border-red-500' : 
                                'bg-gray-50 dark:bg-slate-800'
                            }`}>
                                <div className="flex-shrink-0 pt-1">
                                    <ChangeTypeIcon type={change.type} />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{change.description}</p>
                                </div>
                                {change.status === 'pending' && (
                                    <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2">
                                        <button onClick={() => handleReviewDecision(index, 'accepted')} className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-200 rounded-md hover:bg-green-300">Accept</button>
                                        <button onClick={() => handleReviewDecision(index, 'rejected')} className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-200 rounded-md hover:bg-red-300">Reject</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setModalStep('done')} className="mt-6 w-full px-4 py-2 font-semibold text-white bg-micron-blue rounded-lg hover:bg-blue-700 transition-colors">Finalize Updates</button>
                </div>
             );
        case 'done':
            const hasMockData = project.id === 'proj-yield-pred' || project.id === 'proj-anomaly-detect';
            return (
                 <div className="text-center">
                    <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-4"/>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Project Update Complete!</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {!hasMockData ? `AI found no new updates in ${selectedSource}.` : 
                        `Applied ${proposedChanges.filter(c => c.status === 'accepted').length} update(s) from ${selectedSource}.`}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">(This is a mockup - no actual changes have been saved.)</p>
                    <button onClick={closeModal} className="mt-6 w-full px-4 py-2 font-semibold text-white bg-micron-blue rounded-lg hover:bg-blue-700 transition-colors">Close</button>
                </div>
            );
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-xl p-6 md:p-8">
        <button onClick={onBack} className="flex items-center mb-6 text-micron-blue hover:underline">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Projects
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-start border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
                <p className="text-micron-gray dark:text-gray-400 mt-1">Project Owner: {project.owner}</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <div className={`px-3 py-1.5 text-sm font-semibold rounded-full ${statusStyles[project.status]} min-w-max`}>
                    Status: {project.status}
                </div>
            </div>
        </div>

        {isEditing && (
            <div className="mb-6 bg-blue-50 dark:bg-slate-800 p-4 rounded-lg border border-blue-200 dark:border-slate-700 flex justify-between items-center">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">You are in edit mode. Click Save to apply changes or Cancel to discard.</p>
                <div className="space-x-2">
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-600 dark:text-gray-200 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">Save Changes</button>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
              {/* Objective & Goals */}
              <div>
                  <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Project Objective</h2>
                  {isEditing ? (
                    <textarea name="objective" value={editableProject.objective} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-white dark:bg-dark-bg border-gray-300 dark:border-gray-600" rows={3}></textarea>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300">{project.objective}</p>
                  )}
              </div>
              <div>
                  <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Key Goals</h2>
                  {isEditing ? (
                    <div className="space-y-2">
                      {editableProject.goals.map((goal, index) => (
                        <input key={index} type="text" value={goal} onChange={(e) => {
                          const newGoals = [...editableProject.goals];
                          newGoals[index] = e.target.value;
                          setEditableProject(p => ({...p, goals: newGoals}));
                        }} className="w-full p-2 border rounded-md bg-white dark:bg-dark-bg border-gray-300 dark:border-gray-600" />
                      ))}
                    </div>
                  ) : (
                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                      {project.goals.map((goal, index) => <li key={index}>{goal}</li>)}
                    </ul>
                  )}
              </div>
              {/* Risks */}
              <div>
                  <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Risks & Mitigations</h2>
                  <div className="space-y-4">
                  {project.risks.map((risk, index) => (
                      <div key={index} className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between items-start">
                            <p className="font-semibold text-gray-700 dark:text-gray-200">{risk.description}</p>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${severityStyles[risk.severity]}`}>{risk.severity}</span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2"><span className="font-medium">Mitigation:</span> {risk.mitigation}</p>
                      </div>
                  ))}
                  </div>
              </div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Project Timeline</h2>
            <div className="relative border-l border-gray-200 dark:border-gray-700 pl-6">
              {project.timeline.map((event, index) => (
                <div key={index} className="mb-8">
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-light-bg dark:bg-dark-bg rounded-full -left-4 ring-4 ring-white dark:ring-dark-card">
                    <TimelineStatusIcon status={event.status}/>
                  </span>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{event.milestone}</h3>
                  <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{event.date}</time>
                  <p className="text-base font-normal text-gray-500 dark:text-gray-400">{event.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button Footer */}
        {!isEditing && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-center">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center w-full sm:w-auto px-6 py-3 font-semibold text-white bg-micron-blue rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200 ease-in-out"
                >
                    <PencilIcon className="w-5 h-5 mr-3" />
                    Edit / Update Project
                </button>
            </div>
        )}
      </div>
      
      {/* Modal for Edit/Update options */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center transition-opacity" onClick={closeModal}>
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-xl p-6 w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Update Project</h2>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                      <CloseIcon className="w-6 h-6" />
                  </button>
                </div>
                {renderModalContent()}
            </div>
        </div>
      )}
    </>
  );
};

export default ProjectDetail;