import { getDashboardReq } from '@/api/modules/dashboard';
import dayjs from 'dayjs';
import { DB_WIDGET } from './chart/constants';

export const getFormatValue = (time: string, type: string, index: number) => {
  if (!time) return '';
  const outputFormat = 'YYYY-MM-DD HH:mm:ss';
  if (type === 'ymdhm') return dayjs(time).format(outputFormat);
  let timeType: any = 'day';
  switch (type) {
  case 'ymdhms':
    return time;
  case 'hms':
    return time;
  case 'hm':
    if (index === 0) {
      return time + ':00';
    }
    return time + ':59';
  }

  switch (type) {
  case 'y':
    timeType = 'year';
    break;
  case 'ym':
    timeType = 'month';
    break;
  case 'ymd':
    timeType = 'day';
    break;
  }

  const startTime = dayjs(time).startOf(timeType).format(outputFormat);
  const endTime = dayjs(time).endOf(timeType).format(outputFormat);
  return index === 0 ? startTime : endTime;
};

function hasValidItem(data: any) {
  if (!Array.isArray(data)) {
    return false;
  }
  return data.some(item => !!item);
};

const changeValue = (data: any) => {
  let value = data.value;
  if (data.type === 'DATE' && data.condition !== 'DYNAMIC') {
    value = value.map((item: string, index: number) => {
      return getFormatValue(item, data.dateTimeFormat, index);
    });
    if (data.condition === 'RANGE') {
      value[0] = value[0] ?? '';
      value[1] = value[1] ?? '';
    }
  }
  return value;
};

export interface Dashboard {
  name: string;
  widgetList: any[];
}

// 图表类型的组件
export interface ChartWidget {
  widgetType: DB_WIDGET;
}

export interface FilterWidget {
  widgetType: DB_WIDGET;
}

export type Widget = ChartWidget | FilterWidget

export async function getDashboard(id: string): Promise<Dashboard> {
  const dashboard: Dashboard = {
    name: '',
    widgetList: []
  };

  const { data } = await getDashboardReq(id);
  if (!data) {
    return dashboard;
  }
  dashboard.name = data.name || '';
  dashboard.widgetList = data.componentConfigs;
  const filterWidgetList = data.componentConfigs.filter(isValidFilter);
  if (Array.isArray(dashboard.widgetList)) {
    dashboard.widgetList.forEach((item: any) => {
      item.listId = item.id;
      item.id = item.componentKey;
      delete item.componentKey;
      item.classify = item.componentType;
      delete item.componentType;
      item.type = item.chartType;
      delete item.chartType;
      item.layout = JSON.parse(item.layoutConfig);// 设计页面的高级设置-功能配置：如柱状图堆叠、图例显示位置、显示前n条、定时刷新等
      item.styleConfig = JSON.parse(item.styleConfig);
      delete item.styleConfig;
      item.source = item.chartConfig;// 维度、指标、过滤、筛选、下钻等配置项
      delete item.chartConfig;
      const sort = item.source?.sort;
      if (item.source) {
        delete item.source.page;
        delete item.source.type;
        delete item.source.gatherType;
        delete item.source.sort;
        item.chartId = item.source.id;
        delete item.source.id;
        item.source.formId = item.source.targetId;
        delete item.source.targetId;
        item.source.quota = item.source.quota.map((item: any) => {
          item.display = item.display ? JSON.parse(item.display) : '';
          return item;
        });
        // 配置文本组件筛选条件
        item.source.filtersText = [];
        filterWidgetList.forEach((item: any) => {
          const defaultValue = item.chartFilter.defaultValue;
          const filterTargetAry = item.chartFilter.target;
          filterTargetAry.forEach((targetItem: any) => {
            const { type, field, componentKey, collectId } = targetItem;
            const case1 = type === 1 && field && componentKey === item.id; // 作用到图表上
            const case2 = type === 2 && field && item.source.collectId === collectId && item.source.quota.length; // 作用到数据集上
            if (case1 || case2) {
              item.source.filtersText.push({
                condition: defaultValue?.condition ?? 'CONTAINS',
                field: targetItem.field,
                type: defaultValue.type,
                value: changeValue(defaultValue)
              });
            }
          });
        });
        try {
          item.source.originDimension = [...item.source.dimension];
          item.source.originFilters = JSON.parse(JSON.stringify(item.source.filter));
        } catch (e) {
          item.source.originDimension = [];
          item.source.originFilters = null;
        }
      }

      if (item.layout) {
        item.runComp = item.layout.runComp;
        delete item.layout.runComp;
        item.configComp = item.layout.configComp;
        delete item.layout.configComp;
        item.silent = item.layout.silent;
        delete item.layout.silent;
        item.layout.sort = null;
        if (sort) {
          item.layout.sort = {
            id: sort.id,
            type: sort.type
          };
        }
      }

      if (item.parentId === '0') {
        item.parentId = '';
      }
    });
  } else {
    dashboard.widgetList = [];
  }

  dashboard.widgetList = buildTree(dashboard.widgetList);
  return dashboard;
};

function buildTree(widgetList: any[]): any[] {
  if (!Array.isArray(widgetList)) {
    return [];
  }
  const hashMap: any = {};
  for (let i = 0; i < widgetList.length; i++) {
    const widget = widgetList[i];
    hashMap[widget.id] = widget;
  }
  const result: any[] = [];
  for (let i = 0; i < widgetList.length; i++) {
    const widget = widgetList[i];
    if ([
      // 栅格布局组件，扔掉
      DB_WIDGET.GRID,
      DB_WIDGET.GRID_PANE
    ].includes(widget.type)) {
      continue;
    }

    const parent = hashMap[widget.parentId];
    if (!parent) {
      // 普通顶层组件
      result.push(widget);
      continue;
    }
    if (parent.type === DB_WIDGET.GRID_PANE) {
      // 如果是在grid组件中的元素，就放到和grid平级的位置
      const grid = hashMap[parent.parentId];
      if (!hashMap[grid.parentId]) {
        // 当前栅格是顶层组件
        result.push(widget);
      } else {
        hashMap[grid.parentId].children = hashMap[grid.parentId].children || [];
        hashMap[grid.parentId].children.push(widget);
      }
      continue;
    }
    if (parent.type === DB_WIDGET.TAB_COL || parent.type === DB_WIDGET.TAB) {
      parent.children = parent.children || [];
      parent.children.push(widget);
    }
  }
  return result;
}

/**
 * 判断是不是filter类型的widget
 * @param widget
 * @returns
 */
function isValidFilter(widget: any): boolean {
  if (!widget) {
    return false;
  }
  const map: any = {
    FilterText: true,
    FilterNumber: true,
    FilterDate: true,
    FilterSelect: true
  };
  try {
    const configComp = JSON.parse(widget.layoutConfig).configComp;
    if (map[configComp]) {
      const defaultValue = widget.chartFilter.defaultValue;
      return hasValidItem(defaultValue.value);
    }
  } catch (e) {
  }
  return false;
}
