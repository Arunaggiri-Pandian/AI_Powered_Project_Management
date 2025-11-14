
export interface Risk {
  description: string;
  mitigation: string;
  severity: 'Low' | 'Medium' | 'High';
}

export interface TimelineEvent {
  milestone: string;
  date: string;
  status: 'Completed' | 'In Progress' | 'Pending';
}

export type ProjectStatus = 'On Track' | 'At Risk' | 'Off Track' | 'Completed';

export interface Project {
  id: string;
  name: string;
  objective: string;
  goals: string[];
  risks: Risk[];
  status: ProjectStatus;
  timeline: TimelineEvent[];
  owner: string;
  description: string;
}

export interface Team {
  id: string;
  name: string;
  projects?: Project[];
  subTeams?: Team[];
}

export interface Organization {
  id: string;
  name: string;
  teams: Team[];
}
