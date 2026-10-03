<template>
  <div
    v-if="controller.isModalOpen.value"
    class="fixed inset-0 z-50 overflow-hidden"
  >
    <div
      class="absolute inset-0 bg-black/40 transition-opacity"
      @click="controller.closeAddModal"
    ></div>

    <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
      <div class="w-screen max-w-md bg-white shadow-xl flex flex-col">
        <!-- Header -->
        <div
          class="px-6 py-4 border-b border-gray-200 flex justify-between items-center"
        >
          <h2 class="text-base font-bold text-gray-800">Add item</h2>
          <button
            @click="controller.closeAddModal"
            class="text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        </div>

        <!-- Form Body -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4 text-sm">
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="font-medium text-gray-800">Checklist Name</label>
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
              >Description</label
            >
            <textarea
              v-model="controller.form.value.description"
              rows="2"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500 resize-none"
            ></textarea>
          </div>

          <div class="flex items-center justify-between pt-1">
            <span class="font-medium text-gray-800">Active</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="controller.form.value.is_active"
                class="sr-only peer"
              />
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"
              ></div>
            </label>
          </div>

          <!-- Section Items -->
          <div class="pt-4 border-t border-gray-200 space-y-4">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="font-bold text-gray-800 text-base">
                  Checklist Items
                </h3>
                <span class="text-xs text-gray-400"
                  >Minimum one item required*</span
                >
              </div>
              <button
                @click="controller.addEmptyItem"
                class="bg-[#0284c7] hover:bg-[#0369a1] text-white px-3 py-1.5 rounded-lg text-xs font-medium"
              >
                Add
              </button>
            </div>

            <!-- List dynamic items -->
            <div
              v-for="(item, index) in controller.form.value.items"
              :key="index"
              class="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3 relative"
            >
              <div class="flex justify-between items-center">
                <span class="font-bold text-gray-700 text-xs">{{
                  index + 1
                }}</span>
                <button
                  v-if="
                    controller.form.value.items &&
                    controller.form.value.items.length > 1
                  "
                  @click="controller.removeItem(index)"
                  class="text-red-400 hover:text-red-600 text-xs"
                >
                  Hapus
                </button>
              </div>

              <div>
                <div class="flex justify-between items-center mb-1">
                  <label class="font-medium text-gray-700 text-xs">Title</label>
                  <span class="text-[10px] text-gray-400">Diperlukan</span>
                </div>
                <input
                  v-model="item.title"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs bg-white outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <div class="flex justify-between items-center mb-1">
                  <label class="font-medium text-gray-700 text-xs"
                    >Data Type</label
                  >
                  <span class="text-[10px] text-gray-400">Diperlukan</span>
                </div>
                <select
                  v-model="item.data_type"
                  class="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs bg-white outline-none focus:border-sky-500"
                >
                  <option
                    v-for="dt in controller.availableDataTypes"
                    :key="dt"
                    :value="dt"
                  >
                    {{ dt }}
                  </option>
                </select>
              </div>
            </div>
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
            @click="controller.closeAddModal"
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
import type { ChecklistController } from '@/controllers/checklist.controller';

defineProps<{
  controller: ChecklistController;
}>();
</script>
