export type DryDockStatus = 'Planning' | 'Execution' | 'Completed';
export type DryDockPriority = 'Low' | 'Medium' | 'High';
export type DDWorkOrderStatus = 'Open' | 'In Progress' | 'On Hold' | 'Complete';

export interface IDryDock {
  id?: number;
  vessel_id: number;
  dock_list_no: string;
  description: string;
  shipyard_name?: string | null;
  details_of_shipyard?: string | null;
  planned_start_date?: string | null;
  planned_end_date?: string | null;
  actual_start_date?: string | null;
  actual_end_date?: string | null;
  account_code?: string | null;
  budget: number;
  currency: string;
  responsible_rank?: string | null;
  status: DryDockStatus;
  priority: DryDockPriority;
  vessel_name?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ICostSummary {
  budget: number;
  yard_estimates: number;
  owner_estimates: number;
  total_estimates: number;
  actual_yard_costs: number;
  actual_owner_costs: number;
  total_costs: number;
  variance: number;
}
