<!-- src/views/dry-docks/DryDockListView.vue -->
<template>
  <div class="p-8 max-w-7xl mx-auto space-y-8">
    <!-- Section 1: My Dry Docks (Cards View) -->
    <div>
      <h2 class="text-xl font-bold text-gray-800 mb-4">My Dry Docks</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="dock in highlightedDocks"
          :key="dock.id"
          @click="navigateToDetail(dock.id)"
          class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md cursor-pointer transition-shadow"
        >
          <div
            class="h-40 bg-gray-100 border-b border-gray-200 relative flex items-center justify-center"
          >
            <span class="text-4xl text-gray-400">🚢</span>
            <span
              class="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[11px] font-semibold"
              :class="getStatusBadgeClass(dock.status)"
            >
              {{ dock.status }}
            </span>
          </div>
          <div class="p-4">
            <div
              class="text-[11px] font-bold text-sky-600 uppercase tracking-wide"
            >
              {{ dock.vessel_name || 'VESSEL' }}
            </div>
            <div class="text-sm font-semibold text-gray-800 mt-0.5">
              {{ dock.status }}
            </div>
            <div class="text-xs text-gray-400 mt-1">
              {{ dock.dock_list_no }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 2: All Dry Docks (Table List View) -->
    <div class="space-y-4">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <h2 class="text-xl font-bold text-gray-800">All Dry Docks</h2>

        <!-- Controls: Minimal/Detailed, Search, Filter, Actions -->
        <div class="flex flex-wrap items-center gap-3">
          <div
            class="flex items-center space-x-1 border border-gray-300 rounded-lg p-0.5 bg-gray-50 text-sm"
          >
            <button
              @click="viewType = 'Minimal'"
              class="px-3 py-1.5 rounded-md font-medium transition-colors"
              :class="
                viewType === 'Minimal'
                  ? 'bg-[#0284c7] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              "
            >
              Minimal
            </button>
            <button
              @click="viewType = 'Detailed'"
              class="px-3 py-1.5 rounded-md font-medium transition-colors"
              :class="
                viewType === 'Detailed'
                  ? 'bg-[#0284c7] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              "
            >
              Detailed
            </button>
          </div>

          <div class="relative">
            <input
              v-model="searchQuery"
              @input="controller.loadDryDocks"
              placeholder="Cari"
              class="pl-9 pr-4 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white w-56 outline-none border-gray-300"
            />
            <span class="absolute left-3 top-2.5 text-gray-400 text-xs"
              >🔍</span
            >
          </div>

          <!-- Dropdown Filter Status -->
          <div class="relative">
            <select
              v-model="controller.statusFilter.value"
              @change="controller.loadDryDocks"
              class="px-3 py-2 border rounded-lg text-sm bg-white hover:bg-gray-50 text-gray-600 border-gray-300 outline-none pr-8 cursor-pointer"
            >
              <option value="">
                Semua ({{ controller.dryDocks.value.length }})
              </option>
              <option value="Completed">Completed</option>
              <option value="Execution">Execution</option>
              <option value="Planning">Planning</option>
            </select>
          </div>

          <!-- Tombol + Add untuk Trigger Modal -->
          <button
            @click="controller.openAddModal"
            class="bg-[#0284c7] hover:bg-[#0369a1] text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            + Add
          </button>
          <button
            class="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
          >
            Export
          </button>
        </div>
      </div>

      <!-- Data List Body -->
      <div
        class="bg-white rounded-lg border border-gray-200 shadow-2xs divide-y divide-gray-100 overflow-hidden"
      >
        <div
          v-if="controller.isLoading.value"
          class="p-8 text-center text-gray-400 text-sm"
        >
          Memuat daftar proyek dry dock...
        </div>
        <div
          v-else-if="controller.dryDocks.value.length === 0"
          class="p-8 text-center text-gray-400 text-sm"
        >
          Tidak ada data Dry Dock ditemukan.
        </div>
        <div
          v-for="dock in controller.dryDocks.value"
          :key="dock.id"
          @click="navigateToDetail(dock.id)"
          class="p-4 flex items-center justify-between hover:bg-gray-50/80 cursor-pointer transition-colors"
        >
          <div class="flex items-center space-x-6 flex-1 min-w-0">
            <div
              class="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 flex-shrink-0 flex items-center justify-center text-gray-400"
            >
              ⚓
            </div>
            <div class="w-48 font-bold text-gray-900 text-sm truncate">
              {{ dock.dock_list_no }}
            </div>
            <div class="flex-1 text-sm text-gray-500 truncate">
              {{ dock.description }}
            </div>
            <div
              class="w-40 text-sm text-gray-700 text-right pr-4 font-medium truncate"
            >
              {{ dock.vessel_name || '-' }}
            </div>
          </div>

          <button
            @click.stop="openActionMenu(dock.id)"
            class="text-gray-400 hover:text-gray-600 p-2 rounded-md hover:bg-gray-200/60 ml-2"
          >
            •••
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Form Slide-Over -->
    <DryDockAddModal :controller="controller" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { DryDockController } from '@/controllers/dry-dock.controller';
import DryDockAddModal from './DryDockAddModal.vue';
import type { IDryDock } from '@/models/dry-dock';

const router = useRouter();
const controller = new DryDockController();

const viewType = ref<'Minimal' | 'Detailed'>('Minimal');
const searchQuery = ref<string>('');

const highlightedDocks = computed<IDryDock[]>(() => {
  return controller.dryDocks.value.slice(0, 3);
});

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'Planning':
      return 'bg-amber-100 text-amber-800';
    case 'Execution':
      return 'bg-blue-100 text-blue-800';
    case 'Completed':
      return 'bg-emerald-100 text-emerald-800';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

function navigateToDetail(id?: number): void {
  if (id) {
    router.push(`/dry-docks/${id}`);
  }
}

function openActionMenu(id?: number): void {
  if (id) {
    console.log('Action clicked for dock:', id);
  }
}

onMounted(() => {
  controller.loadDryDocks();
});
</script>
