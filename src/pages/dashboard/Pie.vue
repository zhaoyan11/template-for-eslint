<template>
  <view class="chart-container">
    <view class="top-row">
      <view class="title">{{ name }}</view>
      <ChartTools class="tools" />
    </view>
    <Echart class="chart" ref="chartRef" :options="options" />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Echart from './Echart.vue';
import ChartTools from './ChartTools.vue';
import { getLegend, getSeries, getTooltip, seriesColor } from './Chart';
import type { DB_WIDGET } from './constants';

interface Props {
  id: string;
  type: DB_WIDGET;
  styleConfig: any;
  name: string;
  layout: any;
  source: any;
  parentId: string;
  data: any;
  errText: string;
  imgType: number;
}

const props = defineProps<Props>();

const options = computed(() => {
  const { data, source } = props;
  const { quota } = source;

  const result: any = {
    color: seriesColor,
    legend: getLegend(quota),
    tooltip: getTooltip(quota),
    series: getSeries(quota, data)
  };

  result.series.forEach((item: any) => {
    item.type = 'pie';
    item.radius = '65%';
    item.label = {
      show: false
    };
  });

  return result;
});
const chartRef = ref<any>(null);

</script>
