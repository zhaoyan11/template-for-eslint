import { getDashboardReq, getOutlinkDashboardReq } from '@/api/modules/dashboard';
import dayjs from 'dayjs';
import { DB_WIDGET } from './constants';

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

function widgetIsFilter(widget: any): boolean {
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
    return map[configComp];
  } catch (e) {
    return false;
  }
}

export interface Dashboard {
  name: string;
  widgetList: any[];
  layout: any;
}

export async function getDashboard(
  id: string,
  dbData = {},
  isOutlink = false
): Promise<Dashboard> {
  const config: Dashboard = {
    name: '',
    widgetList: [],
    layout: null
  };

  let res: any;
  if (isOutlink) {
    if (Object.keys(dbData).length === 0) {
      return config;
    };
    res = await getOutlinkDashboardReq(dbData);
  } else {
    res = await getDashboardReq(id);
  }
  const data = res?.data;
  const filterWidgetList = data.componentConfigs.filter(widgetIsFilter);
  if (data) {
    if (data.name) {
      config.name = data.name;
    }
    if (data.layoutConfig) {
      config.layout = JSON.parse(data.layoutConfig);
    } else {
      config.layout = null;
    }
    if (data.styleConfig) {
      config.layout = JSON.parse(data.styleConfig);
    } else {
      config.layout = null;
    }
    if (data.componentConfigs && data.componentConfigs.length) {
      config.widgetList = data.componentConfigs.map((item: any) => {
        item.children = [];
        item.listId = item.id;
        item.id = item.componentKey;
        item.classify = item.componentType;
        item.type = item.chartType;
        item.layout = JSON.parse(item.layoutConfig);
        item.style = JSON.parse(item.styleConfig);
        item.source = item.chartConfig;
        let sort;
        if (item.source) {
          item.chartId = item.source.id;
          item.source.formId = item.source.targetId;
          item.source.quota = item.source.quota.map((item: any) => {
            item.display = item.display ? JSON.parse(item.display) : '';
            return item;
          });
          if (item.source.sort) {
            sort = {
              id: item.source.sort.id,
              type: item.source.sort.type
            };
          }
          // 配置文本组件筛选条件
          if (filterWidgetList.length > 0) {
            item.source.filtersText = [];
            filterWidgetList.forEach((item: any) => {
              const filterTargetAry = item.chartFilter.target;
              const defaultValue = item.chartFilter.defaultValue;
              filterTargetAry.forEach((targetItem: any) => {
                if (
                  targetItem.type === 1 &&
                  targetItem.field &&
                  targetItem.componentKey === item.id
                ) {
                  if (hasValidItem(defaultValue.value)) {
                    item.source.filtersText.push({
                      condition: defaultValue?.condition ?? 'CONTAINS',
                      field: targetItem.field,
                      type: defaultValue.type,
                      value: changeValue(defaultValue)
                    });
                  }
                } else if (
                  targetItem.type === 2 &&
                  item.source.collectId === targetItem.collectId &&
                  targetItem.field &&
                  item.source.quota.length > 0
                ) {
                  if (hasValidItem(defaultValue.value)) {
                    item.source.filtersText.push({
                      condition: defaultValue?.condition ?? 'CONTAINS',
                      field: targetItem.field,
                      type: defaultValue.type,
                      value: changeValue(defaultValue)
                    });
                  }
                }
              });
            });
          }

          delete item.source.sort;
          delete item.source.id;
          delete item.source.page;
          delete item.source.type;
          delete item.source.gatherType;
          delete item.source.targetId;
          item.source.drillDownDimension =
            item.source.drillDownDimension || [];
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
          item.configComp = item.layout.configComp;
          item.silent = item.layout.silent;
          item.layout.sort = sort || null;

          delete item.layout.runComp;
          delete item.layout.configComp;
          delete item.layout.silent;
        }

        delete item.componentKey;
        delete item.componentType;
        delete item.chartType;
        delete item.layoutConfig;
        delete item.styleConfig;
        delete item.chartConfig;
        if (item.parentId === '0') {
          item.parentId = '';
        }
        return item;
      });
    } else {
      config.widgetList = [];
    }
  }

  config.widgetList = buildTree(config.widgetList);
  return config;
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
      DB_WIDGET.GRID,
      DB_WIDGET.GRID_PANE
    ].includes(widget.type)) {
      continue;
    }
    const parentId = widget.parentId;
    if (parentId === '') {
      result.push(widget);
    } else {
      const parent = hashMap[parentId];
      if (parent.type === DB_WIDGET.GRID_PANE) {
        // 如果是在grid组件中的元素，就放到和grid平级的位置
        const grid = hashMap[parent.parentId];
        if (grid.parentId === '') {
          result.push(widget);
        } else {
          hashMap[grid.parentId].children = hashMap[grid.parentId].children || [];
          hashMap[grid.parentId].children.push(widget);
        }
      } else {
        hashMap[parentId].children = hashMap[parentId].children || [];
        hashMap[parentId].children.push(widget);
      }
    }
  }
  return result;
}
