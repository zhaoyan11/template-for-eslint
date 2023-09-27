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
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getDashboard, type Dashboard } from './index.helper';

const dashboard = ref<Dashboard | null>(null);

onLoad(async(option: any) => {
  dashboard.value = await getDashboard(option.id);
  console.log(dashboard.value.widgetList);
});

</script>

<style lang="scss">
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
}
.dashboard-page {
  font-family: PingFangSC;
  font-size: 32rpx;
  line-height: 1.4;
  font-weight: 500;
  color: #1D2129;
  background-color: #f8fafc;
}
.widget-list {
  padding: 0 24rpx;
}
</style>
