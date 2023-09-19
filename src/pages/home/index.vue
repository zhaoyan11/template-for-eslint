<template>
  <view class="content">
    <!-- 状态栏占位高度, 勿删 -->
    <view class="status_bar"></view>
    <view>工作台</view>
    <button @click="handleToProcess">流程中心</button>
  </view>
</template>

<script setup lang="ts">
import { getUserInfo } from '@/api/modules/user';

getUserInfo();

const handleToProcess = () => {
  uni.navigateTo({ url: '/pages/process/index' });
};
</script>

<style lang="scss">
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
}
</style>
