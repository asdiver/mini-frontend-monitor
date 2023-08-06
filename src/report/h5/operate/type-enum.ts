export enum OperateType {
  footprint = 'footprint',
}

export interface FootPrintData {
  /**
   * 访问的url
   */
  url: string;
  /**
   * 停留时间 单位毫秒
   */
  stopTime: number;
  /**
   * 访问深度
   */
  depth: number;
}
