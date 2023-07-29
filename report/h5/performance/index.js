// 加载
import './first-paint';
import './load';

// 拿数组
import { PerformanceReport } from './performance';

export * from "./performance"
export const performanceReports = PerformanceReport.reports;