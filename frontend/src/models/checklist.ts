import { httpClient, HttpClient } from '@/api/http-client';
import type { ChecklistDataType } from './types';

export interface IChecklistItem {
  id?: number;
  checklist_id?: number;
  title: string;
  data_type: ChecklistDataType;
  sort_order: number;
}

export interface IChecklist {
  id?: number;
  name: string;
  description?: string | null;
  is_active: boolean;
  items?: IChecklistItem[];
}

export class ChecklistService {
  constructor(private http: HttpClient = httpClient) {}

  public async fetchAll(
    search?: string,
    isActive?: boolean,
  ): Promise<IChecklist[]> {
    return this.http.get<IChecklist[]>('/checklists', {
      search,
      is_active: isActive,
    });
  }

  public async fetchById(id: number): Promise<IChecklist> {
    return this.http.get<IChecklist>(`/checklists/${id}`);
  }

  public async create(payload: IChecklist): Promise<IChecklist> {
    return this.http.post<IChecklist, IChecklist>('/checklists', payload);
  }

  public async update(id: number, payload: IChecklist): Promise<IChecklist> {
    return this.http.put<IChecklist, IChecklist>(`/checklists/${id}`, payload);
  }

  public async toggleStatus(id: number, isActive: boolean): Promise<void> {
    return this.http.patch<void, { is_active: boolean }>(
      `/checklists/${id}/status`,
      { is_active: isActive },
    );
  }
}
