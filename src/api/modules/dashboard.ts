import request from '../index';

// 获取仪表盘信息
export function getDashboardReq(id: string | number): Promise<any> {
  return request({ url: '/dashboard/config?id=' + id, method: 'GET' });
};

// 获取图表数据
export function getChartDataReq(data: any): Promise<any> {
  return request({ url: '/chart/data/config', method: 'POST', data });
};

export const downloadChart = (data: any): Promise<any> => {
  return request({
    url: '/dashboard/dashboardChartDataExport',
    method: 'POST',
    data,
    silent: true,
    header: {
      'content-type': 'application/json'
    },
    responseType: 'arraybuffer'
  });
};
