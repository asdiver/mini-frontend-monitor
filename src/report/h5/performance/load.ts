import { PerformanceReport } from './performance';

import { PerformanceType } from './type-enum';
import type { LoadData } from './type-enum';

export class Load extends PerformanceReport {
  init = () => {
    window.addEventListener('load', () => {
      const data: LoadData = { startTime: Math.floor(performance.now()) };
      this.noticeSuper({
        type: PerformanceType.load,
        data,
      });
    }, { once: true });
  };

  destroy = function () {};
}
