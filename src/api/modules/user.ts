import request from '../index';

// 获取用户信息
export const getUserInfo = (): Promise<any> => {
  return request({ url: '/sys/user', method: 'GET' });
};

// http://bitbuilder.sit.ninetechone.com/api/sys/menu/config?appId=1124
