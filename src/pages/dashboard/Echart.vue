<template>
    <l-echart ref="chartRef" />
</template>

<script setup lang="ts">
import LEchart from '@/uni_modules/lime-echart_0.8.1/components/l-echart/l-echart.vue';
import { onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts/core';
import { LineChart, BarChart, PieChart, FunnelChart, GaugeChart, RadarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, DatasetComponent, TransformComponent, LegendComponent } from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LineChart,
  BarChart,
  LabelLayout,
  PieChart,
  FunnelChart,
  GaugeChart,
  RadarChart,
  UniversalTransition,
  CanvasRenderer
]);

interface Props {
  options: any
}

const props = defineProps<Props>();

const chartRef = ref<any>(null);
const chartInstance = ref<any>(null);

onMounted(() => {
  chartRef.value.init(echarts, (chart: any) => {
    chartInstance.value = chart;
    chart.setOption(props.options);
  });
});

watch(
  () => props.options,
  next => {
    if (chartInstance.value) {
      chartInstance.value.setOption(next);
    }
  }
);

defineExpose({
  chartInstance
});

</script>
