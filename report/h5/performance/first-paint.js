import { PerformanceReport } from './performance';


class FirstPaint extends PerformanceReport {
  firstPaintObserver = null

  init = function() {
    const firstPaintObserver = new PerformanceObserver((list) => {
      const contents = list.getEntries().map((item) => {
        return {
          type: item.name,
          data: { startTime: parseInt(item.startTime) }
        };
      });
      // 上报
      this.noticeSuper(contents);

      this.destroy();
    });
    // 开始监听
    firstPaintObserver.observe({ entryTypes: ['paint'] });

    this.firstPaintObserver = firstPaintObserver;

  }

  destroy = function() {
    this.firstPaintObserver.disconnect();
  }
}


export const firstPaint = new FirstPaint();







