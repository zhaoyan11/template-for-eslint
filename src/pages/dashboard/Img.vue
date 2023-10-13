<template>
  <view class="image-container">
    <img :src="layout.src" alt="" @click="jump">
    <!-- <image
        style="width: 100%;max-height: 600rpx;"
        mode="widthFix"
        :src="layout.src"
        @error="imageError"
        @click="jump">
    </image>
    <web-view
      v-if="showWebView"
      :fullscreen="true"
      :src="layout.jump.target">
    </web-view> -->
  </view>
</template>
<script lang="ts" setup>
/**
 * 不兼容小程序，后面有需要再处理
 * 不兼容小程序，后面有需要再处理
 * 不兼容小程序，后面有需要再处理
 * 不兼容小程序，后面有需要再处理
 */
import type { ImgLayout } from '@/types/dashboard';

interface Props {
  layout: ImgLayout;
}

const props = defineProps<Props>();

function jump() {
  if (props.layout.jump.blank) {
    window.open(props.layout.jump.target, '_blank');
  } else {
    window.open(props.layout.jump.target, '_self');
  }
}
</script>
<style lang="scss" scoped>
.image-container {
  font-size: 0;
}
/* 显示规则：优先宽度100%，高度自适应，当高度超过600rpx后：高度600rpx，宽度自适应 */
img {
  width: 100%;
  max-height: 600rpx;
  object-fit: contain;
}
</style>
