<template>
  <div
    class="p-8 max-w-7xl mx-auto space-y-6"
    v-if="controller.currentDryDock.value"
  >
    <div class="flex justify-between items-center border-b pb-4">
      <div>
        <div class="text-xs text-gray-400">
          Dry Docks / {{ controller.currentDryDock.value.dock_list_no }}
        </div>
        <h1 class="text-2xl font-bold text-gray-800">
          {{ controller.currentDryDock.value.dock_list_no }}
        </h1>
        <p class="text-sm text-gray-500">
          {{ controller.currentDryDock.value.description }}
        </p>
      </div>
      <div class="flex space-x-2">
        <button
          v-if="controller.currentDryDock.value.id"
          @click="
            controller.handleCopyYardEstimates(
              controller.currentDryDock.value.id,
            )
          "
          class="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Copy Yard Estimates to Actual
        </button>
      </div>
    </div>

    <!-- Metrik Cost Summary -->
    <div
      v-if="controller.costSummary.value"
      class="grid grid-cols-4 gap-4 bg-gray-50 p-6 rounded-xl border border-gray-200"
    >
      <div class="bg-white p-4 rounded-lg border border-gray-100 shadow-2xs">
        <span class="text-xs text-gray-400 font-bold uppercase">Budget</span>
        <div class="text-xl font-bold text-gray-800 mt-1">
          {{ controller.costSummary.value.budget.toLocaleString() }}$
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg border border-gray-100 shadow-2xs">
        <span class="text-xs text-gray-400 font-bold uppercase"
          >Yard Estimates</span
        >
        <div class="text-xl font-bold text-gray-800 mt-1">
          {{ controller.costSummary.value.yard_estimates.toLocaleString() }}$
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg border border-gray-100 shadow-2xs">
        <span class="text-xs text-gray-400 font-bold uppercase"
          >Total Costs</span
        >
        <div class="text-xl font-bold text-gray-800 mt-1">
          {{ controller.costSummary.value.total_costs.toLocaleString() }}$
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg border border-gray-100 shadow-2xs">
        <span class="text-xs text-gray-400 font-bold uppercase">Variance</span>
        <div class="text-xl font-bold text-emerald-600 mt-1">
          {{ controller.costSummary.value.variance.toLocaleString() }}$ ↑
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { DryDockController } from '@/controllers/dry-dock.controller';

const route = useRoute();
const controller = new DryDockController();

onMounted(() => {
  const id = Number(route.params.id);
  controller.loadProjectDetails(id);
});
</script>
