import { httpClient, HttpClient } from '@/api/http-client';
import type { DryDockPriority, DryDockStatus } from './types';

export type { DryDockPriority, DryDockStatus };

export interface IDryDock {
  id?: number;
  vessel_id: number;
  vessel_name?: string;
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

export class DryDockService {
  constructor(private http: HttpClient = httpClient) {}

  public async fetchAll(search?: string, status?: string): Promise<IDryDock[]> {
    return this.http.get<IDryDock[]>('/dry-docks', { search, status });
  }

  public async fetchById(id: number): Promise<IDryDock> {
    return this.http.get<IDryDock>(`/dry-docks/${id}`);
  }

  public async fetchCostSummary(id: number): Promise<ICostSummary> {
    return this.http.get<ICostSummary>(`/dry-docks/${id}/costs-summary`);
  }

  public async create(payload: IDryDock): Promise<IDryDock> {
    return this.http.post<IDryDock, IDryDock>('/dry-docks', payload);
  }

  public async fetchSpecifications(
    id: number,
  ): Promise<Record<string, unknown[]>> {
    return this.http.get<Record<string, unknown[]>>(
      `/dry-docks/${id}/specifications`,
    );
  }

  public async copyYardEstimates(id: number): Promise<{ success: boolean }> {
    return this.http.post<{ success: boolean }, Record<string, never>>(
      `/dry-docks/${id}/costs/copy-yard-to-actual`,
      {},
    );
  }
}
