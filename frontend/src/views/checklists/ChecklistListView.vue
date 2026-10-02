<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-red-500">Checklists</h1>
      <div class="flex items-center space-x-3">
        <input
          v-model="controller.searchQuery.value"
          @input="controller.loadChecklists"
          placeholder="Cari"
          class="px-4 py-2 border rounded-lg text-sm bg-gray-50 w-64 outline-none border-gray-300"
        />
        <button
          @click="$router.push('/checklists/new')"
          class="bg-[#0284c7] hover:bg-[#0369a1] text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Add
        </button>
      </div>
    </div>

    <div
      class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
    >
      <table class="w-full text-left text-sm text-gray-600">
        <thead
          class="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-500"
        >
          <tr>
            <th class="px-6 py-3">CHECKLIST NAME</th>
            <th class="px-6 py-3">DESCRIPTION</th>
            <th class="px-6 py-3">ACTIVE</th>
            <th class="px-6 py-3 text-right">ACTION</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="item in controller.checklists.value"
            :key="item.id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 font-semibold text-gray-800">
              {{ item.name }}
            </td>
            <td class="px-6 py-4 text-gray-500">
              {{ item.description || '-' }}
            </td>
            <td class="px-6 py-4">
              <span
                class="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                :class="
                  item.is_active
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-100 text-gray-600'
                "
              >
                {{ item.is_active ? 'Yes' : 'No' }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <RouterLink
                v-if="item.id"
                :to="`/checklists/${item.id}`"
                class="text-[#0284c7] hover:underline font-medium text-xs"
              >
                Detail / Edit
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Add -->
    <ChecklistAddModal :controller="controller" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { ChecklistController } from '@/controllers/checklist.controller';
import ChecklistAddModal from '@/views/checklists/ChecklistAddModal.vue';

const controller = new ChecklistController();

onMounted(() => {
  controller.loadChecklists();
});
</script>
