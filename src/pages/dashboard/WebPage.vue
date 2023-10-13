<template>
  <view class="webpage-container">
    <web-view
      v-if="effectiveSrc"
      :fullscreen="false"
      :src="effectiveSrc">
    </web-view>
    <view v-else class="blank-page"></view>
  </view>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import type { IframeLayout } from '@/types/dashboard';

interface Props {
  layout: IframeLayout;
}

const props = defineProps<Props>();
const effectiveSrc = computed(() => {
  const reg = /^(http|https):\/\/([\w.]+\/?)\S*$/gi;
  const src = props.layout.src;
  return reg.test(src) ? src : '';
});
</script>

<style lang="scss" scoped>
.webpage-container {
  overflow: auto !important;
  :deep(iframe) {
    border: 0;
    width: 100% !important;
    height: 600rpx !important;
  }
  .blank-page {
    overflow: hidden;
    border: 1px dashed rgba(126, 134, 142, 0.16);
    height: 600rpx;
    background: #F2F2F6;
    border-radius: 24rpx;
  }
}
</style>
