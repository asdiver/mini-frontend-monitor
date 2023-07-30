import { Report } from '../../../report';

import type { Content } from '../../../report';

/**
 * 禁止实例化此对象
 */
export abstract class OperateReport extends Report {
  static reports: OperateReport[] = [];

  // 获取OperateReport所属配置
  config = Report.config.operate;

  constructor() {
    /**
     * 收集被继承后实例化对象
     */
    super();
    OperateReport.reports.push(this);
  }

  /**
   * 直接上报
   */
  noticeSuper(content: Content) {
    this.notice([content]);
  }
}
