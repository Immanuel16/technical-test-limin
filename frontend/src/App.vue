<template>
  <div class="min-h-screen bg-gray-50 grid">
    <SidebarNav />
    <main class="flex-1 ml-64 min-h-screen overflow-y-auto">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import SidebarNav from '@/components/SidebarNav.vue';
</script>
