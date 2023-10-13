<template>
  <Echart :options="options" @click:seriesItem="onChartClick" />
</template>
<script setup lang="ts">
import { computed } from 'vue';
import Echart from './Echart.vue';
import { formatQuotaValue, getLegend, seriesColor, toFixed } from './Chart';
import type { DB_WIDGET } from './constants';
import { DisplayPieType, LabelContentType } from '@/types/chart';

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
  const { dimension, quota } = source;
  const { chartConfig } = layout;

  const result: any = {
    color: seriesColor,
    legend: getLegend(quota),
    // tooltip: getTooltip(quota),
    series: [
      {
        type: 'pie',
        radius: '65%',
        name: quota[0].alias,
        data: data.map((item: any) => {
          const value = item[quota[0].id]?.value ?? 0;
          return {
            name: item[dimension[0].id]?.label || 'null',
            key: item[dimension[0].id]?.value,
            value
          };
        }),
        label: {
          show: chartConfig?.showLabel !== false,
          formatter: function (params: any) {
            const value = formatQuotaValue(params.value, quota[0], true);
            const labelContent = chartConfig?.labelContent;
            if (!labelContent) {
              return value;
            }
            let str = '';
            if (labelContent?.includes(LabelContentType.Dimension)) {
              str = `${params.name}: `;
            }
            if (labelContent?.includes(LabelContentType.Quota)) {
              str += value;
            }
            if (labelContent?.includes(LabelContentType.Percentage)) {
              str += ` (${toFixed(params.percent, 2, true)}%)`;
            }
            return str;
          }
        }
      }
    ]
  };

  const displayType = chartConfig?.displayType;
  if (displayType === DisplayPieType.Range) {
    result.series[0].radius = ['50%', '70%'];
  }
  if (displayType === DisplayPieType.BoldRange) {
    result.series[0].radius = ['30%', '70%'];
  }
  if (displayType === DisplayPieType.Rose) {
    result.series[0].radius = ['15%', '70%'];
    result.series[0].roseType = 'area';
    result.series[0].itemStyle = {
      borderRadius: 8
    };
  }
  return result;
});

</script>
