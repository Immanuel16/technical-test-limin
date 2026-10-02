<template>
  <div
    v-if="controller.isAddModalOpen.value"
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
        <div class="flex-1 overflow-y-auto p-6 space-y-4 text-sm text-gray-700">
          <!-- Vessel Name -->
          <div>
            <label class="block font-medium text-gray-800 mb-1"
              >Vessel Name</label
            >
            <select
              v-model="controller.form.value.vessel_id"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-sky-500"
            >
              <option :value="null">—</option>
              <option
                v-for="v in controller.vessels.value"
                :key="v.id"
                :value="v.id"
              >
                {{ v.name }}
              </option>
            </select>
          </div>

          <!-- Machinery Group -->
          <div>
            <label class="block font-medium text-gray-800 mb-1"
              >Machinery Group</label
            >
            <select
              v-model="controller.form.value.machinery_group_id"
              @change="controller.onMachineryGroupChange"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-sky-500"
            >
              <option :value="null">—</option>
              <option
                v-for="mg in controller.machineryGroups.value"
                :key="mg.id"
                :value="mg.id"
              >
                {{ mg.name }}
              </option>
            </select>
          </div>

          <!-- Machinery -->
          <div>
            <label class="block font-medium text-gray-800 mb-1"
              >Machinery</label
            >
            <select
              v-model="controller.form.value.machinery_id"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-sky-500"
            >
              <option :value="null">—</option>
              <option
                v-for="m in controller.machineries.value"
                :key="m.id"
                :value="m.id"
              >
                {{ m.name }}
              </option>
            </select>
          </div>

          <!-- Job Code -->
          <div>
            <label class="block font-medium text-gray-800 mb-1">Job Code</label>
            <input
              v-model="controller.form.value.job_code"
              type="text"
              placeholder="e.g. C001"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500"
            />
          </div>

          <!-- Job Name (Diperlukan) -->
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="font-medium text-gray-800">Job Name</label>
              <span class="text-[11px] text-gray-400">Diperlukan</span>
            </div>
            <input
              v-model="controller.form.value.job_name"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500"
            />
          </div>

          <!-- Job Category -->
          <div>
            <label class="block font-medium text-gray-800 mb-1"
              >Job Category</label
            >
            <select
              v-model="controller.form.value.job_category"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-sky-500"
            >
              <option :value="null">—</option>
              <option value="Check">Check</option>
              <option value="Inspection">Inspection</option>
              <option value="Lubrication">Lubrication</option>
              <option value="Deck">Deck</option>
            </select>
          </div>

          <!-- Job Type -->
          <div>
            <label class="block font-medium text-gray-800 mb-1">Job Type</label>
            <select
              v-model="controller.form.value.job_type"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-sky-500"
            >
              <option value="PMS Job">PMS Job</option>
              <option value="UPM Job">UPM Job</option>
              <option value="Dock Job">Dock Job</option>
              <option value="Time">Time</option>
            </select>
          </div>

          <!-- Specification Group (Diperlukan) -->
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="font-medium text-gray-800"
                >Specification Group</label
              >
              <span class="text-[11px] text-gray-400">Diperlukan</span>
            </div>
            <select
              v-model="controller.form.value.specification_group_id"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-sky-500"
            >
              <option :value="null">Pilih sesuatu</option>
              <option
                v-for="sg in controller.specGroups.value"
                :key="sg.id"
                :value="sg.id"
              >
                {{ sg.name }}
              </option>
            </select>
          </div>

          <!-- Job Description (Diperlukan) -->
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="font-medium text-gray-800">Job Description</label>
              <span class="text-[11px] text-gray-400">Diperlukan</span>
            </div>
            <textarea
              v-model="controller.form.value.job_description"
              rows="3"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500 resize-none"
            ></textarea>
          </div>

          <!-- Critical Job & Internal Job Toggles -->
          <div class="space-y-3 pt-1">
            <div class="flex items-center justify-between">
              <span class="font-medium text-gray-800">Critical Job</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="controller.form.value.is_critical_job"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"
                ></div>
              </label>
            </div>

            <div class="flex items-center justify-between">
              <span class="font-medium text-gray-800">Internal Job</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="controller.form.value.is_internal_job"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"
                ></div>
              </label>
            </div>
          </div>

          <!-- Estimated Hours -->
          <div>
            <label class="block font-medium text-gray-800 mb-1"
              >Estimated Hours</label
            >
            <input
              v-model.number="controller.form.value.estimated_hours"
              type="number"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500"
            />
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
import type { WorkOrderController } from '@/controllers/work-order.controller';

defineProps<{
  controller: WorkOrderController;
}>();
</script>
