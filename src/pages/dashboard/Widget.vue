<template>
  <CompName
    v-if="data"
    v-bind="$props"
    :data="data"
    :imgType="imgType"
    :errText="errText">
  </CompName>
</template>
<script setup lang="ts">
import Gauge from './Gauge.vue';
import Radar from './Radar.vue';
import Bar from './Bar.vue';
import Line from './Line.vue';
import Pie from './Pie.vue';
import Funnel from './Funnel.vue';
// import Quota from './Quota.vue';
// import Table from './Table.vue';
// import Text from './Text.vue';
// import Img from './Img.vue';
// import Iframe from './Iframe.vue';
// import Filter from './Filter.vue';
import { computed, onMounted, ref, toRefs, type Ref } from 'vue';
import { DB_WIDGET, QUOTA_GATHER_SUM_FIELD, SORT_TYPE } from './constants';
import { checkConfig, handleDbParams, interval } from './Widget';
import { getChartDataReq } from '@/api/modules/dashboard';
// import { isJson } from '@/utils';

interface Props {
  id: string;
  styleConfig: any;
  name: string;
  source: any;
  chartId?: number;
  classify: any;
  type: DB_WIDGET;
  runComp?: string;
  layout: any;
  parentId: string;
  listId: number;
  children: any[];
  chartFilter: any;
}

const props = defineProps<Props>();

const { layout, source } = toRefs(props);
const data: Ref<any[] | number | null> = ref(null);
const isLoading: Ref<boolean> = ref(false);
const errText = ref('');
const imgType = ref(0);

function sort(data: any[]): any[] {
  if (!Array.isArray(data)) {
    return data;
  }
  const sortParams = layout.value.sort;
  if (!sortParams?.id || sortParams.type === SORT_TYPE.DEFAULT) {
    return data;
  }
  data = JSON.parse(JSON.stringify(data));
  const { quota, dimension } = source.value;
  let sortField = dimension.find((item: any) => item.id === sortParams.id);
  let isDimensionField = true;
  if (!sortField) {
    isDimensionField = false;
    sortField = quota.find((item: any) => item.id === sortParams.id);
  }

  // 指标都用数字排序， 维度的number类型用数字， 其他用localeCompare
  if (
    !isDimensionField || QUOTA_GATHER_SUM_FIELD.includes(sortField.inputType)
  ) {
    data.sort((a, b) => {
      const aVal = a[sortParams.id];
      const bVal = b[sortParams.id];
      return sortParams.type === SORT_TYPE.ASC ? aVal - bVal : bVal - aVal;
    });
    return data;
  }

  data.sort((a, b) => {
    let aVal = a[sortParams.id];
    let bVal = b[sortParams.id];
    aVal = String(aVal);
    bVal = String(bVal);
    return sortParams.type === SORT_TYPE.ASC
      ? aVal?.localeCompare(bVal)
      : bVal?.localeCompare(aVal);
  });

  return data;
}

const CompName = computed(() => {
  const map: any = {
    [DB_WIDGET.BAR]: Bar,
    [DB_WIDGET.HORIZONTAL_BAR]: Bar,
    [DB_WIDGET.LINE]: Line,
    [DB_WIDGET.AREA_LINE]: Line,
    [DB_WIDGET.PIE]: Pie,
    [DB_WIDGET.FUNNEL]: Funnel,
    [DB_WIDGET.GAUGE]: Gauge,
    [DB_WIDGET.RADAR]: Radar
  };
  return map[props.type];
});

async function loadData() {
  const widget = props;
  if (widget.runComp === 'Table') {
    return;
  }
  if (!checkConfig(widget)) {
    return;
  }
  isLoading.value = true;
  const params = handleDbParams(JSON.parse(JSON.stringify(widget)));
  const { data: widgetData } = await getChartDataReq(params);
  // widgetData = sort(widgetData);
  // widgetData.forEach((item: any) => {
  //   Object.keys(item).forEach(key => {
  //     if (isJson(item[key]?.label)) {
  //       const json = JSON.parse(item[key].label);
  //       if (Array.isArray(json)) {
  //         item[key].label = json.join(',');
  //       } else {
  //         item[key].label = json.name + json.detail;
  //       }
  //     } else if (typeof item[key]?.label === 'number') {
  //       item[key].label = String(item[key].label);
  //     }
  //     if (isJson(item[key]?.value)) {
  //       item[key].value = JSON.parse(item[key].value);
  //     }
  //   });
  // });
  const nTerms = layout.value.nTerms;
  if (nTerms > 0) {
    data.value = widgetData.slice(0, nTerms);
  } else {
    data.value = widgetData;
  }
  isLoading.value = false;
};

onMounted(() => {
  loadData();
  initTimer();
});

// 定时刷新
function initTimer() {
  const gap = layout.value.reload;
  if (gap <= 0) {
    return;
  }
  if (props.classify !== 1 || props.type === DB_WIDGET.TABLE) {
    return;
  }
  interval(loadData, gap * 1000);
}

</script>
<style lang="scss">
.chart-container {
  margin: 32rpx 0 38rpx;
  border-radius: 23rpx;
  padding: 32rpx 24rpx;
  background-color: #fff;
  .top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .title {
    font-size: 32rpx;
  }
  .chart {
    margin-top: 32rpx;
  }
}
</style>
