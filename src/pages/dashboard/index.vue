<template>
  <view class="dashboard-page">
    <!-- 状态栏占位高度, 勿删 -->
    <view class="status_bar"></view>
    <view class="widget-list" v-if="dashboard">
      <Widget
        v-for="widget in dashboard.widgetList"
        :key="widget.id"
        v-bind="widget"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import Widget from './Widget.vue';
import { provide, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getDashboard, type Dashboard } from './index.helper';

const dashboard = ref<Dashboard | null>(null);

onLoad(async(option: any) => {
  const dashboardId = option.id;
  dashboard.value = await getDashboard(dashboardId);
});

const dashboardEventBus = {
  listener: {},
  on(eventName: string, cb: (args: any[]) => void) {
    const listener = dashboardEventBus.listener as any;
    if (!Array.isArray(listener[eventName])) {
      listener[eventName] = [];
    }
    listener[eventName].push(cb);
  },
  emit(eventName: string, ...data: any[]) {
    const callbacks = (dashboardEventBus.listener as any)[eventName];
    callbacks?.forEach((cb: any) => {
      cb.apply(null, data);
    });
  }
};

provide('dashboardEventBus', dashboardEventBus);

</script>

<style lang="scss">
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
}
.dashboard-page {
  box-sizing: border-box;
  height: 100%;
  font-family: PingFangSC;
  font-size: 32rpx;
  line-height: 1.4;
  font-weight: 500;
  color: #1D2129;
  background-color: #f8fafc;
}
.widget-list {
  box-sizing: border-box;
  padding: 32rpx 24rpx;
  height: calc(100% - var(--status-bar-height));
  :last-child {
    margin-bottom: 0;
  }
}
</style>
