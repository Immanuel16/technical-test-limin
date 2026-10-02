<template>
  <div class="p-8 max-w-7xl mx-auto space-y-6">
    <!-- Header Top: Title & Mode Toggle -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">Work Order Master</h1>
      <div
        class="flex items-center space-x-1 border border-gray-300 rounded-lg p-0.5 bg-gray-50 text-sm"
      >
        <button
          v-for="mode in viewModes"
          :key="mode"
          @click="activeViewMode = mode"
          class="px-3 py-1.5 rounded-md font-medium transition-colors"
          :class="
            activeViewMode === mode
              ? 'bg-[#0284c7] text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          "
        >
          {{ mode }}
        </button>
      </div>
    </div>

    <!-- Search & Action Bar -->
    <div class="flex justify-end items-center space-x-3">
      <div class="relative">
        <input
          v-model="searchQuery"
          @input="fetchData"
          placeholder="Cari"
          class="pl-9 pr-4 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white w-64 outline-none border-gray-300"
        />
        <span class="absolute left-3 top-2.5 text-gray-400 text-xs">🔍</span>
      </div>
      <button
        class="flex items-center space-x-2 px-3 py-2 border rounded-lg text-sm bg-white hover:bg-gray-50 text-gray-600 border-gray-300"
      >
        <span>Disaring ...</span>
        <span class="text-xs">▼</span>
      </button>
      <button
        class="bg-[#0284c7] hover:bg-[#0369a1] text-white px-4 py-2 rounded-lg text-sm font-medium"
      >
        + Add
      </button>
    </div>

    <!-- Loading & Empty States -->
    <div v-if="isLoading" class="p-12 text-center text-gray-400 text-sm">
      Memuat daftar work order...
    </div>
    <div
      v-else-if="Object.keys(groupedWorkOrders).length === 0"
      class="p-12 text-center text-gray-400 text-sm"
    >
      Tidak ada data Work Order ditemukan.
    </div>

    <!-- Grouped Work Order Cards -->
    <div v-else class="space-y-8">
      <div
        v-for="(orders, groupName) in groupedWorkOrders"
        :key="groupName"
        class="space-y-3"
      >
        <h2 class="text-base font-bold text-gray-800">{{ groupName }}</h2>

        <div class="space-y-2">
          <div
            v-for="wo in orders"
            :key="wo.id"
            @click="navigateToDetail(wo.id)"
            class="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-sm cursor-pointer transition-shadow"
          >
            <div class="flex items-center space-x-4">
              <div
                class="w-14 h-14 bg-gray-100 rounded-lg border border-gray-200 flex-shrink-0 flex items-center justify-center text-gray-400"
              >
                📋
              </div>
              <div>
                <span
                  class="text-[11px] font-bold tracking-wider text-sky-600 uppercase"
                >
                  {{ wo.job_type }}
                </span>
                <div class="font-bold text-gray-900 text-sm mt-0.5">
                  {{ wo.job_name }}
                </div>
                <div class="text-xs text-gray-400 mt-0.5">
                  {{ wo.job_code || '-' }}
                </div>
              </div>
            </div>

            <button
              @click.stop="openMenu(wo.id)"
              class="text-gray-400 hover:text-gray-600 p-2 rounded-md hover:bg-gray-100 text-base"
            >
              •••
            </button>
          </div>
        </div>
      </div>
    </div>

    <WorkOrderAddModal :controller="controller" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { WorkOrderService, type IWorkOrder } from '@/models/work-order';
import WorkOrderAddModal from '@/views/work-orders/WorkOrderAddModal.vue';
import { WorkOrderController } from '@/controllers/work-order.controller';

const router = useRouter();
const service = new WorkOrderService();

const controller = new WorkOrderController();

const viewModes = ['Minimal', 'Details', 'Add to Spec'] as const;
type ViewMode = (typeof viewModes)[number];
const activeViewMode = ref<ViewMode>('Minimal');

const searchQuery = ref<string>('');
const isLoading = ref<boolean>(false);
const groupedWorkOrders = ref<Record<string, IWorkOrder[]>>({});

async function fetchData(): Promise<void> {
  isLoading.value = true;
  try {
    groupedWorkOrders.value = await service.fetchGrouped(searchQuery.value);
  } catch (err: unknown) {
    console.error('Failed to load work orders', err);
  } finally {
    isLoading.value = false;
  }
}

function navigateToDetail(id?: number): void {
  if (id) {
    router.push(`/work-orders/${id}`);
  }
}

function openMenu(id?: number): void {
  if (id) {
    // Aksi trigger dropdown menu per-item
    console.log('Open menu for work order:', id);
  }
}

onMounted(() => {
  fetchData();
});
</script>
