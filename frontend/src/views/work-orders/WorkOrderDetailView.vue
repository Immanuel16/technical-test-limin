<template>
  <div class="p-8 max-w-7xl mx-auto space-y-6" v-if="workOrder">
    <!-- Breadcrumb & Header Title -->
    <div>
      <div class="text-xs text-gray-400 mb-1">
        Work Order Master / {{ workOrder.job_name }}
      </div>
      <h1 class="text-2xl font-bold text-gray-800">{{ workOrder.job_name }}</h1>
      <div class="text-sm text-gray-500" v-html="formattedDescription" />
    </div>

    <!-- Metrik Ringkasan Biaya (Costs) -->
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white p-5 border rounded-lg shadow-xs">
        <span class="text-xs font-bold text-gray-400 uppercase"
          >Total Budget</span
        >
        <div class="text-2xl font-extrabold text-gray-900 mt-1">
          {{ workOrder.total_budget?.toLocaleString() }}$
        </div>
      </div>
      <div class="bg-white p-5 border rounded-lg shadow-xs">
        <span class="text-xs font-bold text-gray-400 uppercase"
          >Total Internal Estimate</span
        >
        <div class="text-2xl font-extrabold text-gray-900 mt-1">
          {{ workOrder.total_internal_estimate?.toLocaleString() }}$
        </div>
      </div>
    </div>

    <!-- Section Sub Jobs -->
    <div class="bg-white p-6 border rounded-lg shadow-xs space-y-4">
      <h2 class="text-lg font-bold text-gray-800">Sub Jobs</h2>
      <table class="w-full text-left text-sm">
        <thead
          class="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b"
        >
          <tr>
            <th class="py-2.5 px-4">Description</th>
            <th class="py-2.5 px-4">Total Budget</th>
            <th class="py-2.5 px-4">Owner Estimate</th>
            <th class="py-2.5 px-4">Responsible Rank</th>
            <th class="py-2.5 px-4">Qty</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="job in workOrder.sub_jobs" :key="job.id">
            <td class="py-3 px-4 font-medium">{{ job.description }}</td>
            <td class="py-3 px-4">{{ job.total_budget }}$</td>
            <td class="py-3 px-4">{{ job.owner_estimate }}$</td>
            <td class="py-3 px-4 text-gray-500">{{ job.responsible_rank }}</td>
            <td class="py-3 px-4">{{ job.quantity }} {{ job.unit }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { WorkOrderService, type IWorkOrder } from '@/models/work-order';

const route = useRoute();
const workOrder = ref<IWorkOrder | null>(null);
const service = new WorkOrderService();

const formattedDescription = computed(() => {
  if (!workOrder.value?.job_description) return '';
  // Mengganti teks \n (atau baris baru asli) menjadi tag

  return workOrder.value.job_description
    .replace(/\n/g, '') // Untuk string literal "\n"
    .replace(/\n/g, ''); // Untuk newline asli
});

onMounted(async () => {
  const id = Number(route.params.id);
  workOrder.value = await service.fetchById(id);
});
</script>
