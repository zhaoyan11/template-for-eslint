import request from '../index';

// 获取用户信息
export const getUserInfo = (): Promise<any> => {
  return request({ url: '/sys/user', method: 'GET' });
};
