import { ref, type Ref } from 'vue';
import { BaseController } from './base.controller';
import { WorkOrderService, type IWorkOrder } from '@/models/work-order';
import { httpClient } from '@/api/http-client';
import type { IVessel } from '@/models/vessel';
import type { IMachineryGroup, IMachinery } from '@/models/machinery';
import type { ISpecificationGroup } from '@/models/specification-group';
import type { JobCategory, JobType } from '@/models/types';

export interface IWorkOrderForm {
  vessel_id: number | null;
  machinery_group_id: number | null;
  machinery_id: number | null;
  specification_group_id: number | null;
  job_code: string;
  job_name: string;
  job_category: JobCategory | null;
  job_type: JobType;
  job_description: string;
  is_critical_job: boolean;
  is_internal_job: boolean;
  estimated_hours: number;
}

export class WorkOrderController extends BaseController {
  public groupedWorkOrders: Ref<Record<string, IWorkOrder[]>> = ref({});
  public searchQuery: Ref<string> = ref('');
  public isAddModalOpen: Ref<boolean> = ref(false);

  // Lookup Options
  public vessels: Ref<IVessel[]> = ref([]);
  public machineryGroups: Ref<IMachineryGroup[]> = ref([]);
  public machineries: Ref<IMachinery[]> = ref([]);
  public specGroups: Ref<ISpecificationGroup[]> = ref([]);

  public form: Ref<IWorkOrderForm> = ref(this.getInitialFormState());

  constructor(private service: WorkOrderService = new WorkOrderService()) {
    super();
  }

  private getInitialFormState(): IWorkOrderForm {
    return {
      vessel_id: null,
      machinery_group_id: null,
      machinery_id: null,
      specification_group_id: null,
      job_code: '',
      job_name: '',
      job_category: null,
      job_type: 'PMS Job',
      job_description: '',
      is_critical_job: false,
      is_internal_job: false,
      estimated_hours: 0,
    };
  }

  public openAddModal(): void {
    this.form.value = this.getInitialFormState();
    this.isAddModalOpen.value = true;
    this.loadLookups();
  }

  public closeAddModal(): void {
    this.isAddModalOpen.value = false;
  }

  public async loadLookups(): Promise<void> {
    try {
      const [v, mg, sg] = await Promise.all([
        httpClient.get<IVessel[]>('/vessels'),
        httpClient.get<IMachineryGroup[]>('/machinery-groups'),
        httpClient.get<ISpecificationGroup[]>('/specification-groups'),
      ]);
      this.vessels.value = v;
      this.machineryGroups.value = mg;
      this.specGroups.value = sg;
    } catch (err: unknown) {
      console.error('Gagal mengambil data lookup', err);
    }
  }

  public async onMachineryGroupChange(): Promise<void> {
    this.form.value.machinery_id = null;
    const groupId = this.form.value.machinery_group_id;
    if (groupId) {
      this.machineries.value = await httpClient.get<IMachinery[]>(
        '/machineries',
        { group_id: groupId },
      );
    } else {
      this.machineries.value = [];
    }
  }

  public async submitForm(): Promise<boolean> {
    const f = this.form.value;
    if (!f.job_name.trim()) {
      alert('Job Name is required');
      return false;
    }
    if (!f.specification_group_id) {
      alert('Specification Group is required');
      return false;
    }
    if (!f.job_description.trim()) {
      alert('Job Description is required');
      return false;
    }

    const payload: IWorkOrder = {
      vessel_id: f.vessel_id,
      machinery_group_id: f.machinery_group_id,
      machinery_id: f.machinery_id,
      specification_group_id: f.specification_group_id,
      job_code: f.job_code.trim() || null,
      job_name: f.job_name.trim(),
      job_category: f.job_category,
      job_type: f.job_type,
      job_description: f.job_description.trim(),
      is_critical_job: f.is_critical_job,
      is_internal_job: f.is_internal_job,
      estimated_hours: f.estimated_hours,
    };

    const result = await this.executeAsync(async () => {
      return await this.service.create(payload);
    });

    if (result) {
      this.closeAddModal();
      await this.loadWorkOrders();
      return true;
    }
    return false;
  }

  public async loadWorkOrders(): Promise<void> {
    await this.executeAsync(async () => {
      this.groupedWorkOrders.value = await this.service.fetchGrouped(
        this.searchQuery.value,
      );
    });
  }
}
