import { ref, type Ref } from 'vue';
import { BaseController } from './base.controller';
import {
  DryDockService,
  type IDryDock,
  type ICostSummary,
  type DryDockStatus,
  type DryDockPriority,
} from '@/models/dry-dock';
import { httpClient } from '@/api/http-client';
import type { IVessel } from '@/models/vessel';

export interface IDryDockForm {
  vessel_id: number | null;
  dock_list_no: string;
  description: string;
  shipyard_name: string;
  details_of_shipyard: string;
  planned_start_date: string;
  planned_end_date: string;
  actual_start_date: string;
  actual_end_date: string;
  account_code: string;
  budget: number | null;
  currency: string;
  responsible_rank: string;
  status: DryDockStatus;
  priority: DryDockPriority;
}

export class DryDockController extends BaseController {
  public dryDocks: Ref<IDryDock[]> = ref([]);
  public currentDryDock: Ref<IDryDock | null> = ref(null);
  public costSummary: Ref<ICostSummary | null> = ref(null);
  public isAddModalOpen: Ref<boolean> = ref(false);
  public vessels: Ref<IVessel[]> = ref([]);

  // params
  public searchQuery: Ref<string> = ref('');
  public statusFilter: Ref<string> = ref('');

  // Form State
  public form: Ref<IDryDockForm> = ref(this.getInitialFormState());

  constructor(private service: DryDockService = new DryDockService()) {
    super();
  }

  private getInitialFormState(): IDryDockForm {
    return {
      vessel_id: null,
      dock_list_no: '',
      description: '',
      shipyard_name: '',
      details_of_shipyard: '',
      planned_start_date: '',
      planned_end_date: '',
      actual_start_date: '',
      actual_end_date: '',
      account_code: '',
      budget: null,
      currency: 'USD',
      responsible_rank: '',
      status: 'Planning',
      priority: 'Medium',
    };
  }

  public openAddModal(): void {
    this.form.value = this.getInitialFormState();
    this.isAddModalOpen.value = true;
    this.loadVessels();
  }

  public closeAddModal(): void {
    this.isAddModalOpen.value = false;
  }

  public async loadVessels(): Promise<void> {
    try {
      this.vessels.value = await httpClient.get<IVessel[]>('/vessels');
    } catch (err: unknown) {
      console.error('Gagal mengambil daftar vessel', err);
    }
  }

  public async submitAddDryDock(): Promise<boolean> {
    const f = this.form.value;

    if (!f.vessel_id) {
      alert('Vessel is required');
      return false;
    }
    if (!f.dock_list_no.trim()) {
      alert('Dock List No is required');
      return false;
    }
    if (!f.description.trim()) {
      alert('Description is required');
      return false;
    }
    if (!f.currency.trim()) {
      alert('Currency is required');
      return false;
    }

    const payload: IDryDock = {
      vessel_id: f.vessel_id,
      dock_list_no: f.dock_list_no,
      description: f.description,
      shipyard_name: f.shipyard_name || null,
      details_of_shipyard: f.details_of_shipyard || null,
      planned_start_date: f.planned_start_date || null,
      planned_end_date: f.planned_end_date || null,
      actual_start_date: f.actual_start_date || null,
      actual_end_date: f.actual_end_date || null,
      account_code: f.account_code || null,
      budget: f.budget ?? 0,
      currency: f.currency,
      responsible_rank: f.responsible_rank || null,
      status: f.status,
      priority: f.priority,
    };

    const result = await this.executeAsync(async () => {
      return await this.service.create(payload);
    });

    if (result) {
      this.closeAddModal();
      await this.loadDryDocks();
      return true;
    }

    return false;
  }

  public async loadDryDocks(): Promise<void> {
    await this.executeAsync(async () => {
      this.dryDocks.value = await this.service.fetchAll();
    });
  }

  public async loadProjectDetails(id: number): Promise<void> {
    await this.executeAsync(async () => {
      const [dd, summary] = await Promise.all([
        this.service.fetchById(id),
        this.service.fetchCostSummary(id),
      ]);
      this.currentDryDock.value = dd;
      this.costSummary.value = summary;
    });
  }

  public async handleCopyYardEstimates(id: number): Promise<void> {
    await this.executeAsync(async () => {
      await this.service.copyYardEstimates(id);
      this.costSummary.value = await this.service.fetchCostSummary(id);
      alert('Estimasi yard berhasil disalin ke actual!');
    });
  }
}
