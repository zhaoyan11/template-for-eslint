import { FormatType } from '@/types/dashboard';
import { DisplayBarType, DisplayLineType } from '@/types/chart';
import { DB_WIDGET } from './constants';

export function formatQuotaValue(
  value: number | string,
  config: any,
  fix = false,
  percentSuffix = '' // 用于处理柱状图百分比类型的展示
): number | string {
  value = Number(value);
  if (!config || !config.display) return useHandleValue(value);
  let { format, decimal, separator, prefix, suffix } = config.display;

  const originDecimal = value.toString().split('.')[1];
  const originDecimalLen = (originDecimal && originDecimal.length) || 0;

  // 先求倍数； 百分千分和前缀后缀不同时存在
  if (format === FormatType.PERCENT) {
    value = hundredTimes(value);
    prefix = '';
    suffix = '%';
  }
  if (format === FormatType.PERMILL) {
    prefix = '';
    suffix = '‰';
    value = thousandTimes(value);
  }
  // 取小数
  if (decimal > 0) {
    value = toFixed(value, decimal, fix);
  } else {
    value = toFixed(value, originDecimalLen);
  }

  // 分割符
  if (separator) {
    value = permillSeparator(value);
  }
  value += percentSuffix;
  if (prefix) {
    value = prefix + value;
  }
  if (suffix) {
    value += suffix;
  }
  return value;
}

function useHandleValue(value: number): string | number {
  const valArr = value && value.toString().split('.');
  const len = valArr && valArr[1] ? valArr[1].length : 0;
  return len < 2 ? value : value.toFixed(2);
}

const hundredTimes = (val: number | string): number => {
  if (typeof val === 'string') {
    val = parseFloat(val);
  }
  const num = val * 100;
  return parseFloat(num.toPrecision(16));
};

const thousandTimes = (val: number | string): number => {
  if (typeof val === 'string') {
    val = parseFloat(val);
  }
  const num = val * 1000;
  return parseFloat(num.toPrecision(16));
};

// 截取小数位数
export const toFixed = (val: number, num = 2, fix = false): string => {
  if (fix || /[.]/.test(val.toString())) {
    return val.toFixed(num);
  } else {
    return val.toString();
  }
};

const permillSeparator = (val: number | string): string => {
  if (typeof val === 'number') {
    val = val.toString();
  }
  const valArr = val.split('.');
  const integer = valArr[0];
  const decimal = valArr[1];
  const len = integer.length;
  let res = '';
  let j = 0;
  const reg = /^[0-9]/;
  for (let i = 0; i < len; i++) {
    const item = integer.charAt(len - 1 - i);
    if (reg.test(item)) j++;
    res = (j > 3 && (j - 1) % 3 === 0 ? item + ',' : item) + res;
  }
  return decimal ? `${res}.${decimal}` : res;
};

export const seriesColor = [
  '#5470c6',
  '#91cc75',
  '#fac858',
  '#ee6666',
  '#73c0de',
  '#3ba272',
  '#fc8452',
  '#9a60b4',
  '#ea7ccc'
];

export function getLegend(quota: any[]) {
  return {
    type: 'scroll',
    data: quota.map((item: any) => ({ name: item.alias })),
    bottom: 0,
    textStyle: {
      fontFamily: 'PingFangSC',
      fontSize: uni.upx2px(24),
      lineHeight: uni.upx2px(40),
      color: '#1D2129'
    }
  };
}

export function getTooltip(quota: any[], showPercentage = false) {
  return {
    show: true,
    trigger: 'item',
    formatter: (params: any) => {
      const { seriesName, name, value, marker } = params;
      let result: string | number = '';
      if (showPercentage) {
        result = (value * 100).toFixed(2).replace(/\.0+$/, ''); // 小数点后最多两位
        result += '%';
      } else {
        result = formatQuotaValue(value, quota[params.seriesIndex], true);
      }
      return `${seriesName}\n${marker}${name}   ${result}`;
    }
  };
}

