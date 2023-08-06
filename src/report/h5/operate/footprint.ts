import { OperateReport } from './operate';

import { OperateType } from './type-enum';
import type { FootPrintData } from './type-enum';

export class Footprint extends OperateReport {
  // 初始的history对象
  originHistory = window.history;
  originHistoryDescriptor = Object.getOwnPropertyDescriptor(window, 'history') as PropertyDescriptor;

  // 监听滚动
  static depth = 0;
  scrollCallback = () => {
    const element = document.documentElement;

    const depth = (element.clientHeight + element.scrollTop) / element.scrollHeight;
    Footprint.depth = Math.max(Footprint.depth, Math.floor((depth + 0.01) * 100));
  };

  // 对history代理的proxy对象
  historyProxy = new window.Proxy(history, {
    get: (target, key) => {
      // 获取的目标可能是变量或者函数 change方法会兜底
      if (key === 'pushState' || key === 'replaceState') {
        const time = Math.floor(performance.now());
        setTimeout(() => this.change(time));
      }
      const returnValue: any = this.originHistory[key as (keyof typeof this.originHistory)];

      return returnValue instanceof Function
        ? returnValue.bind(this.originHistory)
        : returnValue;
    },
  });

  // 上次url变化的时间
  lastTime = 0;
  // 上次的url
  lastPath = '';

  /**
   * 上报回调接口 url变动之后调用
   */
  change = (newLastTime?: number) => {
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
    } else if (this.config.footprintOnlyUrl.length) {
      if (this.config.footprintOnlyUrl.indexOf(this.lastPath) === -1) {
        return;
      }
    }
    // 最新相对时间检查
    if (typeof newLastTime === 'undefined') {
      newLastTime = Math.floor(performance.now());
    }

    const data: FootPrintData = {
      url: this.lastPath,
      stopTime: newLastTime - this.lastTime,
      depth: Footprint.depth,
    };

    // 上报
    this.noticeSuper({
      type: OperateType.footprint,
      data,
    });

    // 更新记录
    this.lastPath = newPath;
    this.lastTime = newLastTime;
    Footprint.depth = 0;
  };

  packChange = (params: any) => {
    typeof params === 'number' ? this.change(params) : this.change();
  };

  preventDefaultChange = (e: Event) => {
    e.preventDefault();
    this.change();
  };

  init = () => {
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
    window.addEventListener('beforeunload', this.preventDefaultChange);

    document.addEventListener('scroll', this.scrollCallback);
  };

  destroy = () => {
    if (!this.config.footprintIgnoreHash) {
      window.removeEventListener('hashchange', this.packChange);
    }
    // 还原
    Object.defineProperty(window, 'history', this.originHistoryDescriptor);

    window.removeEventListener('popstate', this.packChange);

    window.removeEventListener('beforeunload', this.preventDefaultChange);

    window.document.removeEventListener('scroll', this.scrollCallback);
  };

  // 获取要上传的地址
  getPath() {
    return window.location.pathname + (this.config.footprintIgnoreHash ? '' : window.location.hash);
  }
}
