import { h5Reports, expand } from './report/h5/index';

import { initNotice } from './report';
import type { LooseConfig, NoticeCallback, Report } from './report';

class Monitor {
  // 单例保存位置
  static singleton: Monitor;

  static reportsInstance: Report[] = [];

  /**
   * 初始化
   */
  constructor(callBack: NoticeCallback, config: LooseConfig = {}) {
    // 单例
    if (Monitor.singleton) {
      return Monitor.singleton;
    }

    Monitor.singleton = this;

    initNotice(callBack, config);
    // TODO 如果跨端需要环境判断
    // if (typeof window !== 'undefined') {
    // }

    h5Reports.forEach((Report) => {
      Monitor.reportsInstance.push(new Report());
    });

    Monitor.reportsInstance.forEach((report) => {
      report.init();
    });
  }

  destroy() {
    Monitor.reportsInstance.forEach((report) => {
      report.destroy();
    });
  }
}
// TODO 如果跨端需要环境判断
// Monitor 注册监听系统
// expand 用户继承此对象下的class以拓展上报系统
export { Monitor, expand };
