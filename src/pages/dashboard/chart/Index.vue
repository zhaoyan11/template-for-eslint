<template>
  <view class="chart-container">
    <view class="title-row">
      <view class="title">{{ name }}</view>
      <ChartTools
        class="tools"
        :layout="layout"
        :source="source"
        @download="download"
        @expand="download"
      />
    </view>
    <view class="sub-dimension" v-if="dimensionBreadcrumb.length">
      <text class="dimension-nav-text" @click="onDimesionNavClick(0)">全部</text>
      <text
        v-for="(item, index) in dimensionBreadcrumb"
        :key="index"
        class="dimension-nav-text"
        @click="onDimesionNavClick(index+1)">
        <text class="iconfont icon-angle-right-small"></text><text>{{ item }}</text>
      </text>
    </view>
    <component
      v-if="data"
      v-bind="props"
      :data="data"
      class="chart"
      ref="chartRef"
      :is="currentChart"
      @click:chart="onChartClick"
    />
  </view>
</template>
<script setup lang="ts">
import Gauge from './Gauge.vue';
import Radar from './Radar.vue';
import Bar from './Bar.vue';
import Line from './Line.vue';
import Pie from './Pie.vue';
import Funnel from './Funnel.vue';
import Table from './Table.vue';
import Quota from './Quota.vue';
import ChartTools from './ChartTools.vue';

import { computed, inject, onMounted, ref, type Ref } from 'vue';
import { DB_WIDGET, FORM_FILTER_CONF } from './constants';
import { checkConfig, handleDbParams, interval } from '../Widget';
import { downloadChart, getChartDataReq } from '@/api/modules/dashboard';
import { dateFormat, isJson } from '@/utils';
import { FiltersCondition } from '@/types/dashboard';

