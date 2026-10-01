export type JobCategory = 'Check' | 'Inspection' | 'Lubrication' | 'Deck';
export type JobType = 'PMS Job' | 'UPM Job' | 'Dock Job' | 'Time';
export type TaskStatus = 'Open' | 'In Progress' | 'Closed';
export type POCategory = 'Inventory' | 'Spare part' | 'Machinery';

export interface IWorkOrderSubJob {
  id?: number;
  work_order_id?: number;
  description: string;
  sort_order: number;
  is_internal_job: boolean;
  total_budget: number;
  yard_estimates: number;
  owner_estimate: number;
  internal_comment?: string | null;
  responsible_rank?: string | null;
  quantity: number;
  unit: string;
  account?: string | null;
}

export interface IWorkOrderSpare {
  id?: number;
  work_order_id?: number;
  spare_name: string;
  expected_qty: number;
  cost_usd: number;
}

export interface IWorkOrderChecklistAnswer {
  id?: number;
  work_order_checklist_id?: number;
  title: string;
  data_type: string;
  answer_value?: string | null;
  sort_order: number;
}

export interface IWorkOrderChecklistHeader {
  id?: number;
  work_order_id?: number;
  checklist_id: number;
  checklist_name: string;
  checklist_description?: string | null;
  remarks?: string | null;
  is_completed: boolean;
  completed_date?: Date | null;
  answers?: IWorkOrderChecklistAnswer[];
}

export interface IWorkOrder {
  id?: number;
  vessel_id?: number | null;
  machinery_group_id?: number | null;
  machinery_id?: number | null;
  specification_group_id: number;
  job_code?: string | null;
  job_name: string;
  job_category?: JobCategory | null;
  job_type: JobType;
  job_description: string;
  is_critical_job: boolean;
  is_internal_job: boolean;
  estimated_hours: number;
  responsible_rank?: string | null;

  // Agregasi & metadata tampilan
  vessel_name?: string;
  specification_group_name?: string;
  total_budget?: number;
  total_internal_estimate?: number;

  sub_jobs?: IWorkOrderSubJob[];
  spares?: IWorkOrderSpare[];
  checklists?: IWorkOrderChecklistHeader[];
}
