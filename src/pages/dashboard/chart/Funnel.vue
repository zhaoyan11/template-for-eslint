<template>
  <Echart :options="options" @click:seriesItem="onChartClick" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Echart from './Echart.vue';
import { formatQuotaValue, seriesColor } from './Chart';
import type { DB_WIDGET } from './constants';
import { DisplayFunnelType, FunnelSlopeType, LabelContentType } from '@/types/chart';
import type { Quota } from '@/types/dashboard';

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
  emit('click:chart', {
    key: options.series[e.seriesIndex].data[e.dataIndex].key,
    label: options.series[e.seriesIndex].data[e.dataIndex].name
  });
}

const options = computed(() => {
  const { data, source, layout } = props;
  const { quota } = source;
  const chartConfig = layout.chartConfig;
  const dimensionId = source.dimension[0].id;
  const result: any = {
    color: seriesColor,
    legend: {
      type: 'scroll',
      data: data.map((item: any) => {
        return {
          name: item[dimensionId]?.label || 'null'
        };
      }),
      // bottom: 0,
      textStyle: {
        fontFamily: 'PingFangSC',
        fontSize: uni.upx2px(24),
        lineHeight: uni.upx2px(40),
        color: '#1D2129'
      }
    },
    series: [
      {
        type: 'funnel',
        name: quota[0].alias,
        sort: 'none',
        left: '10%',
        width: '80%',
        maxSize: '90%',
        gap: 1,
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            const value = labelFormatter(params, quota[0], layout.chartConfig);
            const { seriesName, data } = params;
            return `${data.name} \n${seriesName}: ${value}`;
          }
        },
        label: {
          show: layout?.chartConfig?.showLabel !== false,
          position: 'right',
          formatter(params: any) {
            return labelFormatter(params, quota[0], layout.chartConfig);
          }
        },
        data: data.map((item: any) => {
          return {
            name: item[dimensionId]?.label || 'null',
            key: item[dimensionId]?.value,
            realValue: item[quota[0].id]?.value,
            value: item[quota[0].id]?.value
          };
        })
      }
    ]
  };

  if (chartConfig?.slope !== FunnelSlopeType.Real) {
    const seriesItem = result.series[0];
    const length = seriesItem.data.length;
    seriesItem.min = chartConfig?.displayType === DisplayFunnelType.Sharp ? 0 : 10;
    seriesItem.max = length * 10;
    if (chartConfig?.displayType !== DisplayFunnelType.Sharp) {
      // 平底或者默认
      seriesItem.minSize =
          ((seriesItem.min / seriesItem.max) * 80).toFixed(2) + '%'; // 80 是因为 width: '80%',
    } else {
      // 尖底
      seriesItem.minSize = 0;
    }
    seriesItem.data.forEach((dataItem: any, index: number) => {
      dataItem.realValue = dataItem.value;
      dataItem.value = (length - index) * 10; // 显示数据根据数据的总数和索引动态计算
    });
  }
  return result;
});

function labelFormatter(
  formatterParams: any,
  targetQuote: Quota,
  chartConfig: any
) {
  const { data, name } = formatterParams;
  const { labelContent } = chartConfig ?? {};
  if (!labelContent) {
    return formatQuotaValue(data.realValue, targetQuote, true);
  }
  const showDimension = labelContent?.includes(LabelContentType.Dimension);
  const showQuota = labelContent?.includes(LabelContentType.Quota);
  const dimensionLabel = showDimension ? name + ': ' : '';
  const quotaLabel = showQuota
    ? formatQuotaValue(data.realValue, targetQuote, true)
    : '';
  return dimensionLabel + quotaLabel;
}
</script>
