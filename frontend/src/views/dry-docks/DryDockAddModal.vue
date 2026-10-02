<template>
  <div
    v-if="controller.isAddModalOpen.value"
    class="fixed inset-0 z-50 overflow-hidden"
  >
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black/40 transition-opacity"
      @click="controller.closeAddModal"
    ></div>

    <!-- Slide-over Drawer Panel -->
    <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
      <div class="w-screen max-w-md bg-white shadow-xl flex flex-col">
        <!-- Header -->
        <div
          class="px-6 py-4 border-b border-gray-200 flex justify-between items-center"
        >
          <h2 class="text-base font-bold text-gray-800">Add item</h2>
          <button
            @click="controller.closeAddModal"
            class="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <!-- Scrollable Form Body -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4 text-sm text-gray-700">
          <!-- Vessel (Diperlukan) -->
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="font-medium text-gray-800">Vessel</label>
              <span class="text-[11px] text-gray-400">Diperlukan</span>
            </div>
            <select
              v-model="controller.form.value.vessel_id"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-sky-500"
            >
              <option :value="null">Pilih sesuatu</option>
              <option
                v-for="v in controller.vessels.value"
                :key="v.id"
                :value="v.id"
              >
                {{ v.name }}
              </option>
            </select>
          </div>

          <!-- Dock List No (Diperlukan) -->
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="font-medium text-gray-800">Dock List No</label>
              <span class="text-[11px] text-gray-400">Diperlukan</span>
            </div>
            <input
              v-model="controller.form.value.dock_list_no"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500"
            />
          </div>

          <!-- Description (Diperlukan) -->
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="font-medium text-gray-800">Description</label>
              <span class="text-[11px] text-gray-400">Diperlukan</span>
            </div>
            <textarea
              v-model="controller.form.value.description"
              rows="3"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500 resize-none"
            ></textarea>
          </div>

          <!-- Shipyard Name -->
          <div>
            <label class="block font-medium text-gray-800 mb-1"
              >Shipyard Name</label
            >
            <input
              v-model="controller.form.value.shipyard_name"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500"
            />
          </div>

          <!-- Details of Shipyard -->
          <div>
            <label class="block font-medium text-gray-800 mb-1"
              >Details of Shipyard</label
            >
            <input
              v-model="controller.form.value.details_of_shipyard"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500"
            />
          </div>

          <!-- Planned Start Date -->
          <div>
            <label class="block font-medium text-gray-800 mb-1"
              >Planned Start Date</label
            >
            <input
              v-model="controller.form.value.planned_start_date"
              type="date"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500"
            />
          </div>

          <!-- Planned End Date -->
          <div>
            <label class="block font-medium text-gray-800 mb-1"
              >Planned End Date</label
            >
            <input
              v-model="controller.form.value.planned_end_date"
              type="date"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500"
            />
          </div>

          <!-- Actual Start Date -->
          <div>
            <label class="block font-medium text-gray-800 mb-1"
              >Actual Start Date</label
            >
            <input
              v-model="controller.form.value.actual_start_date"
              type="date"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500"
            />
          </div>

          <!-- Actual End Date -->
          <div>
            <label class="block font-medium text-gray-800 mb-1"
              >Actual End Date</label
            >
            <input
              v-model="controller.form.value.actual_end_date"
              type="date"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500"
            />
          </div>

          <!-- Account Code -->
          <div>
            <label class="block font-medium text-gray-800 mb-1"
              >Account Code</label
            >
            <select
              v-model="controller.form.value.account_code"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-sky-500"
            >
              <option value="">—</option>
              <option value="ABC-123">ABC-123</option>
            </select>
          </div>

          <!-- Budget -->
          <div>
            <label class="block font-medium text-gray-800 mb-1">Budget</label>
            <input
              v-model.number="controller.form.value.budget"
              type="number"
              placeholder="0"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500"
            />
          </div>

          <!-- Currency (Diperlukan) -->
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="font-medium text-gray-800">Currency</label>
              <span class="text-[11px] text-gray-400">Diperlukan</span>
            </div>
            <select
              v-model="controller.form.value.currency"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-sky-500"
            >
              <option value="USD">USD</option>
              <option value="IDR">IDR</option>
              <option value="SGD">SGD</option>
            </select>
          </div>

          <!-- Responsible Rank -->
          <div>
            <label class="block font-medium text-gray-800 mb-1"
              >Responsible Rank</label
            >
            <select
              v-model="controller.form.value.responsible_rank"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-sky-500"
            >
              <option value="">—</option>
              <option value="Roshan Ahluwalia/CE">Roshan Ahluwalia/CE</option>
              <option value="Raja/CO">Raja/CO</option>
              <option value="Mark/Master">Mark/Master</option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label class="block font-medium text-gray-800 mb-1">Status</label>
            <select
              v-model="controller.form.value.status"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-sky-500"
            >
              <option value="Planning">Planning</option>
              <option value="Execution">Execution</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <!-- Priority -->
          <div>
            <label class="block font-medium text-gray-800 mb-1">Priority</label>
            <select
              v-model="controller.form.value.priority"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-sky-500"
            >
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="p-4 border-t border-gray-200 flex space-x-3 bg-gray-50">
          <button
            @click="controller.submitAddDryDock"
            :disabled="controller.isLoading.value"
            class="bg-[#7dd3fc] hover:bg-[#38bdf8] text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
          >
            Kirim
          </button>
          <button
            @click="controller.closeAddModal"
            class="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DryDockController } from '@/controllers/dry-dock.controller';

defineProps<{
  controller: DryDockController;
}>();
</script>
