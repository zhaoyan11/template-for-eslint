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

export const isJson = (str: string) => {
  if (typeof str !== 'string') return false;
  try {
    const res = JSON.parse(str);
    return typeof res === 'object';
  } catch (e) {
    return false;
  }
};

export const dateFormat = (date: Date, fmt = 'YYYY-mm-dd') => {
  let ret;
  const opt: any = {
    'Y+': date.getFullYear().toString(),
    'm+': (date.getMonth() + 1).toString(),
    'd+': date.getDate().toString(),
    'H+': date.getHours().toString(),
    'M+': date.getMinutes().toString(),
    'S+': date.getSeconds().toString()
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
      );
    }
  }
  return fmt;
};
