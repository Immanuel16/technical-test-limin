import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/specification-groups' },
  {
    path: '/specification-groups',
    component: () =>
      import('@/views/specification-groups/SpecificationGroupListView.vue'),
  },
  {
    path: '/checklists',
    component: () => import('@/views/checklists/ChecklistListView.vue'),
  },
  {
    path: '/work-orders',
    component: () => import('@/views/work-orders/WorkOrderListView.vue'),
  },
  {
    path: '/work-orders/:id',
    component: () => import('@/views/work-orders/WorkOrderDetailView.vue'),
  },
  {
    path: '/dry-docks',
    component: () => import('@/views/dry-docks/DryDockListView.vue'),
  },
  {
    path: '/dry-docks/:id',
    component: () => import('@/views/dry-docks/DryDockDetailView.vue'),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
