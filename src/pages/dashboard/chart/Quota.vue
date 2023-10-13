<template>
  <view v-if="dimension">
    <view
      v-for="(row, index) in table"
      :key="index"
      class="row"
      :class="{'is-total': row.isTotal}"
      @click="onChartClick(row)">
      <text class="label text-ellipsis">{{ row.label }}</text>
      <text class="value text-ellipsis">
        {{ row.value }}
        <text v-if="row.valueSuffix" class="suffix">{{ row.valueSuffix }}</text>
      </text>
    </view>
  </view>
  <view v-else class="single-value">
    {{ singleValue }}
  </view>
</template>

<script lang="ts" setup>
import { FormatType } from '@/types/dashboard';
import { trimEnd } from '@/utils';
import { computed } from 'vue';
import { formatQuotaValue } from './Chart';

interface Props {
  id: string;
  source: any;
  layout: any;
  data: any[] | Record<string, any>;
}

const props = defineProps<Props>();
const emit = defineEmits(['click:chart']);

function onChartClick(e: any) {
  if (e.isTotal) {
    return;
  }
  emit('click:chart', {
    key: e.key,
    label: e.label
  });
}

const dimension = computed(() => {
  try {
    return props.source.dimension[0];
  } catch (e) {
    return null;
  }
});

const quota = computed(() => {
  try {
    return props.source.quota[0];
  } catch (e) {
    return null;
  }
});

// 只有指标时，只显示一个数字
const singleValue = computed(() => {
  if (dimension.value || !quota.value || Array.isArray(props.data)) {
    return '';
  };
  const quotaId = quota.value?.id || '';
  return formatQuotaValue(props.data[quotaId]?.value, quota.value, true);
});

// 有维度和指标，显示为一个表格
const table = computed(() => {
  if (!dimension.value || !quota.value || !Array.isArray(props.data)) {
    return [];
  };
  const dimensionId = dimension.value.id || '';
  const quotaId = quota.value.id || '';

  let total = 0;
  const result = props.data.map(item => {
    total += Number(item[quotaId]?.value) || 0;
    const formatted = formatQuotaValue(item[quotaId]?.value, quota.value, true);
    const { value, suffix } = removeSuffix(String(formatted));
    return {
      key: item[dimensionId]?.value,
      label: item[dimensionId]?.label || 'null',
      value,
      valueSuffix: suffix,
      isTotal: false
    };
  });

  const formattedTotal = formatQuotaValue(total, quota.value, true);
  const res = removeSuffix(String(formattedTotal));
  if (props.layout.isShowTotal) {
    result.unshift({
      key: '',
      label: '合计',
      value: res.value,
      valueSuffix: res.suffix,
      isTotal: true
    });
  }

  return result;
});

/**
 *
 * @param quotaFormatConf
 * @param value
 */
function removeSuffix(value: string) {
  const quotaFormatConf = quota.value?.display;
  if ([FormatType.PERCENT, FormatType.PERMILL].includes(quotaFormatConf?.format)) {
    return {
      value,
      suffix: ''
    };
  }
  const suffix = quotaFormatConf?.suffix || '';
  value = trimEnd(value, suffix);
  return {
    value,
    suffix
  };
}
</script>
<style lang="scss" scoped>
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  &:last-child {
    margin-bottom: 0;
  }
  &.is-total {
    .label {
      font-weight: 700;
    }
  }

  .label {
    font-size: 28rpx;
    line-height: 1.4;
    color: rgba(0, 0, 0, .6);
  }
  .value {
    font-size: 32rpx;
    line-height: 48rpx;
    color: rgba(0, 0, 0, .9);
  }
  .suffix {
    margin-left: 8rpx;
    font-size: 24rpx;
    line-height: 40rpx;
    color: rgba(0, 0, 0, .4);
  }
}

.single-value {
  font-size: 48rpx;
  line-height: 88rpx;
  font-weight: 600;
  color: rgba(0, 0, 0, .9);
  text-align: center;
}
.text-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
