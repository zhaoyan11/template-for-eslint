<template>
  <Echart :options="options" @click:seriesItem="onChartClick" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Echart from './Echart.vue';
import { getLegend, getSeries, getXAxis, getYAxis, seriesColor } from './Chart';
import { DB_WIDGET } from './constants';
import { DisplayBarType } from '@/types/chart';

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
  if (props.type === DB_WIDGET.HORIZONTAL_BAR) {
    emit('click:chart', {
      key: options.yAxis.data[e.dataIndex].key,
      label: options.yAxis.data[e.dataIndex].value
    });
  } else {
    emit('click:chart', {
      key: options.xAxis.data[e.dataIndex].key,
      label: options.xAxis.data[e.dataIndex].value
    });
  }
}

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
    xAxis: getXAxis(dimension, data),
    yAxis: getYAxis(showPercentage),
    series: getSeries(quota, data, showPercentage, chartConfig?.showLabel !== false)
  };

  result.series = result.series.map((item: any) => {
    if (type === DB_WIDGET.HORIZONTAL_BAR) {
      item.label.position = 'right';
    }
    return {
      name: item.name,
      type: 'bar',
      stack: isStacked ? 'total' : undefined,
      data: item.data,
      label: item.label
    };
  });

  if (type === DB_WIDGET.HORIZONTAL_BAR) {
    const t = result.xAxis;
    result.xAxis = result.yAxis;
    result.yAxis = t;
  }

  return result;
});
</script>
