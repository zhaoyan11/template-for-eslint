<template>
  <view class="content">
    <!-- 状态栏占位高度, 勿删 -->
    <view class="status_bar"></view>
    <view>工作台</view>
    <button @click="handleToProcess">流程中心</button>
    <button @click="handleToDashboard">仪表盘</button>
  </view>
</template>

<script setup lang="ts">
import { getUserInfo } from '@/api/modules/user';

getUserInfo();

const handleToProcess = () => {
  uni.navigateTo({ url: '/pages/process/index' });
};
const handleToDashboard = () => {
  uni.navigateTo({ url: '/pages/dashboard/index?id=530' });
};
</script>

<style lang="scss">
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
}
</style>
