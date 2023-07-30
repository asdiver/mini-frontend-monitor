import { PerformanceReport } from './performance';

import { PerformanceType } from './type-enum';

class FirstPaint extends PerformanceReport {
  firstPaintObserver: PerformanceObserver | null = null;

  init = () => {
    debugger;
    const firstPaintObserver = new PerformanceObserver((list) => {
      debugger;
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

export const firstPaint = new FirstPaint();
