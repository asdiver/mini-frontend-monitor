import { performanceReports, PerformanceReport } from './performance/index';
import { errorReports, ErrorReport } from './error/index';
import { operateReports, OperateReport } from './operate/index';

export const h5Reports = [...performanceReports, ...errorReports, ...operateReports];
export const expand = {
  ErrorReport,
  PerformanceReport,
  OperateReport,
};
