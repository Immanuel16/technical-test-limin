<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Specification Groups</h1>
      <div class="flex items-center space-x-3">
        <div class="relative">
          <input
            v-model="controller.searchQuery.value"
            @input="controller.loadGroups"
            placeholder="Cari"
            class="pl-9 pr-4 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white w-64 outline-none border-gray-300"
          />
          <span class="absolute left-3 top-2.5 text-gray-400 text-xs">🔍</span>
        </div>
        <button
          @click="controller.openModal"
          class="bg-[#0284c7] hover:bg-[#0369a1] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-1"
        >
          <span>+ Add</span>
        </button>
      </div>
    </div>

    <!-- Data Table -->
    <div
      class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
    >
      <table class="w-full text-left text-sm text-gray-600">
        <thead
          class="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-500"
        >
          <tr>
            <th class="px-6 py-3">NAME</th>
            <th class="px-6 py-3">VESSEL</th>
            <th class="px-6 py-3">GROUP NO</th>
            <th class="px-6 py-3 text-right">ACTION</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="controller.isLoading.value">
            <td colspan="4" class="px-6 py-8 text-center text-gray-400">
              Loading data...
            </td>
          </tr>
          <tr v-else-if="controller.groups.value.length === 0">
            <td colspan="4" class="px-6 py-8 text-center text-gray-400">
              Tidak ada data ditemukan
            </td>
          </tr>
          <tr
            v-for="g in controller.groups.value"
            :key="g.id"
            class="hover:bg-gray-50/80"
          >
            <td class="px-6 py-4 font-semibold text-gray-800">{{ g.name }}</td>
            <td class="px-6 py-4 text-gray-600">
              {{ g.vessels?.join(', ') || '-' }}
            </td>
            <td class="px-6 py-4 text-gray-500">{{ g.group_no || '-' }}</td>
            <td class="px-6 py-4 text-right">
              <button
                v-if="g.id"
                @click="controller.deleteGroup(g.id)"
                class="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <SpecificationGroupAddModal :controller="controller" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { SpecificationGroupController } from '@/controllers/specification-group.controller';
import SpecificationGroupAddModal from '@/views/specification-groups/SpecificationGroupAddModal.vue';

const controller = new SpecificationGroupController();

onMounted(() => {
  controller.loadGroups();
});
</script>