export function getXAxis(dimension: any[], data: any[]) {
  return {
    type: 'category',
    axisLine: {
      lineStyle: {
        color: '#C9CDD4'
      }
    },
    axisLabel: {
      textStyle: {
        show: true,
        fontFamily: 'HelveticaNeue',
        fontSize: uni.upx2px(24),
        lineHeight: uni.upx2px(40),
        color: '#86909C'
      }
    },
    data: data.map((item: any) => {
      const key = dimension[0].id;
      return {
        value: item[key].label || 'null',
        fieldName: item[key].value
      };
    })
  };
}

export function getYAxis(showPercentage = false) {
  return {
    type: 'value',
    splitLine: {
      show: true,
      lineStyle: {
        color: '#E5E6EB',
        type: 'dashed'
      }
    },
    axisLabel: {
      formatter: showPercentage ? (val: number) => `${val * 100}%` : undefined,
      textStyle: {
        show: true,
        fontFamily: 'HelveticaNeue',
        fontSize: uni.upx2px(24),
        lineHeight: uni.upx2px(40),
        color: '#86909C'
      }
    }
  };
}

export function getSeries(quota: any[], data: any[], showPercentage: boolean = false) {
  return quota.map((q: any) => {
    let sum = 0;
    data.forEach((item: any) => {
      sum += item[q.id].value;
    });
    return {
      name: q.alias,
      data: data.map((item: any) => {
        const value = item[q.id]?.value ?? 0;
        if (showPercentage) {
          return value / sum;
        }
        return value;
      })
    };
  });
}

export function getOptions(props: any) {
  const { data, source, layout, type } = props;
  const { dimension, quota } = source;
  const { chartConfig } = layout;
  let showPercentage = false;
  if (type === DB_WIDGET.BAR || type === DB_WIDGET.HORIZONTAL_BAR) {
    showPercentage = chartConfig?.displayType === DisplayBarType.PercentStacked;
  }

  const options: any = {
    color: seriesColor,
    legend: getLegend(quota),
    tooltip: getTooltip(quota, showPercentage),
    xAxis: getXAxis(dimension, data),
    yAxis: getYAxis(showPercentage),
    series: getSeries(quota, data, showPercentage)
  };

  if ([DB_WIDGET.BAR, DB_WIDGET.HORIZONTAL_BAR].includes(type)) {
    const isStacked = [
      DisplayBarType.PercentStacked,
      DisplayBarType.Stacked
    ].includes(chartConfig?.displayType as DisplayBarType);

    options.series.forEach((item: any) => {
      item.type = 'bar';
      item.stack = isStacked ? 'total' : undefined;
    });

    if (type === DB_WIDGET.HORIZONTAL_BAR) {
      const t = options.xAxis;
      options.xAxis = options.yAxis;
      options.yAxis = t;
    }

    return options;
  }

  if ([DB_WIDGET.LINE, DB_WIDGET.AREA_LINE].includes(type)) {
    options.series.forEach((item: any) => {
      item.type = 'line';
      item.smooth = chartConfig?.displayType === DisplayLineType.CURVE || undefined;
      item.areaStyle = type === DB_WIDGET.AREA_LINE ? {} : undefined;
    });

    return options;
  }

  if (type === DB_WIDGET.PIE) {
    options.series.forEach((item: any) => {
      item.type = 'pie';
      item.radius = '65%';
      item.label = {
        show: false
      };
    });

    return {
      color: options.seriesColor,
      legend: options.legend,
      tooltip: options.tooltip,
      series: options.series
    };
  }

  if (type === DB_WIDGET.FUNNEL) {
    options.series.forEach((item: any) => {
      item.type = 'line';
      item.smooth = chartConfig?.displayType === DisplayLineType.CURVE || undefined;
      item.areaStyle = type === DB_WIDGET.AREA_LINE ? {} : undefined;
    });
    return options;
  }

  return options;
}
