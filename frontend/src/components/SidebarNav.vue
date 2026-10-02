<template>
  <aside
    class="w-64 bg-[#0284c7] text-white flex flex-col h-screen fixed left-0 top-0 select-none"
  >
    <div
      class="p-6 flex items-center space-x-3 text-xl font-bold border-b border-blue-400"
    >
      <span
        class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-sm"
        >☸</span
      >
      <span>Dry Dock</span>
    </div>
    <nav class="flex-1 py-4 px-3 space-y-1">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors"
        :class="
          $route.path.startsWith(item.path)
            ? 'bg-[#0369a1] text-white'
            : 'hover:bg-[#0284c7]/80 text-blue-100'
        "
      >
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
interface NavLink {
  label: string;
  path: string;
}

const navItems: NavLink[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Specification Groups', path: '/specification-groups' },
  { label: 'Work Order Master', path: '/work-orders' },
  { label: 'Checklist', path: '/checklists' },
  { label: 'Dry Docks', path: '/dry-docks' },
];
</script>
