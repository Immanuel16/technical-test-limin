export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export type JobType = 'PMS Job' | 'UPM Job' | 'Dock Job' | 'Time';
export type JobCategory = 'Check' | 'Inspection' | 'Lubrication' | 'Deck';
export type ChecklistDataType =
  | 'Status'
  | 'Number field'
  | 'Text field'
  | 'Meter Reading'
  | 'Multiple Choice'
  | 'Inspection Check';

export type DryDockStatus = 'Planning' | 'Execution' | 'Completed';
export type DryDockPriority = 'Low' | 'Medium' | 'High';
