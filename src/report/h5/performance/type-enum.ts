export enum PerformanceType {
  load = 'load',
  firstPaint = 'first-paint',
  firstContentfulPaint = 'first-contentful-paint',
}

export interface PerformanceData {
  /**
   * 花费时间，单位毫秒
   */
  startTime: number;
}

export type LoadData = PerformanceData;
export type FirstPaintData = PerformanceData;
