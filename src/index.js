import { h5Reports, expand } from './report/h5/index';

import { initNotice } from './report';

class Monitor {

  // 单例保存位置
  static singleton = null

  static reports = null

  /**
   * 初始化
   * @param {Function} callBack 通知回调
   * @param {Object} config 监控配置
   * @returns
   */
  constructor(callBack, config = { performance: {}, error: {}, user: {} }) {
    // 单例
    if (Monitor.singleton) {
      return Monitor.singleton;
    }

    Monitor.singleton = this;
    initNotice(callBack, config);
    // TODO 如果跨端需要环境判断
    // if (typeof window !== 'undefined') {
    Monitor.reports = h5Reports;
    // }

    Monitor.reports.forEach((report) => {
      report.init();
    });

  }

  destroy() {
    Monitor.reports.forEach((report) => {
      report.destroy();
    });
  }

}
// TODO 如果跨端需要环境判断
// Monitor 注册监听系统
// expand 用户继承此对象下的class以拓展上报系统
export { Monitor, expand };