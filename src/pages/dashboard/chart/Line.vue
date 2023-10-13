<template>
  <Echart :options="options" @click:item="onChartClick" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Echart from './Echart.vue';
import { getLegend, getSeries, getXAxis, getYAxis, seriesColor } from './Chart';
import { DB_WIDGET } from './constants';
import { DisplayLineType } from '@/types/chart';

interface Props {
  id: string;
  type: DB_WIDGET;
  name: string;
  layout: any;
  source: any;
  parentId: string;
  data: any;
  errText: string;
  imgType: number;
}
const props = defineProps<Props>();
const emit = defineEmits(['click:chart']);
function onChartClick(e: any, options: any) {
  console.log(options);
  emit('click:chart', {
    key: options.xAxis.data[e.dataIndex].key,
    label: options.xAxis.data[e.dataIndex].value
  });
}

const options = computed(() => {
  const { data, source, layout, type } = props;
  const { dimension, quota } = source;
  const chartConfig = layout.chartConfig;

  const result: any = {
    color: seriesColor,
    legend: getLegend(quota),
    xAxis: getXAxis(dimension, data),
    yAxis: getYAxis(),
    series: getSeries(quota, data, false, chartConfig?.showLabel !== false)
  };

  result.series.forEach((item: any) => {
    item.type = 'line';
    item.smooth = chartConfig?.displayType === DisplayLineType.CURVE || undefined;
    item.areaStyle = type === DB_WIDGET.AREA_LINE ? {} : undefined;
  });

  return result;
});

</script>
