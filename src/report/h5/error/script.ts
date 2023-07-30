import { ErrorReport } from './error';

import { ErrorType } from './type-enum';

interface TargetElement {
  src: string | undefined;
  href: string | undefined;
  tagName: string;
}

class Script extends ErrorReport {
  errorCallback = (e: ErrorEvent) => {
    if (e.target === window) {
      const { lineno, colno, error } = e;
      this.noticeSuper({ type: ErrorType.script, data: { lineno, colno, error } });
    } else if (e.target) {
      const target = e.target as unknown as TargetElement;
      const url: string | undefined = target.src || target.href;
      if (url !== undefined) {
        this.noticeSuper({ type: ErrorType.resource, data: { url, tagName: target.tagName } });
      }
    }
  };

  init = () => {
    window.addEventListener('error', this.errorCallback, true);
  };

  destroy = () => {
    window.removeEventListener('error', this.errorCallback);
  };
}

export const script = new Script();
