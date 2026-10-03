import { ChecklistService, type IChecklist } from '@/models/checklist';
import type { ChecklistDataType } from '@/models/types';
import { ref, type Ref } from 'vue';
import { BaseController } from './base.controller';

export class ChecklistController extends BaseController {
  public checklists: Ref<IChecklist[]> = ref([]);
  public currentChecklist: Ref<IChecklist | null> = ref(null);
  public searchQuery: Ref<string> = ref('');
  public isModalOpen: Ref<boolean> = ref(false);

  // Form State
  public form: Ref<IChecklist> = ref(this.getInitialFormState());

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

  private getInitialFormState(): IChecklist {
    return {
      name: '',
      description: '',
      items: [
        {
          title: '',
          data_type: 'Status',
          sort_order: 1,
        },
      ],
      is_active: true,
    };
  }

  public openAddModal(): void {
    this.form.value = this.getInitialFormState();
    this.isModalOpen.value = true;
  }

  public closeAddModal(): void {
    this.isModalOpen.value = false;
  }

  public addEmptyItem(): void {
    this.form.value.items?.push({
      title: '',
      data_type: 'Status',
      sort_order: this.form.value.items?.length + 1,
    });
  }

  public removeItem(index: number): void {
    if (this.form.value.items) {
      this.form.value.items.splice(index, 1);
      this.form.value.items.forEach((item, idx) => {
        item.sort_order = idx + 1;
      });
    }
  }

  public async submitForm(): Promise<boolean> {
    if (!this.form.value.name.trim()) {
      alert('Checklist Name is required');
      return false;
    }
    if (this.form.value.items?.length === 0) {
      alert('Minimum one item required');
      return false;
    }

    const payload: IChecklist = {
      name: this.form.value.name.trim(),
      description: this.form.value.description?.trim() || null,
      is_active: this.form.value.is_active,
      items: this.form.value.items,
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
