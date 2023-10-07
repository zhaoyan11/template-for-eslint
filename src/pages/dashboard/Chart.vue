<template>
  <view class="chart-container">
    <view class="row">
      <view class="title">{{ name }}</view>
      <view class="tools">
        <text class="iconfont icon-link-broken"></text>
        <text class="iconfont icon-download"></text>
        <text class="iconfont icon-exchange-vertical"></text>
        <text class="iconfont icon-arrows-expand1"></text>
      </view>
    </view>
    <l-echart class="chart" ref="chartRef" />
  </view>
</template>

<script setup lang="ts">
import LEchart from '@/uni_modules/lime-echart_0.8.1/components/l-echart/l-echart.vue';
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts/core';
import { LineChart, BarChart, PieChart, FunnelChart, GaugeChart, RadarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, DatasetComponent, TransformComponent, LegendComponent } from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { getOptions } from './Chart';
import type { DB_WIDGET } from './constants';

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
  id: string;
  type: DB_WIDGET;
  styleConfig: any;
  name: string;
  layout: any;
  source: any;
  parentId: string;
  data: any[] | any;
  errText: string;
  imgType: number;
  isHorizonBar: boolean;
}
const props = defineProps<Props>();

const chartRef = ref<any>(null);
onMounted(() => {
  console.log('props.data', props.data);
  chartRef.value.init(echarts, (chart: any) => {
    chart.setOption(getOptions(props));
    chart.on('click', 'series', (e: any) => {
      console.log(e);
      console.log(props);
    });
  });
});

</script>

<style lang="scss" scoped>
.chart-container {
  margin: 32rpx 0 38rpx;
  border-radius: 23rpx;
  padding: 32rpx 24rpx;
  background-color: #fff;
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  font-size: 32rpx;
}
.tools {
  .iconfont {
    margin-left: 47.5rpx;
    font-size: 32rpx;
    line-height: 1;
    color: #94A3B8;
  }
}
.chart {
  margin-top: 32rpx;
}
</style>
