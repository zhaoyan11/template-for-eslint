<template>
  <view class="text-container" v-html="props.layout?.text"></view>
</template>

<script lang="ts" setup>
interface Props {
  layout: any;
}

const props = defineProps<Props>();
</script>

<style lang="scss" scoped>
.text-container {
  overflow: auto;
  padding: 32rpx;
  word-break: break-all;
  max-height: 600rpx;
}

</style>