interface Props {
  id: string;
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
const dashboardEventBus = inject<any>('dashboardEventBus');
const data: Ref<any[] | number | null> = ref(null);

const currentChart = computed(() => {
  const map: any = {
    [DB_WIDGET.BAR]: Bar,
    [DB_WIDGET.HORIZONTAL_BAR]: Bar,
    [DB_WIDGET.LINE]: Line,
    [DB_WIDGET.AREA_LINE]: Line,
    [DB_WIDGET.PIE]: Pie,
    [DB_WIDGET.FUNNEL]: Funnel,
    [DB_WIDGET.GAUGE]: Gauge,
    [DB_WIDGET.RADAR]: Radar,
    [DB_WIDGET.QUOTA]: Quota,
    [DB_WIDGET.TABLE]: Table
  };
  return map[props.type];
});

onMounted(() => {
  loadData();
  initTimer();
});

async function loadData() {
  const widget = props;
  if (widget.runComp === 'Table') {
    return;
  }
  if (!checkConfig(widget)) {
    return;
  }

  const params = handleDbParams(JSON.parse(JSON.stringify(widget)));
  let { data: widgetData } = await getChartDataReq(params);
  if (Array.isArray(widgetData)) {
    // TODO:    指标、仪表图 是个map
    widgetData.forEach((item: any) => {
      Object.keys(item).forEach(key => {
        if (isJson(item[key]?.label)) {
          const json = JSON.parse(item[key].label);
          if (Array.isArray(json)) {
            item[key].label = json.join(',');
          } else {
            item[key].label = json.name + json.detail;
          }
        } else if (typeof item[key]?.label === 'number') {
          item[key].label = String(item[key].label);
        }
        if (isJson(item[key]?.value)) {
          item[key].value = JSON.parse(item[key].value);
        }
      });
    });
  }
  const nTerms = props.layout.nTerms;
  if (nTerms > 0) {
    widgetData = widgetData.slice(0, nTerms);
  }
  data.value = widgetData;
}

async function download() {
  if (props.listId) {
    const charts = handleDbParams(props);
    (charts as any).id = props.listId;
    const res = await downloadChart(charts);
    const blob = res.data as any;
    const url = URL.createObjectURL(
      new Blob([blob], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    );
    const link = document.createElement('a');
    link.href = url;
    const date = dateFormat(new Date(), 'YYYYmmdd_HH_MM_SS');
    const downloadName = `${props.name}_${date}.xlsx`;
    link.setAttribute('download', downloadName);
    link.click();
    URL.revokeObjectURL(url);
  }
}

// 定时刷新
function initTimer() {
  const gap = props.layout.reload;
  if (gap <= 0) {
    return;
  }
  if (props.classify !== 1 || props.type === DB_WIDGET.TABLE) {
    return;
  }
  interval(loadData, gap * 1000);
}

function onChartClick(item: { key: string; label: string }) {
  saveUserChoice(item);
  const filters = getUserFilters();
  goNextDimension(filters);
  sendLinkageEvent(filters);
}

function onDimesionNavClick(index: number) {
  const filters = getUserFilters(index - 1);
  console.log(index, filters);
  goDimension(index, filters);
  sendLinkageEvent(filters);
}

const {
  saveUserChoice,
  goNextDimension,
  goDimension,
  dimensionBreadcrumb,
  sendLinkageEvent,
  getUserFilters
} = useDrilldownAndLinkage();

function useDrilldownAndLinkage() {
  const mainDimension = props.source.originDimension[0];
  const drillDownDimensions = props.source.drillDownDimension || [];
  const allDimensions = [mainDimension, ...drillDownDimensions];
  const currentDimensionIndex = ref(0);

  function saveUserChoice(selectedItem: { key: string; label: string}) {
    if (currentDimensionIndex.value < allDimensions.length) {
      const currentDimension = allDimensions[currentDimensionIndex.value];
      currentDimension.selectedItem = selectedItem;
    }
  }

  function getUserFilters(index = currentDimensionIndex.value) {
    const filters = [];
    for (let i = 0; i <= index; i++) {
      const d = allDimensions[i];
      filters.push(
        _generateFilter(d, d.selectedItem.key)
      );
    }
    return filters;
  }

  function _generateFilter(dimension: any, value: any): any {
    const inputType = dimension.inputType;
    const conf = (FORM_FILTER_CONF as any)[inputType];
    const result = {
      field: dimension.field, // 维度的字段名
      fieldType: inputType,
      value,
      condition: conf.filterCondition,
      type: conf.outType
    };
    if (!Array.isArray(value)) {
      result.value = [value];
    }
    if (value === null || value === 'null' || value === undefined || value === '') {
      result.condition = 'NULL';
      result.value = [];
    }
    return result;
  }

  /** =================== 下钻 ================== */
  const dimensionBreadcrumb = computed(() => {
    const result = [];
    for (let i = 0; i < currentDimensionIndex.value; i++) {
      result.push(allDimensions[i].selectedItem.label);
    }
    return result;
  });

  async function goDimension(index: number, filters: any[]) {
    if (index >= allDimensions.length || index === currentDimensionIndex.value) {
      return;
    }
    const originFilterConf = JSON.parse(JSON.stringify(props.source.originFilters)) || {
      filters: [],
      attachTableFilters: [],
      filtersCondition: FiltersCondition.And
    };
    originFilterConf.filters.push(...filters);
    props.source.filter = originFilterConf;
    props.source.dimension = [allDimensions[index]];
    currentDimensionIndex.value = index;
    await loadData();
  }

  function goNextDimension(filters: any[]) {
    if (currentDimensionIndex.value >= allDimensions.length - 1) {
      return;
    }
    const currentDimension = allDimensions[currentDimensionIndex.value];
    if (!(FORM_FILTER_CONF as any)[currentDimension.inputType]) {
      return;
    }
    goDimension(currentDimensionIndex.value + 1, filters);
  }

  /** =================== 联动 ================== */
  dashboardEventBus.on('linkage', (e: any) => {
    if (e.from === props.id) {
      return;
    }
    if (e.target.includes(props.id)) {
      props.source.filter.filters = e.filters;
      loadData();
    }
  });

  function sendLinkageEvent(filters: any[]) {
    if (props.layout.linkage) {
      dashboardEventBus.emit('linkage', {
        from: props.id,
        target: props.layout.linkage,
        filters
      });
    }
  }
  return {
    sendLinkageEvent,
    goNextDimension,
    goDimension,
    saveUserChoice,
    dimensionBreadcrumb,
    getUserFilters
  };
}
</script>

<style lang="scss" scoped>
.chart-container {
  // margin: 0 0 32rpx;
  // border-radius: 24rpx;
  padding: 32rpx 24rpx;
  // background-color: #fff;
  :deep(.title-row) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  :deep(.title) {
    font-size: 32rpx;
    font-weight: 500;
  }
  :deep(.chart) {
    margin-top: 32rpx;
  }
  .sub-dimension {
    margin: 30rpx 0;
    * {
      vertical-align: middle;
    }
  }
  .icon-angle-right-small {
    font-size: 48rpx;
    line-height: 48rpx;
    color: rgba(0, 0, 0, .4);
  }
  .dimension-nav-text {
    font-size: 32rpx;
    line-height: 48rpx;
    color: #447FFC;
    &:last-child {
      color: rgba(0, 0, 0, .4);
    }
  }
}
</style>
