export interface Config {
  operate: {
    footprintOtherUrl: string[];
    footprintOnlyUrl: string[];
    footprintIgnoreHash: boolean;
  };
  error: {
    scriptCollectCount: number;
  };
}
export type LooseConfig = Partial<Config>;

export interface Content {
  type: string;
  data: any;
}

export type NoticeCallback = (contents: Content[]) => void;

export abstract class Report {
  // 默认配置
  static config: Config = {
    operate: {
    // 排除监听的url  otherUrl比onlyUrl优先级更高 当footprintOtherUrl长度为0则会使用footprintOnlyUrl
      footprintOtherUrl: [],
      // 只监听指定url
      footprintOnlyUrl: [],
      // 是否忽略监听hash变化
      footprintIgnoreHash: false,

    },
    error: {
    // 错误类型的上报至少需要几条数据
      scriptCollectCount: 4,
    },
  };

  // 实例方法
  abstract init(): void;

  // 实例方法
  abstract destroy(): void;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  notice(contents: Content[]) {
    throw new Error('实例化未提供回调函数');
  }
}

export function initNotice(notice: NoticeCallback, config: LooseConfig) {
  Report.prototype.notice = notice;

  const target = Report.config;
  // 在原对象基础上配置合并 通过遍历是为了保持二层对象指针不被覆盖
  if (config.error) {
    Object.assign(target.error, config.error);
  }
  if (config.operate) {
    Object.assign(target.operate, config.operate);
  }
}
