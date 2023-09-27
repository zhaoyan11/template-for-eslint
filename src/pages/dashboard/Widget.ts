import { CHART_DIMENSION_LIMIT, CHART_QUOTA_LIMIT } from './constants';

export function handleDbParams(data: any) {
  const item = JSON.parse(JSON.stringify(data));
  const finalFilter = item.source.filter;

  if (item.source.filtersText && item.source.filtersText.length > 0) {
    finalFilter.filters?.push(...item.source.filtersText);
  }

  if (item.source.filtersLink) {
    finalFilter.filters?.push(...item.source.filtersLink.list);
  }

  return {
    randomId: randomStr(), // 避免复制时浏览器拦截重复请求
    dimension: item.source.dimension,
    quota: item.source.quota.map((item: any) => {
      item.display = item.display ? JSON.stringify(item.display) : '';
      return item;
    }),
    layout: item.layout,
    filter: finalFilter,
    sort: item.layout.sort,
    targetId: item.source.formId,
    type: item.type,
    collectId: item.source.collectId,
    permissionType: item.source.permissionType
  };
};

export function randomStr(len = 8): string {
  const source = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let s = '';
  for (let i = 0; i < len; i++) {
    const r = Math.random();
    const x = Math.floor(r * source.length);
    s += source[x];
  }
  return s;
}

export function checkConfig(widget: any): boolean {
  const { type, source } = widget;
  if (!source) {
    return false;
  }
  const { quota, dimension } = source;
  if (!quota.length && !dimension.length) return false;
  if (
    dimension.length <= CHART_DIMENSION_LIMIT[type][0] ||
    dimension.length > CHART_DIMENSION_LIMIT[type][1]
  ) {
    return false;
  }
  if (
    quota.length <= CHART_QUOTA_LIMIT[type][0] ||
    quota.length > CHART_QUOTA_LIMIT[type][1]
  ) {
    return false;
  }
  return true;
};

export function interval(fn: (...args: any[]) => any, timeout: number) {
  function f() {
    fn();
    setTimeout(f, timeout);
  }
  setTimeout(f, timeout);
};
