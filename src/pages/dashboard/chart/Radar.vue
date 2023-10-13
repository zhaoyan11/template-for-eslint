<template>
  <Echart :options="options" @click:seriesItem="onChartClick" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Echart from './Echart.vue';
import { formatQuotaValue, seriesColor } from './Chart';
import type { DB_WIDGET } from './constants';
import { DisplayRadarType } from '@/types/chart';

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
  isHorizonBar: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits(['click:chart']);
function onChartClick(e: any, options: any) {
  try {
    emit('click:chart', {
      key: options.radar.indicator[e.event.topTarget.__dimIdx].key, // 有些点击区域获取不到__dimIdx属性
      label: options.radar.indicator[e.event.topTarget.__dimIdx].name
    });
  } catch (e) {}
}

const options = computed(() => {
  const { data, source, layout } = props;
  const { dimension, quota } = source;
  const chartConfig = layout.chartConfig;
  const dimensionId = dimension[0].id;

  const maxValueOfAllQuota = getMaxValueOfAllQuota(quota, data);
  const { maxScale, splitNumber } = getRadarConfig(maxValueOfAllQuota);

  const result: any = {
    color: seriesColor,
    radar: {
      splitNumber,
      indicator: data.map((item: any) => {
        return {
          name: item[dimensionId]?.label || 'null',
          key: item[dimensionId]?.value,
          max: maxScale,
          color: '#1D2129'
        };
      })
    },
    legend: {
      type: 'scroll',
      data: quota.map((item: any) => ({ name: item.alias })),
      // bottom: 0,
      textStyle: {
        fontFamily: 'PingFangSC',
        fontSize: uni.upx2px(24),
        lineHeight: uni.upx2px(40),
        color: '#1D2129'
      }
    },
    // tooltip: {
    //   show: true,
    //   trigger: 'item',
    //   confine: true,
    //   formatter: (params: any) => {
    //     const { name, value } = params;
    //     let str = '';
    //     value.forEach((item: any, index: number) => {
    //       const labelName = result.radar.indicator[index].name;
    //       const targetQuota = quota.find((q: any) => q.alias === name);
    //       const formatterValue = formatQuotaValue(item, targetQuota, true);
    //       const currentLabel = `${labelName}: ${formatterValue}`;
    //       str += `\n${currentLabel}`;
    //     });
    //     return `${params.name} ${str}`;
    //   }
    // },
    series: [
      {
        type: 'radar',
        name: quota.alias,
        areaStyle: chartConfig?.displayType === DisplayRadarType.Fill ? {} : null,
        label: {
          show: chartConfig?.showLabel !== false,
          color: '#1D2129',
          formatter(params: any) {
            const targetQueue = quota.find((item: any) => item.alias === params.name);
            if (targetQueue) {
              return formatQuotaValue(params.value, targetQueue, true);
            };
            return params.value;
          }
        },
        data: quota.map((q: any) => {
          return {
            name: q.alias,
            value: data.map((item: any) => item[q.id]?.value)
          };
        })
      }
    ]
  };

  return result;
});

/**
 * 查找所有指标都所有数据中的最大值
 * @param quota
 * @param data
 */
function getMaxValueOfAllQuota(quota: any[], data: any[]): number {
  let max = Number.NEGATIVE_INFINITY;
  quota.forEach((q: any) => {
    data.forEach((item: any) => {
      if (item[q.id].value > max) {
        max = item[q.id].value;
      }
    });
  });
  return max;
}

/**
 * 根据数据获取雷达图的 轴间距、分割数和最大刻度
 */
function getRadarConfig(num: number) {
  const arr = [2, 5, 10];
  // 转为科学计数法的形式
  const p = Math.floor(Math.log(num / 5) / Math.LN10);
  const n = (num / 5) * 10 ** -p;

  // 获取间距
  let interval = 0;
  arr.some((item: any) => {
    if (item > n) {
      interval = item * 10 ** p;
      // 四舍五入去除精度问题, 保留的小数位数等于 p
      interval = -(-interval.toFixed(Math.max(0, -p)));
      return true;
    }
    return false;
  });

  // 获取最大刻度值
  let maxScale =
    num % interval ? Math.ceil(num / interval) * interval : num + interval;
  maxScale = -(-maxScale.toFixed(Math.max(0, -p)));

  // 获取轴的分段数
  const splitNumber = Math.round(maxScale / interval);

  return {
    interval,
    maxScale,
    splitNumber
  };
}
</script>

<style lang="scss" scoped>
</style>
