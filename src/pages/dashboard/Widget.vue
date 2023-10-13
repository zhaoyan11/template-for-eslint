<template>
  <component class="widget" :is="comp" v-bind="$props" />
</template>
<script setup lang="ts">
import Chart from './chart/Index.vue';
import Text from './Text.vue';
import Img from './Img.vue';
import WebPage from './WebPage.vue';
import Tab from './Tab.vue';
import Filter from './Filter.vue';
import { computed } from 'vue';
import { DB_WIDGET } from './chart/constants';

interface Props {
  id: string;
  styleConfig: any;
  name: string;
  source: any;
  chartId?: number;
  classify: any;
  type: DB_WIDGET;
  runComp?: string;
  layout: any;
  parentId: string;
  listId: number;
  children: any[];
  chartFilter: any;
}

const props = defineProps<Props>();

const comp = computed(() => {
  const map: any = {
    [DB_WIDGET.BAR]: Chart,
    [DB_WIDGET.HORIZONTAL_BAR]: Chart,
    [DB_WIDGET.LINE]: Chart,
    [DB_WIDGET.AREA_LINE]: Chart,
    [DB_WIDGET.PIE]: Chart,
    [DB_WIDGET.FUNNEL]: Chart,
    [DB_WIDGET.GAUGE]: Chart,
    [DB_WIDGET.RADAR]: Chart,
    [DB_WIDGET.QUOTA]: Chart,
    [DB_WIDGET.TABLE]: Chart,
    [DB_WIDGET.TEXT]: Text,
    [DB_WIDGET.IMG]: Img,
    [DB_WIDGET.IFRAME]: WebPage,
    [DB_WIDGET.FILTER_DATE]: Filter,
    [DB_WIDGET.FILTER_NUMBER]: Filter,
    [DB_WIDGET.FILTER_SELECT]: Filter,
    [DB_WIDGET.FILTER_TEXT]: Filter,
    [DB_WIDGET.TAB]: Tab
  };
  return map[props.type];
});

</script>

<style lang="scss" scoped>
.widget {
  overflow: hidden;
  margin: 0 0 32rpx;
  border-radius: 24rpx;
  background-color: #fff;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
