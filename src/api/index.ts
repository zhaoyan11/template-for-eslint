import type { RequestConfig } from '#/api';

const request = (config: RequestConfig) => {
  config.method = config.method || 'GET';
  config.data = config.data || {};
  config.header = config.header || {};
  config.loading = !!config.loading;
  const token = uni.getStorageSync('token') || '';

  let loadingStatus = true;
  if (!config.silent) {
    setTimeout(() => {
      if (loadingStatus && config.loading) {
        uni.showLoading({
          title: '加载中',
          mask: true
        });
      }
    }, 800); // 800毫秒后如果loadingStatus === false 则表示请求返回了，不显示loading
  }
  return new Promise((resolve, reject) => {
    uni.request({
      url: import.meta.env?.VITE_APP_API_URL + config.url,
      method: config.method,
      data: config.data,
      header: {
        authorization: token,
        ...config.header
      },
      responseType: config.responseType || 'json',
      success: res => {
        if (config.silent) {
          resolve(res);
          return;
        }
        // console.log('success', res);
        if (res.statusCode === 200) {
          handleCode(res.data, resolve, reject);
        } else {
          const errData = {
            code: res.statusCode,
            message: (res.data as any)?.message
          };
          handleCode(errData, resolve, reject);
        }
      },
      fail: err => {
        if (config.silent) {
          reject(err);
          return;
        }
        handleCode(err, resolve, reject);
      },
      complete: () => {
        if (!config.silent && loadingStatus && config.loading) {
          uni.hideLoading();
          loadingStatus = false;
        }
      }
    });
  });
};

// 根据后端返回的code码处理
const handleCode = (
  res: any,
  resolve: any,
  reject: any
  // config?: RequestConfig
): void => {
  const { message, code, data } = res;
  if (code || message || data) {
    const msg = message || '未知错误';
    switch (code) {
    // case ETIMEDOUT:
    //   const timeoutTip = config?.timeoutTip ?? '接口请求超时，请刷新界面';
    //   ElMessage.error(timeoutTip);
    //   reject({ data, code, message, timeout });
    //   break;
    case '200':
      resolve({ data, code });
      break;
    case '401':
    case 401:
      uni.removeStorageSync('token');
      uni.showToast({
        icon: 'none',
        title: '登录失效'
      });

      // TODO: 跳转到登录页面
      break;
    default:
      uni.showToast({
        icon: 'none',
        title: msg
      });
      reject({ data, code, message });
    }
  } else {
    reject(res);
  }
};

export default request;
