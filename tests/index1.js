class Report {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  notice(contents) {
    throw new Error('实例化未提供回调函数');
  }
}
// 默认配置
Report.config = {
  operate: {
    // 排除监听的url  otherUrl比onlyUrl优先级更高 当footprintOtherUrl长度为0则会使用footprintOnlyUrl
    footprintOtherUrl: [],
    // 只监听指定url
    footprintOnlyUrl: [],
    // 是否忽略监听hash变化
    footprintIgnoreHash: false,
  },
  error: {
    // 错误类型的上报至少需要几条数据
    scriptCollectCount: 4,
  },
};
function initNotice(notice, config) {
  Report.prototype.notice = notice;
  const target = Report.config;
  // 在原对象基础上配置合并 通过遍历是为了保持二层对象指针不被覆盖
  if (config.error) {
    Object.assign(target.error, config.error);
  }
  if (config.operate) {
    Object.assign(target.operate, config.operate);
  }
}

/**
 * 禁止实例化此对象
 */
class PerformanceReport extends Report {
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
  noticeSuper(content) {
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
// 所有继承了PerformanceReport的对象
PerformanceReport.reports = [];
// 上报数据缓存
PerformanceReport.contents = [];
// 记录上报次数
PerformanceReport.signTimes = 0;

let PerformanceType;
(function (PerformanceType) {
  PerformanceType.load = 'load';
  PerformanceType.firstPaint = 'first-paint';
  PerformanceType.firstContentfulPaint = 'first-contentful-paint';
})(PerformanceType || (PerformanceType = {}));

class FirstPaint extends PerformanceReport {
  constructor() {
    super(...arguments);
    this.firstPaintObserver = null;
    this.init = () => {
      const firstPaintObserver = new window.PerformanceObserver((list) => {
        const contents = list.getEntries().map((item) => {
          const type = item.name === PerformanceType.firstPaint
            ? PerformanceType.firstPaint
            : PerformanceType.firstContentfulPaint;
          return {
            type,
            data: { startTime: Math.floor(item.startTime) },
          };
        });
        // 上报
        this.noticeSuper(contents);
        this.destroy();
      });
      // 开始监听
      firstPaintObserver.observe({ entryTypes: ['paint'] });
      this.firstPaintObserver = firstPaintObserver;
    };
    this.destroy = () => {
      this.firstPaintObserver.disconnect();
    };
  }
}

class Load extends PerformanceReport {
  constructor() {
    super(...arguments);
    this.init = () => {
      window.addEventListener('load', () => {
        this.noticeSuper({ type: PerformanceType.load, data: { startTime: Math.floor(performance.now()) } });
      }, { once: true });
    };
    this.destroy = function () { };
  }
}

// 加载
const performanceReports = [FirstPaint, Load];

/**
 * 禁止实例化此对象
 */
class ErrorReport extends Report {
  constructor() {
    /**
         * 收集被继承后实例化对象
         */
    super();
    // 获取ErrorReport所属配置
    this.config = Report.config.error;
    ErrorReport.reports.push(this);
  }

  /**
     * 累计收集
     */
  noticeSuper(content) {
    ErrorReport.contents.push(content);
    // 提交
    if (ErrorReport.contents.length >= this.config.scriptCollectCount) {
      this.notice(ErrorReport.contents);
      ErrorReport.contents = [];
    }
  }
}
ErrorReport.contents = [];
ErrorReport.reports = [];
// 页面卸载前上报所有数据
window.addEventListener('beforeunload', () => {
  ErrorReport.prototype.notice(ErrorReport.contents);
});

let ErrorType;
(function (ErrorType) {
  ErrorType.script = 'script error';
  ErrorType.resource = 'resource error';
})(ErrorType || (ErrorType = {}));

class Script extends ErrorReport {
  constructor() {
    super(...arguments);
    this.errorCallback = (e) => {
      if (e.target === window) {
        const { lineno, colno, error } = e;
        this.noticeSuper({ type: ErrorType.script, data: { lineno, colno, error } });
      }
      else if (e.target) {
        const target = e.target;
        const url = target.src || target.href;
        if (url !== undefined) {
          this.noticeSuper({ type: ErrorType.resource, data: { url, tagName: target.tagName } });
        }
      }
    };
    this.init = () => {
      window.addEventListener('error', this.errorCallback, true);
    };
    this.destroy = () => {
      window.removeEventListener('error', this.errorCallback);
    };
  }
}

// 加载
const errorReports = [Script];

/**
 * 禁止实例化此对象
 */
class OperateReport extends Report {
  constructor() {
    /**
         * 收集被继承后实例化对象
         */
    super();
    // 获取OperateReport所属配置
    this.config = Report.config.operate;
    OperateReport.reports.push(this);
  }

  /**
     * 直接上报
     */
  noticeSuper(content) {
    this.notice([content]);
  }
}
OperateReport.reports = [];

let OperateType;
(function (OperateType) {
  OperateType.footprint = 'footprint';
})(OperateType || (OperateType = {}));

class Footprint extends OperateReport {
  constructor() {
    super(...arguments);
    // 初始的history对象
    this.originHistory = window.history;
    this.originHistoryDescriptor = Object.getOwnPropertyDescriptor(window, 'history');
    this.scrollCallback = () => {
      const element = document.documentElement;
      const depth = (element.clientHeight + element.scrollTop) / element.scrollHeight;
      Footprint.depth = Math.max(Footprint.depth, Math.floor((depth + 0.01) * 100));
    };
    // 对history代理的proxy对象
    this.historyProxy = new window.Proxy(history, {
      get: (target, key) => {
        // 可能是执行 也有可能是单纯获取 change方法会兜底
        if (key === 'back' || key === 'forward' || key === 'go' || key === 'pushState' || key === 'replaceState') {
          const time = Math.floor(performance.now());
          setTimeout(() => this.change(time));
        }
        const returnValue = this.originHistory[key];
        return returnValue instanceof Function
          ? returnValue.bind(this.originHistory)
          : returnValue;
      },
    });
    // 上次url变化的时间
    this.lastTime = 0;
    // 上次的url
    this.lastPath = '';
    /**
         * 上报回调接口 url变动之后调用
         */
    this.change = (newLastTime) => {
      const newPath = this.getPath();
      // url没变则不执行
      if (newPath === this.lastPath) {
        return;
      }
      // 检查配置url的过滤
      if (this.config.footprintOtherUrl.length) {
        if (this.config.footprintOtherUrl.indexOf(this.lastPath) !== -1) {
          return;
        }
      }
      else if (this.config.footprintOnlyUrl.length) {
        if (this.config.footprintOnlyUrl.indexOf(this.lastPath) === -1) {
          return;
        }
      }
      // 最新相对时间检查
      if (typeof newLastTime === 'undefined') {
        newLastTime = Math.floor(performance.now());
      }
      // 上报
      this.noticeSuper({
        type: OperateType.footprint,
        data: {
          url: this.lastPath,
          stopTime: newLastTime - this.lastTime,
          depth: Footprint.depth,
        },
      });
      // 更新记录
      this.lastPath = newPath;
      this.lastTime = newLastTime;
      Footprint.depth = 0;
    };
    this.packChange = (params) => {
      typeof params === 'number' ? this.change(params) : this.change();
    };
    this.init = () => {
      // 初始记录当前url
      this.lastPath = this.getPath();
      // hash改变
      if (!this.config.footprintIgnoreHash) {
        window.addEventListener('hashchange', this.packChange);
      }
      // 监听  覆盖history
      Object.defineProperty(window, 'history', {
        get: () => {
          return this.historyProxy;
        },
      });
      // 用户手动前进后退
      window.addEventListener('popstate', this.packChange);
      // 页面关闭前
      window.addEventListener('beforeunload', this.packChange);
      document.addEventListener('scroll', this.scrollCallback);
    };
    this.destroy = () => {
      if (!this.config.footprintIgnoreHash) {
        window.removeEventListener('hashchange', this.packChange);
      }
      // 还原
      Object.defineProperty(window, 'history', this.originHistoryDescriptor);
      window.removeEventListener('popstate', this.packChange);
      window.removeEventListener('beforeunload', this.packChange);
      window.document.removeEventListener('scroll', this.scrollCallback);
    };
  }

  // 获取要上传的地址
  getPath() {
    return window.location.pathname + (this.config.footprintIgnoreHash ? '' : window.location.hash);
  }
}
// 监听滚动
Footprint.depth = 0;

// 加载
const operateReports = [Footprint];

const h5Reports = [...performanceReports, ...errorReports, ...operateReports];

class Monitor {
  /**
     * 初始化
     */
  constructor(callBack, config = {}) {
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
Monitor.reportsInstance = [];

new Monitor(
  (contents) => {
    console.log(contents);
    const custom = new CustomEvent('report', { detail: contents });
    window.dispatchEvent(custom);
  },

);
