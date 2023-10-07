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
import { formatQuotaValue, getLegend, getSeries, seriesColor } from './Chart';
import type { DB_WIDGET } from './constants';
import { LabelContentType } from '@/types/chart';
import type { Quota } from '@/types/dashboard';

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
  const { data, source, layout } = props;
  const { quota } = source;

  const result: any = {
    color: seriesColor,
    legend: getLegend(quota),
    tooltip: {
      show: true
    },
    series: getSeries(quota, data).map((item: any) => {
      return {
        type: 'funnel',
        name: item.name,
        data: item.data,
        sort: 'none',
        left: '0%',
        width: '80%',
        maxSize: '90%',
        gap: 1,
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            const value = labelFormatter(
              params,
              item,
              layout.chartConfig
            );
            const { seriesName, data } = params;
            const name = `${data.name} \n`;
            const label = `${seriesName}:`;
            return name + label + value;
          }
        },
        label: {
          show: layout?.chartConfig?.showLabel !== false,
          position: 'right',
          formatter(params: any) {
            return labelFormatter(params, item, layout.chartConfig);
          }
        }
      };
    })
  };

  return result;
});
const chartRef = ref<any>(null);

function labelFormatter (formatterParams: any, targetQuote: Quota, chartConfig: any) {
  const { data, name } = formatterParams;
  const { labelContent } = chartConfig ?? {};
  if (!labelContent) {
    return formatQuotaValue(data.realValue, targetQuote, true);
  };
  const showDimension = labelContent?.includes(LabelContentType.Dimension);
  const showQuota = labelContent?.includes(LabelContentType.Quota);
  const dimensionLabel = showDimension ? name + ': ' : '';
  const quotaLabel = showQuota
    ? formatQuotaValue(data.realValue, targetQuote, true)
    : '';
  return dimensionLabel + quotaLabel;
};

</script>
