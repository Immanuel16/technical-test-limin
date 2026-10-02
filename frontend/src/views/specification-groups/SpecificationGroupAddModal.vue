<template>
  <div
    v-if="controller.isModalOpen.value"
    class="fixed inset-0 z-50 overflow-hidden"
  >
    <div
      class="absolute inset-0 bg-black/40 transition-opacity"
      @click="controller.closeModal"
    ></div>

    <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
      <div class="w-screen max-w-md bg-white shadow-xl flex flex-col">
        <!-- Header -->
        <div
          class="px-6 py-4 border-b border-gray-200 flex justify-between items-center"
        >
          <h2 class="text-base font-bold text-gray-800">Add item</h2>
          <button
            @click="controller.closeModal"
            class="text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        </div>

        <!-- Form Body -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4 text-sm">
          <div>
            <label class="block font-medium text-gray-800 mb-1">Vessel</label>
            <select
              multiple
              v-model="controller.form.value.vessel_ids"
              class="w-full border border-gray-300 rounded-lg p-2 bg-white outline-none focus:border-sky-500 h-28"
            >
              <option
                v-for="v in controller.vessels.value"
                :key="v.id"
                :value="v.id"
              >
                {{ v.name }}
              </option>
            </select>
            <span class="text-xs text-gray-400 mt-1 block"
              >Tahan Ctrl/Cmd untuk memilih beberapa vessel</span
            >
          </div>

          <div>
            <label class="block font-medium text-gray-800 mb-1"
              >Group No.</label
            >
            <input
              v-model="controller.form.value.group_no"
              type="text"
              placeholder="e.g. B1, C1"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="font-medium text-gray-800">Name</label>
              <span class="text-[11px] text-gray-400">Diperlukan</span>
            </div>
            <input
              v-model="controller.form.value.name"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label class="block font-medium text-gray-800 mb-1"
              >Sort Order</label
            >
            <input
              v-model.number="controller.form.value.sort_order"
              type="number"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500"
            />
          </div>

          <div class="flex items-center justify-between pt-2">
            <span class="font-medium text-gray-800">Frontpage</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="controller.form.value.is_frontpage"
                class="sr-only peer"
              />
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"
              ></div>
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div class="p-4 border-t border-gray-200 flex space-x-3 bg-gray-50">
          <button
            @click="controller.submitForm"
            class="bg-[#7dd3fc] hover:bg-[#38bdf8] text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors"
          >
            Kirim
          </button>
          <button
            @click="controller.closeModal"
            class="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium text-sm hover:bg-gray-50"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SpecificationGroupController } from '@/controllers/specification-group.controller';

defineProps<{
  controller: SpecificationGroupController;
}>();
</script>
