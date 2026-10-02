import { httpClient, HttpClient } from '@/api/http-client';
import type { JobCategory, JobType } from './types';

export interface IWorkOrderSubJob {
  id?: number;
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
  spare_name: string;
  expected_qty: number;
  cost_usd: number;
}

export interface IWorkOrderChecklistAnswer {
  id: number;
  title: string;
  data_type: string;
  answer_value?: string | null;
  sort_order: number;
}

export interface IWorkOrderChecklistInstance {
  id: number;
  checklist_name: string;
  checklist_description?: string | null;
  remarks?: string | null;
  is_completed: boolean;
  completed_date?: string | null;
  items: IWorkOrderChecklistAnswer[];
}

export interface IWorkOrder {
  id?: number;
  vessel_id?: number | null;
  vessel_name?: string;
  machinery_group_id?: number | null;
  machinery_id?: number | null;
  specification_group_id: number;
  specification_group_name?: string;
  job_code?: string | null;
  job_name: string;
  job_category?: JobCategory | null;
  job_type: JobType;
  job_description: string;
  is_critical_job: boolean;
  is_internal_job: boolean;
  estimated_hours: number;
  responsible_rank?: string | null;
  total_budget?: number;
  total_internal_estimate?: number;
  sub_jobs?: IWorkOrderSubJob[];
  spares?: IWorkOrderSpare[];
}

export class WorkOrderService {
  constructor(private http: HttpClient = httpClient) {}

  public async fetchGrouped(
    search?: string,
  ): Promise<Record<string, IWorkOrder[]>> {
    return this.http.get<Record<string, IWorkOrder[]>>('/work-orders', {
      search,
    });
  }

  public async fetchById(id: number): Promise<IWorkOrder> {
    return this.http.get<IWorkOrder>(`/work-orders/${id}`);
  }

  public async create(payload: IWorkOrder): Promise<IWorkOrder> {
    return this.http.post<IWorkOrder, IWorkOrder>('/work-orders', payload);
  }

  public async fetchChecklists(
    workOrderId: number,
  ): Promise<IWorkOrderChecklistInstance[]> {
    return this.http.get<IWorkOrderChecklistInstance[]>(
      `/work-orders/${workOrderId}/checklists`,
    );
  }

  public async saveChecklistAnswers(
    workOrderId: number,
    checklistId: number,
    payload: {
      is_completed: boolean;
      completed_date: string | null;
      remarks: string | null;
      answers: { id: number; answer_value: string }[];
    },
  ): Promise<void> {
    return this.http.put<void, typeof payload>(
      `/work-orders/${workOrderId}/checklists/${checklistId}/answers`,
      payload,
    );
  }
}
