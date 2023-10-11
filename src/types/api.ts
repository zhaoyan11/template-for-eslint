export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type ResponseType =
  | 'arraybuffer'
  | 'blob'
  | 'document'
  | 'json'
  | 'text'
  | 'stream';

export interface RequestConfig {
  url: string;
  method?: Method;
  data?: any;
  header?: Record<string, any>;
  loading?: boolean;
  timeout?: string;
  timeoutTip?: string;
  responseType?: string;
  silent?: boolean; // 只发出请求，没有loading效果、message提醒
}
