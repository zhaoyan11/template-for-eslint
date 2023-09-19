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
}
