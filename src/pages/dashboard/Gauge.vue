<template>
  <view class="chart-container">
    <view class="row">
      <view class="title">{{ name }}</view>
      <ChartTools class="tools" />
    </view>
    <Echart class="chart" ref="chartRef" :options="options" />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Echart from './Echart.vue';
import { formatQuotaValue, seriesColor } from './Chart';
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
  isHorizonBar: boolean;
}
const props = defineProps<Props>();

const options = computed(() => {
  const { data, source, layout } = props;
  const quota = source.quota[0];
  const range = getGaugeRange(layout.chartConfig, data);
  return {
    color: seriesColor,
    tooltip: {
      show: true,
      formatter: (params: any) => {
        return `${params.seriesName}: ${formatQuotaValue(params.value, quota, true)}`;
      }
    },
    series: [
      {
        type: 'gauge',
        name: quota.alias,
        radius: '100%',
        min: range.min,
        max: range.max,
        axisLabel: {
          color: '#86909C'
        },
        progress: {
          show: layout.chartConfig?.showProgress
        },
        detail: {
          color: '#86909C',
          offsetCenter: [0, '70%'],
          formatter: (value: any) => formatQuotaValue(value, quota, true)
        },
        data: [
          {
            value: data[quota.id].value ?? 0
          }
        ]
      }
    ]
  };
});

const chartRef = ref<any>(null);

function getGaugeRange(chartConfig: any, data: any) {
  let min = 0;
  let max = 100;
  if (chartConfig?.min?.type === 0) {
    min = chartConfig?.min?.inputValue ?? min;
  }
  if (chartConfig?.min?.type === 1) {
    min = data.min?.value ?? min;
  }

  if (chartConfig?.max?.type === 0) {
    max = chartConfig?.max?.inputValue ?? max;
  }
  if (chartConfig?.max?.type === 1) {
    max = data.max?.value ?? max;
  }

  return { min, max };
};
</script>

<style lang="scss" scoped>
</style>
