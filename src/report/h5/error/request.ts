import { ErrorReport } from './error';

import { ErrorType } from './type-enum';
import type { RequestData } from './type-enum';

export class Request extends ErrorReport {
  // 重写的两个对象
  static xhrSend = window.XMLHttpRequest.prototype.send;
  static fetch = window.fetch;
  // 属性修饰符保存
  static fetchDescriptor = Object.getOwnPropertyDescriptor(window, 'fetch') as PropertyDescriptor;

  // xhr重写相关
  xhrWeakMap = new WeakSet<XMLHttpRequest>();
  xhrResult = (e: Event) => {
    const { responseURL, statusText, status, readyState } = e.target as XMLHttpRequest;
    // 是否错误结果
    if (readyState === 4 && status >= 400) {
      const data: RequestData = {
        responseURL,
        statusText,
        status,
        mode: 'xhr',
      };
      this.noticeSuper({
        type: ErrorType.request,
        data,
      });
    }
  };

  // fetch重写相关
  packFetch = (...args: [input: RequestInfo | URL, init?: RequestInit | undefined]) => {
    const promise = Request.fetch.apply(window, args);
    promise.then(this.fetchResult);
    return promise;
  };

  fetchResult = (res: Response) => {
    const { status, statusText, url } = res;
    if (status >= 400) {
      const data: RequestData = {
        responseURL: url,
        statusText,
        status,
        mode: 'fetch',
      };
      this.noticeSuper({
        type: ErrorType.request,
        data,
      });
    }
  };

  init = () => {
    const send = Request.xhrSend;
    const xhrWeakMap = this.xhrWeakMap;
    const xhrResult = this.xhrResult;

    XMLHttpRequest.prototype.send = function (...args) {
      if (!xhrWeakMap.has(this)) {
        // 注册事件监听
        this.addEventListener('readystatechange', xhrResult);
        xhrWeakMap.add(this);
      }
      // 执行
      send.apply(this, args);
    };

    Object.defineProperty(window, 'fetch', {
      get: () => {
        return this.packFetch;
      },
    });
  };

  destroy = () => {
    window.XMLHttpRequest.prototype.open = Request.xhrSend;
    Object.defineProperty(window, 'fetch', Request.fetchDescriptor);
  };
}
