import { PerformanceReport } from './performance';

import { PerformanceType } from './type-enum';

export class FirstPaint extends PerformanceReport {
  firstPaintObserver: PerformanceObserver | null = null;

  init = () => {
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

  destroy = () => {
    (this.firstPaintObserver as PerformanceObserver).disconnect();
  };
}
