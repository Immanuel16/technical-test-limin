import { httpClient, HttpClient } from '@/api/http-client';

export interface ISpecificationGroup {
  id?: number;
  name: string;
  group_no?: string | null;
  sort_order?: number;
  is_frontpage?: boolean;
  vessels?: string[];
  vessel_ids?: number[];
}

export class SpecificationGroupService {
  constructor(private http: HttpClient = httpClient) {}

  public async fetchAll(
    search?: string,
    vesselId?: number,
  ): Promise<ISpecificationGroup[]> {
    return this.http.get<ISpecificationGroup[]>('/specification-groups', {
      search,
      vessel_id: vesselId,
    });
  }

  public async create(
    payload: ISpecificationGroup,
  ): Promise<ISpecificationGroup> {
    return this.http.post<ISpecificationGroup, ISpecificationGroup>(
      '/specification-groups',
      payload,
    );
  }

  public async delete(id: number): Promise<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(
      `/specification-groups/${id}`,
    );
  }
}
