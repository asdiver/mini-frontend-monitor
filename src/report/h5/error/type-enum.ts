export enum ErrorType {
  script = 'script error',
  resource = 'resource error',
  request = 'request error',
}
export interface ScriptData {
  lineno: number;
  colno: number;
  error: any;
}
export interface ResourceData {
  /**
   * 资源地址
   */
  url: string;
  /**
   * 获取资源的标签名
   */
  tagName: string;
}
export interface RequestData {
  /**
   * 请求url
   */
  responseURL: string;
  /**
   * 结果状态文本提示
   */
  statusText: string;
  /**
   * 结果状态码
   */
  status: number;
  /**
   * 请求发起方式
   */
  mode: 'xhr' | 'fetch';
}
