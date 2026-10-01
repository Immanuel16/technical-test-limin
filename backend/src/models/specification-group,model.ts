export interface ISpecificationGroup {
  id?: number;
  name: string;
  group_no?: string | null;
  sort_order?: number;
  is_frontpage?: boolean;
  vessel_ids?: number[];
  vessels?: string[];
  created_at?: Date;
  updated_at?: Date;
}
