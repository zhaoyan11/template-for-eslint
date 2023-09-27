import type { ChartConfigType } from './chart';

export enum FiltersCondition {
  And = 0, // 满足所有条件
  Or = 1 // 满足任一条件
}
export interface FilterCondition {
  filters: any[];
  attachTableFilters: {
    tableName: string;
    filters: any[];
  }[];
  filtersCondition: FiltersCondition;
}
// 将容器与图表认为是同种类型
export enum DbClass {
  CHART = 1,
  BOX,
  BASIC,
  FILTER
}

// 图例类型 包含容器
export enum DbType {
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
}

export interface DbLayout {
  width: string;
  height: string;
}

export interface GridLayout extends DbLayout {
  cols: string;
}

export interface TabLayout extends DbLayout {
  type: '' | 'card' | 'border-card';
  position: 'top' | 'left' | 'right' | 'bottom';
}

// 排序相关
export enum SortType {
  DEFAULT = 'default',
  ASC = 'asc',
  DESC = 'desc'
}
export interface Sort {
  id: string;
  type: SortType;
}

/**
 * 图标类组件 图表相关配置
 */
export interface ChartLayout extends DbLayout {
  sort: Sort | null; // 排序
  pageSize?: number;
  pageSizeOpt?: number[];
  reload: number; // 自动刷新
  nTerms: number; // 前n条数据
  detail?: boolean; // 明细表是否允许查看详情
  download?: boolean; // 明细表是否允许下载
  bgColor?: string;
  textColor?: string;
  btnColor?: string;
  titleColor?: string;
  chartColor?: string[] | string;
  imageUrl?: string;
  chooseFill?: string | number;
  chartConfig?: ChartConfigType; // 图表组件图标属性配置
  linkage?: string[]; // 联动图表ID集合
  isShowTotal?: boolean; // 是否显示合计行
  sqlFormId?: string | number; // 明显表配置sql表id
  sqlFormField?: string | number; // 明细表配置的sql表字段
  isThisApplicationForm?: boolean; // 明细表是否显示表单选项
  datasourceType?: number;
  sqlFiledDetail?: string;
}

export interface IframeLayout extends DbLayout {
  src: string;
}

export interface Jump {
  target: string;
  blank: boolean;
}

export interface ImgLayout extends DbLayout {
  src: string;
  size: 'auto' | 'contain' | 'cover' | '100% 100%';
  jump: Jump;
}

export interface TextLayout extends DbLayout {
  text: string;
}

export enum QuotaCountType {
  AVG = 'AVG',
  SUM = 'SUM',
  MAX = 'MAX',
  MIN = 'MIN',
  COUNT = 'COUNT'
}

export enum QuotaGatherType {
  COUNT = 'COUNT',
  SUM = 'SUM',
  MAX = 'MAX',
  MIN = 'MIN',
  AVG = 'AVG'
}

export enum FormatType {
  NUMBER = 'NUMBER',
  PERCENT = 'PERCENT',
  PERMILL = 'PERMILL'
}

export interface Display {
  separator: boolean;
  decimal: number;
  prefix: string;
  suffix: string;
  format: FormatType;
}

export interface Quota {
  id: string;
  field: string;
  inputType: string;
  alias: string;
  type: QuotaGatherType;
  comment: string;
  display: Display;
  dataComment: string;
  isDelete: boolean;
}

export enum DimensionGatherType {
  DEFAULT = '',
  YEAR = 0,
  YEAR_MONTH = 1,
  YEAR_MONTH_DAY = 2,
  YEAR_WEEK = 3,
  YEAR_QUARTER = 4,
  YEAR_MONTH_DAY_HOUR_MINUTE_SECOND,
  YEAR_MONTH_DAY_HOUR_MINUTE,
  HOUR_MINUTE_SECOND,
  HOUR_MINUTE
}

export interface Dimension {
  id: string;
  field: string;
  inputType: string;
  alias: string;
  type: DimensionGatherType;
  comment: string;
  isDelete?: boolean;
  dataFormat?: number; // 日期格式
  customDataFormat?: string | null; // 自定义数据格式
  showMissingTime?: boolean; // 显示缺失时间
  selectedSeriesItem: any; // 下钻时点击选中的数据项
}

export interface ChartSource {
  formId: number | null;
  collectId: number | null;
  quota: Quota[];
  dimension: Dimension[];
  filter: FilterCondition;
  filtersLink?: {
    sourceChartId: string; // 联动来源图表id
    list: {
      condition: string;
      field: string;
      type: string;
      value: any;
    }[];
  }; // 被其他图表联动时的筛选项
  permissionType: number; // 仪表盘权限设置- 0：使用表单中的全部数据  1：使用成员对表单的权限
  readonly originDimension: Dimension[];
  readonly originFilters: any;
  drillDownDimension?: Dimension[];
  drillDownDimensionIndex?: number;
}

export interface FilterSource {
  value: number | string;
  chart: any[];
  data: any[];
}

export interface ThemeStyle {
  bgColor?: string;
  textColor?: string;
  btnColor?: string;
  titleColor?: string;
  chartColor?: string[] | string;
  imageUrl?: string;
  chooseFill?: string | number;
  textActive?: string;
  defaultBgColor?: string;
  defaultTextColor?: string;
  chooseBgColor?: string;
  chooseTextColor?: string;
  layout?: string;
  quotaBgColor?: string;
  quotaTextColor?: string;
  chart?: string;
}

export interface DbConfig {
  id: string;
  name: string;
  type: DbType;
  parentId: string;
  classify: DbClass;
  chartId?: number;
  icon?: string;
  configComp?: string;
  runComp?: string;
  chartFilter?: any;
  // 样式配置
  style?: ThemeStyle;
  // 配置分为两部分 source; Layout。 source 配置变化会引起重新获取数据。
  source?: ChartSource | any;
  // Layout 引起重绘
  layout?:
    | DbLayout
    | ChartLayout
    | GridLayout
    | TabLayout
    | TextLayout
    | ImgLayout
    | ThemeStyle
    | IframeLayout;
  children?: DbConfig[];
  silent?: boolean;
  [key: string]: any;
}

export interface DbStore {
  [key: string]: DbConfig;
}

export interface DbClassConfig {
  id: DbClass;
  name: string;
  icon: string;
  children: DbConfig[];
}

export interface SelectFilterDataSource {
  appId: number;
  checked: boolean;
  collectTypeName: string;
  createTime: string;
  databaseType: null;
  datasourceId: number;
  datasourceType: number;
  fieldConfig: null;
  formId: number;
  id: number;
  name: string;
  requestConfig: null;
  updateTime: string;
}

export interface FilterDefaultValue {
  condition: string;
  customConfigurationOption: any[];
  dataSetOriginate: {
    dataSource: null | string | number;
    filterCondition: FilterCondition;
    valueFields: string[];
    displayFields: string[];
  };
  dateTimeFormat: string;
  dynamicValue: string;
  optionSource: null | string;
  showCondition: boolean;
  type: string;
  value: string[];
}

export interface FilterTargetList {
  collectId: number;
  componentId: number;
  componentKey: string;
  field: string;
  formId: null | string;
  name: string;
  type: number;
}

export interface DataSourceValue {
  value: string[] | number[];
  dataSetOriginate: {
    dataSource: number;
    displayFields: string[];
    filterConditions: FilterCondition;
    valueFields: string[];
  };
}

export interface ChartSeriesClickCallback {
  series?: {
    value: any;
    name: string;
  };
  // chartClickEvent?: any;
  // chartOptions?: any;
}

export interface DrillDownResult {
  isEnd: boolean;
  filters: any[];
}
