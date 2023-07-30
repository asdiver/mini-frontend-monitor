import { Report } from '../../../report';

import type { Content } from '../../../report';

/**
 * 禁止实例化此对象
 */
export abstract class PerformanceReport extends Report {
  // 所有继承了PerformanceReport的对象
  static reports: PerformanceReport[] = [];
  // 上报数据缓存
  static contents: Content[] = [];
  // 记录上报次数
  static signTimes = 0;

  constructor() {
    /**
     * 收集被继承后实例化对象
     */
    super();
    PerformanceReport.reports.push(this);
  }

  /**
   * 累计收集所有performance上报数据
   */
  noticeSuper(content: Content | Content[]) {
    content instanceof Array
      ? PerformanceReport.contents.push(...content)
      : PerformanceReport.contents.push(content);

    PerformanceReport.signTimes++;

    // 收集
    if (PerformanceReport.signTimes === PerformanceReport.reports.length) {
      PerformanceReport.signTimes = 0;
      this.notice(PerformanceReport.contents);
    }
  }
}
