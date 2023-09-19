// 防抖
export const debounce = (
  fn: (...args: any[]) => void,
  wait: number,
  immediate?: boolean
) => {
  let timer: number | null;
  return function (...args: any[]) {
    if (timer) clearTimeout(timer);
    if (immediate) {
      // 如果已经执行过，不再执行
      const callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, wait);
      if (callNow) {
        fn(...args);
      }
    } else {
      timer = setTimeout(() => {
        fn(...args);
      }, wait);
    }
  };
};

export const jumpToLogin = (backPath?: string, redirectPath = '') => {
  const redirectUri = encodeURIComponent(
    backPath || window.location.href + redirectPath
  );
  const loginUrl = `${import.meta.env
    ?.VITE_APP_LOGIN_URL}?client_id=${import.meta.env
    ?.VITE_APP_LOGIN_CLIENT_ID}&response_type=token&scope=All&redirect_uri=${redirectUri}`;
  window.location.href = loginUrl;
  uni.removeStorageSync('redirectUri');
};

// 截取字符串
export const getQueryToken = (
  variable: string,
  href = window.location.href
) => {
  const index = href.indexOf('#');
  const str = href.substring(index + 1);
  const vars = str.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return false;
};
