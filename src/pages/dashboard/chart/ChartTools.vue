<template>
  <view>
    <text class="iconfont icon-link-broken" v-if="showUnlink"></text>
    <text class="iconfont icon-download" v-if="showDownload" @click="$emit('download')"></text>
    <text class="iconfont icon-exchange-vertical"></text>
    <text class="iconfont icon-arrows-expand1" @click="$emit('expand')"></text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  layout: any;
  source: any;
}

const props = defineProps<Props>();

const showDownload = computed<boolean>(() => {
  if (!props.layout.download) {
    return false;
  }
  return props.source.dimension.length > 0 || props.source.quota.length > 0;
});

const showUnlink = computed(() => {
  return !!props.layout.linkage?.length && !!props.source.dimension.length;
});

</script>

<style lang="scss" scoped>

.tools {
  .iconfont {
    margin-left: 47.5rpx;
    font-size: 32rpx;
    line-height: 1;
    color: #94A3B8;
  }
}
</style>
