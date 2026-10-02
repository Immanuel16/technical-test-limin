import { ref, type Ref } from 'vue';
import { BaseController } from './base.controller';
import {
  SpecificationGroupService,
  type ISpecificationGroup,
} from '@/models/specification-group';
import { IVessel } from '@/models/vessel';
import { httpClient } from '@/api/http-client';

export interface ISpecificationGroupForm {
  name: string;
  group_no?: string | null;
  sort_order?: number;
  is_frontpage?: boolean;
  vessel_ids?: number[];
}

export class SpecificationGroupController extends BaseController {
  public groups: Ref<ISpecificationGroup[]> = ref([]);
  public searchQuery: Ref<string> = ref('');
  public vessels: Ref<IVessel[]> = ref([]);
  public selectedVesselFilter: Ref<number | undefined> = ref(undefined);
  public isModalOpen: Ref<boolean> = ref(false);

  // Form State
  public form: Ref<ISpecificationGroupForm> = ref(this.getInitialFormState());

  constructor(
    private service: SpecificationGroupService = new SpecificationGroupService(),
  ) {
    super();
  }

  private getInitialFormState(): ISpecificationGroupForm {
    return {
      name: '',
      group_no: '',
      sort_order: 0,
      is_frontpage: false,
      vessel_ids: [],
    };
  }

  public openModal(): void {
    this.form.value = this.getInitialFormState();
    this.isModalOpen.value = true;
    this.loadVessels();
  }

  public closeModal(): void {
    this.isModalOpen.value = false;
  }

  public async loadVessels(): Promise<void> {
    try {
      this.vessels.value = await httpClient.get<IVessel[]>('/vessels');
    } catch (err: unknown) {
      console.error('Gagal mengambil daftar vessels', err);
    }
  }

  public async submitForm(): Promise<boolean> {
    if (!this.form.value.name.trim()) {
      alert('Name is required');
      return false;
    }

    const payload: ISpecificationGroupForm = {
      name: this.form.value.name.trim(),
      group_no: this.form.value.group_no || null,
      sort_order: this.form.value.sort_order,
      is_frontpage: this.form.value.is_frontpage,
      vessel_ids: this.form.value.vessel_ids,
    };

    const result = await this.executeAsync(async () => {
      return await this.service.create(payload);
    });

    if (result) {
      this.closeModal();
      await this.loadGroups();
      return true;
    }
    return false;
  }

  public async loadGroups(): Promise<void> {
    await this.executeAsync(async () => {
      const data = await this.service.fetchAll(
        this.searchQuery.value,
        this.selectedVesselFilter.value,
      );
      this.groups.value = data;
    });
  }

  public async deleteGroup(id: number): Promise<void> {
    if (!confirm('Apakah yakin ingin menghapus data ini?')) return;
    await this.executeAsync(async () => {
      await this.service.delete(id);
      await this.loadGroups();
    });
  }
}
