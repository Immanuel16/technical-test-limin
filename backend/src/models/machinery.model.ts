export interface IMachineryGroup {
  id?: number;
  name: string;
  created_at?: Date;
}

export interface IMachinery {
  id?: number;
  machinery_group_id: number;
  name: string;
  code?: string | null;
  machinery_group_name?: string;
  created_at?: Date;
}
