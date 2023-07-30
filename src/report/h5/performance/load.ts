import { PerformanceReport } from './performance';

import { PerformanceType } from './type-enum';

class Load extends PerformanceReport {
  init = () => {
    window.addEventListener('load', () => {
      this.noticeSuper({ type: PerformanceType.load, data: { startTime: Math.floor(performance.now()) } });
    }, { once: true });
  };

  destroy = function () {};
}

export const load = new Load();
