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
import { getLegend, getSeries, getTooltip, getXAxis, getYAxis, seriesColor } from './Chart';
import { DB_WIDGET } from './constants';
import { DisplayLineType } from '@/types/chart';

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
  const { data, source, layout, type } = props;
  const { dimension, quota } = source;
  const chartConfig = layout.chartConfig;

  const result: any = {
    color: seriesColor,
    legend: getLegend(quota),
    tooltip: getTooltip(quota),
    xAxis: getXAxis(dimension, data),
    yAxis: getYAxis(),
    series: getSeries(quota, data)
  };

  result.series.forEach((item: any) => {
    item.type = 'line';
    item.smooth = chartConfig?.displayType === DisplayLineType.CURVE || undefined;
    item.areaStyle = type === DB_WIDGET.AREA_LINE ? {} : undefined;
  });

  return result;
});
const chartRef = ref<any>(null);

</script>
