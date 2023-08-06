import { ErrorReport } from './error';

import { ErrorType } from './type-enum';
import type { ResourceData, ScriptData } from './type-enum';

interface TargetElement {
  src: string | undefined;
  href: string | undefined;
  tagName: string;
}

export class Script extends ErrorReport {
  errorCallback = (e: ErrorEvent) => {
    if (e.target === window) {
      const { lineno, colno, error } = e;
      const data: ScriptData = {
        lineno,
        colno,
        error,
      };

      this.noticeSuper({
        type: ErrorType.script,
        data,
      });
    } else if (e.target) {
      const target = e.target as unknown as TargetElement;
      const url: string | undefined = target.src || target.href;

      if (url !== undefined) {
        const data: ResourceData = {
          url,
          tagName: target.tagName,
        };
        this.noticeSuper({
          type: ErrorType.resource,
          data,
        });
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
