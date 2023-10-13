<template>
  <view class="tab-container">
    <view class="tab-item" v-for="(item, index) in children" :key="index">
      {{ item.name }}
    </view>
  </view>
</template>
<script lang="ts" setup>
import type { DbConfig, TabLayout } from '@/types/dashboard';
import { onMounted } from 'vue';

interface Props {
  id: string;
  layout: TabLayout;
  children: DbConfig[];
  parentId: string;
}

const props = defineProps<Props>();
onMounted(() => {
  console.log(props);
});
</script>
<style lang="scss" scoped>
.tab-container {
  display: flex;
}
</style>
