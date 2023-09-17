// import axios from 'axios';
// import type { AxiosConfig, PromiseRes, CustomResponse } from '@/types/api';
// import { ElMessage } from 'element-plus';
// import { jumpToLogin } from '@/utils';
//
// let authDisabled = false;
//
//
// declare module 'axios' {
//   interface AxiosInstance {
//     (config: AxiosRequestConfig): Promise<any>;
//   }
// }
//
// const getTokenFromCookie = () => {
//   // 先从session里获取token
//   let token = sessionStorage.getItem('token');
//   // 不存在的话从cookie里获取token
//   if (!token) {
//     document.cookie.split(';').some(item => {
//       const [key, value] = item.split('=');
//       if (key.trim() === 'token') {
//         token = decodeURIComponent(value);
//         return true;
//       }
//     });
//   }
//   return token;
// };
//
// export const ETIMEDOUT = 'ETIMEDOUT';
// export const instance = axios.create({
//   baseURL: import.meta.env?.VITE_APP_API_URL,
//   timeout: 10000,
//   responseType: 'json',
//   withCredentials: true,
//   transitional: {
//     silentJSONParsing: true,
//     forcedJSONParsing: true,
//     clarifyTimeoutError: true
//   }
// });
//
// // 添加请求拦截器
// instance.interceptors.request.use(
//   request => {
//     const token = getTokenFromCookie();
//     request.headers.authorization = token;
//     return request;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );
//
// // 添加响应拦截器
// instance.interceptors.response.use(
//   response => {
//     return response;
//   },
//   error => {
//     let err;
//     // 处理超时
//     if (error.code === ETIMEDOUT) {
//       err = {
//         code: error.code,
//         message: error.message,
//         config: error.config,
//         timeout: true
//       };
//       return Promise.reject(err);
//     }
//     const response = error.response;
//     // 根据返回的http状态码做不同的处理
//     switch (response?.status) {
//       default:
//         err = { code: response?.status, message: response?.statusText };
//         break;
//     }
//     return Promise.reject(err);
//   }
// );
//
// // 根据后端返回的code码处理
// const handleCode = (
//   res: CustomResponse<any>,
//   resolve: any,
//   reject: any,
//   config?: CustomAxiosConfig
// ): void => {
//   const { message, code, data, timeout } = res;
//   if (code || message || data) {
//     const msg = message || '未知错误';
//     switch (code) {
//       case ETIMEDOUT:
//         const timeoutTip = config?.timeoutTip ?? '接口请求超时，请刷新界面';
//         ElMessage.error(timeoutTip);
//         reject({ data, code, message, timeout });
//         break;
//       case '200':
//         authDisabled = false;
//         resolve({ data, code });
//         break;
//       case '401':
//       case 401:
//         // config.noAuthTip为true时, 401错误只显示弹窗, 并阻断后续报错
//         if (config?.noAuthTip) {
//           const err = {
//             code: '401',
//             data: true
//           };
//           if (authDisabled) {
//             err.data = false;
//           }
//           authDisabled = true;
//           return resolve(err);
//         }
//         const notJump = window.location.href
//           .split('?')[1]
//           ?.split('&')
//           ?.some(keyValue => {
//             const [key, value] = keyValue.split('=');
//             if (key === 'iframe' && value === '1') {
//               return true;
//             }
//           });
//         if (notJump) {
//           ElMessage.error('登录状态已失效，请刷新界面');
//         } else {
//           sessionStorage.removeItem('token');
//           setTimeout(() => {
//             jumpToLogin();
//           }, 500);
//         }
//         break;
//       default:
//         ElMessage.error(msg);
//         reject({ data, code, message });
//     }
//   } else {
//     reject(res);
//   }
// };
//
// const request = (config: CustomAxiosConfig): Promise<PromiseRes<any>> => {
//   // eslint-disable-next-line no-useless-catch
//   try {
//     return new Promise((resolve, reject) => {
//       instance(config)
//         .then(response => {
//           const { data, headers } = response;
//           // 自定义接口获取接口行为
//           if (config.customResponse) {
//             resolve({ data, headers });
//           } else {
//             // 默认处理接口行为
//             handleCode(data, resolve, reject, config);
//           }
//         })
//         .catch(err => {
//           handleCode(err, resolve, reject, config);
//         });
//     });
//   } catch (err) {
//     throw err;
//   }
// };
//
// export default request;
