export enum DB_WIDGET {
  GRID = 1,
  GRID_PANE, // 2
  TAB, // 3
  TAB_COL, // 4
  BAR, // 柱状图 - 5
  LINE, // 折线图 - 6
  PIE, // 饼图 - 7
  QUOTA, // 指标 - 8
  TABLE, // 表格 - 9
  IFRAME, // iframe - 10
  TEXT, // 文本 - 11
  IMG, // 图像 - 12
  FILTER_TEXT, // 过滤文本 - 13
  HORIZONTAL_BAR, // 条形图 - 14
  AREA_LINE, // 面积图 - 15
  GAUGE, // 仪表图 - 16
  RADAR, // 雷达图 - 17
  FUNNEL, // 漏斗图 - 18
  FILTER_NUMBER, // 过滤数字 - 19
  FILTER_DATE, // 过滤日期 - 20
  FILTER_SELECT // 过滤下拉 -21
};

// chart 图 维度 个数限制 左开右闭  （0,1]
export const CHART_DIMENSION_LIMIT = {
  [DB_WIDGET.BAR]: [0, 1],
  [DB_WIDGET.HORIZONTAL_BAR]: [0, 1],
  [DB_WIDGET.LINE]: [0, 1],
  [DB_WIDGET.AREA_LINE]: [0, 1],
  [DB_WIDGET.PIE]: [0, 1],
  [DB_WIDGET.QUOTA]: [-1, 1],
  [DB_WIDGET.TABLE]: [-1, 0],
  [DB_WIDGET.GAUGE]: [-1, 0],
  [DB_WIDGET.RADAR]: [0, 1],
  [DB_WIDGET.FUNNEL]: [0, 1]
};

// chart 图 指标 个数限制
export const CHART_QUOTA_LIMIT = {
  [DB_WIDGET.BAR]: [0, 10],
  [DB_WIDGET.HORIZONTAL_BAR]: [0, 10],
  [DB_WIDGET.LINE]: [0, 10],
  [DB_WIDGET.AREA_LINE]: [0, 10],
  [DB_WIDGET.PIE]: [0, 1],
  [DB_WIDGET.QUOTA]: [0, 1],
  [DB_WIDGET.TABLE]: [0, 100],
  [DB_WIDGET.GAUGE]: [0, 1],
  [DB_WIDGET.RADAR]: [0, 100],
  [DB_WIDGET.FUNNEL]: [0, 1]
};

// 排序相关
export enum SORT_TYPE {
  DEFAULT = 'default',
  ASC = 'asc',
  DESC = 'desc'
};

export const QUOTA_GATHER_SUM_FIELD = ['number', 'rate', 'NUMBER'];
