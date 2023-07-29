import { PerformanceReport } from './performance';


class Load extends PerformanceReport {
  init = function() {
    window.addEventListener('load', () => {
      this.noticeSuper({ type: 'load', data: { startTime: parseInt(performance.now()) } });
    }, { once: true });

  }

  destroy = function() {}
}


export const load = new Load();







