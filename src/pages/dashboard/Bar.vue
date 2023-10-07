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
import { DisplayBarType } from '@/types/chart';

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

  const showPercentage = chartConfig?.displayType === DisplayBarType.PercentStacked;
  const isStacked = [
    DisplayBarType.PercentStacked,
    DisplayBarType.Stacked
  ].includes(chartConfig?.displayType as DisplayBarType);

  const result: any = {
    color: seriesColor,
    legend: getLegend(quota),
    tooltip: getTooltip(quota, showPercentage),
    xAxis: getXAxis(dimension, data),
    yAxis: getYAxis(showPercentage),
    series: getSeries(quota, data, showPercentage)
  };

  result.series.forEach((item: any) => {
    item.type = 'bar';
    item.stack = isStacked ? 'total' : undefined;
  });

  if (type === DB_WIDGET.HORIZONTAL_BAR) {
    const t = result.xAxis;
    result.xAxis = result.yAxis;
    result.yAxis = t;
  }

  return result;
});
const chartRef = ref<any>(null);

</script>
