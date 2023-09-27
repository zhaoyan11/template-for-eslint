/**
 * 图表组件相关类型
 */
import type { QuotaCountType } from './dashboard';

// 图表【x坐标轴】显示方式
export enum XAxisLabelDisPlayType {
  Horizontal, // 横向显示
  Vertical, // 竖向显示
  RotateToLeft, // 左倾斜显示
  RotateToRight // 左倾斜显示
}

// 图表【图例】显示方式
export enum LegendDisplayType {
  Hidden, // 不显示
  Bottom, // 底部
  Top, // 顶部
  Left, // 左侧
  Right // 右侧
}

// 图表表现形式
export enum DisplayBarType {
  Normal, // 普通
  Stacked, // 堆积
  PercentStacked // 百分比堆积
}

// 图表表现形式
export enum DisplayLineType {
  Normal, // 普通
  CURVE // 曲线
}

// 图表表现形式
export enum DisplayPieType {
  Normal, // 普通
  BoldRange, // 粗圆环
  Range, // 圆环
  Rose // 圆环
}

// 雷达图表现形式
export enum DisplayRadarType {
  Line, // 线条
  Fill // 填充
}

// 漏斗图表现形式
export enum DisplayFunnelType {
  Smooth, // 平底
  Sharp // 尖底
}

// 图上标签中显示内容，维度值、指标值、百分比值
export enum LabelContentType {
  Dimension,
  Quota,
  Percentage
}

// 漏斗图斜率 真实 / 平滑
export enum FunnelSlopeType {
  Smooth,
  Real
}

export interface GaugeValueType {
  type: 0 | 1; // 固定值 / 计算值
  field: string; // 字段
  calculate: QuotaCountType; // 计数
  inputValue: number; // 固定值输入
}

// 图表相关配置
export interface ChartConfigType {
  displayType?:
    | DisplayBarType
    | DisplayLineType
    | DisplayPieType
    | DisplayRadarType
    | DisplayFunnelType;
  xAxisLabel?: XAxisLabelDisPlayType; // 横坐标文字显示方式
  showLabel?: boolean; // 是否显示数据标签
  legend?: LegendDisplayType;
  labelContent?: LabelContentType[]; // 图上标签中显示内容，维度值、指标值、百分比值
  showProgress?: boolean; // 仪表图 - 是否显示进度条
  min?: GaugeValueType; // 仪表图 - 目标值下限
  max?: GaugeValueType; // 仪表图 - 目标值上限
  slope?: FunnelSlopeType; // 漏斗图 - 斜率
}
