export type ChecklistDataType =
  | 'Status'
  | 'Number field'
  | 'Text field'
  | 'Meter Reading'
  | 'Multiple Choice'
  | 'Inspection Check';

export interface IChecklistItem {
  id?: number;
  checklist_id?: number;
  title: string;
  data_type: ChecklistDataType;
  sort_order: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface IChecklist {
  id?: number;
  name: string;
  description?: string | null;
  is_active: boolean;
  items?: IChecklistItem[];
  created_at?: Date;
  updated_at?: Date;
}
