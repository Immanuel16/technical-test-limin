import { ref, type Ref } from 'vue';
import { BaseController } from './base.controller';
import {
  ChecklistService,
  type IChecklist,
  type IChecklistItem,
} from '@/models/checklist';
import type { ChecklistDataType } from '@/models/types';

export class ChecklistController extends BaseController {
  public checklists: Ref<IChecklist[]> = ref([]);
  public currentChecklist: Ref<IChecklist | null> = ref(null);
  public searchQuery: Ref<string> = ref('');
  public isModalOpen: Ref<boolean> = ref(false);

  // Form State
  public formName: Ref<string> = ref('');
  public formDescription: Ref<string> = ref('');
  public formIsActive: Ref<boolean> = ref(true);
  public formItems: Ref<IChecklistItem[]> = ref([]);

  public readonly availableDataTypes: ChecklistDataType[] = [
    'Status',
    'Number field',
    'Text field',
    'Meter Reading',
    'Multiple Choice',
    'Inspection Check',
  ];

  constructor(private service: ChecklistService = new ChecklistService()) {
    super();
  }

  public openAddModal(): void {
    this.formName.value = '';
    this.formDescription.value = '';
    this.formIsActive.value = true;
    this.formItems.value = [
      { title: '', data_type: 'Status', sort_order: 1 },
      { title: '', data_type: 'Number field', sort_order: 2 },
    ];
    this.isModalOpen.value = true;
  }

  public closeAddModal(): void {
    this.isModalOpen.value = false;
  }

  public addEmptyItem(): void {
    this.formItems.value.push({
      title: '',
      data_type: 'Status',
      sort_order: this.formItems.value.length + 1,
    });
  }

  public removeItem(index: number): void {
    this.formItems.value.splice(index, 1);
    this.formItems.value.forEach((item, idx) => {
      item.sort_order = idx + 1;
    });
  }

  public async submitForm(): Promise<boolean> {
    if (!this.formName.value.trim()) {
      alert('Checklist Name is required');
      return false;
    }
    if (this.formItems.value.length === 0) {
      alert('Minimum one item required');
      return false;
    }

    const payload: IChecklist = {
      name: this.formName.value.trim(),
      description: this.formDescription.value.trim() || null,
      is_active: this.formIsActive.value,
      items: this.formItems.value,
    };

    const result = await this.executeAsync(async () => {
      return await this.service.create(payload);
    });

    if (result) {
      this.closeAddModal();
      await this.loadChecklists();
      return true;
    }
    return false;
  }

  public async loadChecklists(): Promise<void> {
    await this.executeAsync(async () => {
      this.checklists.value = await this.service.fetchAll(
        this.searchQuery.value,
      );
    });
  }

  public async loadDetail(id: number): Promise<void> {
    await this.executeAsync(async () => {
      this.currentChecklist.value = await this.service.fetchById(id);
    });
  }
}
