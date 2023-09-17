import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  // 可能是和pc共用的统一登录
  // {
  //   path: '/login',
  //   name: 'login',
  //   component: () => import('@/views/Login.vue')
  // },
  // 工作台
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home.vue')
  },
  // 我的
  // {
  //   path: '/mine',
  //   name: 'mine',
  //   component: () => import('@/views/Mine.vue')
  // },
  // 流程中心
  // {
  //   path: '/process',
  //   name: 'process',
  //   component: () => import('../views/'),
  //   children: process
  // },
  // 应用详情页
  {
    path: '/app/:appId',
    name: 'app',
    // component: () => import('../views/'),
    children: [
      // 表单详情
      // {
      //   path: 'form/:formId',
      //   name: 'AppForm',
      //   component: ,
      // },
      // 仪表盘
      // {
      //   path: 'dashboard/:dbId',
      //   name: 'AppDashboard',
      //   component: ,
      // }
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const allowed = true;
  if (allowed) {
    next();
  }
});

export default router;