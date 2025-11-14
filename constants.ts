
import { Organization } from './types';

export const MOCK_DATA: Organization[] = [
  {
    id: 'ce',
    name: 'Central Engineering',
    teams: [
      {
        id: 'esi',
        name: 'ESI',
        subTeams: [
          { id: 'gel', name: 'GEL', projects: [] },
          { id: 'aips', name: 'AIPS', projects: [] },
          { id: 'pye', name: 'PYE', projects: [] },
          {
            id: 'pyai',
            name: 'PYAi',
            projects: [
              {
                id: 'proj-yield-pred',
                name: 'AI-Powered Yield Prediction Model',
                description: 'Developing a machine learning model to predict manufacturing yield with higher accuracy, reducing waste and improving efficiency.',
                objective: 'To increase manufacturing yield prediction accuracy by 15% within Q4.',
                goals: [
                  'Integrate data from 5 different sources into a unified data pipeline.',
                  'Develop and train 3 competing ML models.',
                  'Deploy the best-performing model into a staging environment for live testing.',
                  'Achieve a prediction accuracy of over 95% on test data.'
                ],
                risks: [
                  { description: 'Data quality issues from legacy systems.', mitigation: 'Implement automated data cleaning and validation scripts.', severity: 'High' },
                  { description: 'Shortage of available GPU resources for training.', mitigation: 'Schedule training jobs during off-peak hours and explore cloud computing options.', severity: 'Medium' },
                  { description: 'Model drift after deployment.', mitigation: 'Implement a continuous monitoring and retraining pipeline.', severity: 'Low' }
                ],
                status: 'On Track',
                timeline: [
                  { milestone: 'Project Kick-off & Requirement Gathering', date: '2024-05-01', status: 'Completed' },
                  { milestone: 'Data Pipeline V1 Complete', date: '2024-06-15', status: 'Completed' },
                  { milestone: 'Model Prototyping', date: '2024-08-01', status: 'In Progress' },
                  { milestone: 'Staging Deployment', date: '2024-09-30', status: 'Pending' },
                  { milestone: 'Production Rollout', date: '2024-11-15', status: 'Pending' }
                ],
                owner: 'Dr. Evelyn Reed'
              },
              {
                id: 'proj-anomaly-detect',
                name: 'Automated Anomaly Detection System',
                description: 'An AI system to monitor real-time sensor data from fabrication equipment to detect anomalies and prevent costly failures.',
                objective: 'Reduce equipment downtime by 20% by implementing a proactive anomaly detection system.',
                goals: [
                  'Stream and process sensor data in real-time with less than 500ms latency.',
                  'Achieve a 99% accuracy in anomaly detection with a low false positive rate.',
                  'Integrate with the existing alert and maintenance system.'
                ],
                risks: [
                  { description: 'High volume of data causing processing bottlenecks.', mitigation: 'Optimize data streaming architecture and use distributed computing.', severity: 'High' },
                  { description: 'Difficulty in defining all possible anomaly patterns.', mitigation: 'Use an unsupervised learning model that can identify novel anomalies.', severity: 'Medium' }
                ],
                status: 'At Risk',
                timeline: [
                  { milestone: 'Proof of Concept', date: '2024-04-20', status: 'Completed' },
                  { milestone: 'Real-time Data Integration', date: '2024-07-01', status: 'In Progress' },
                  { milestone: 'System Integration Testing', date: '2024-09-01', status: 'Pending' },
                  { milestone: 'Pilot Program Launch', date: '2024-10-10', status: 'Pending' }
                ],
                owner: 'Marcus Thorne'
              }
            ]
          },
          { id: 'esda', name: 'ESDA', projects: [] }
        ]
      },
      { id: 'ops-ai', name: 'OPS AI', subTeams: [] },
      { id: 'ssai', name: 'SSAI', subTeams: [] }
    ]
  },
  {
    id: 'deg',
    name: 'DEG',
    teams: [
       { id: 'deg-validation', name: 'Validation', projects: [] },
       { id: 'deg-design', name: 'Design', projects: [] },
    ]
  }
];
