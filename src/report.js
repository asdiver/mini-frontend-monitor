
export class Report {

  // 实例方法
  init = function() {
    throw new Error('请继承Report后注册init方法');
  }

  // 实例方法
  destroy = function() {
    throw new Error('请继承Report后注册destroy方法');
  }

  notice(contents = [{ type: 'report', data: {} }]) {
    throw new Error('实例化未提供回调函数');
  }
}
// 初始/默认 值
Report.prototype.config = {  
  operate: {
    // 排除监听的url  otherUrl比onlyUrl优先级更高 当footprintOtherUrl长度为0则会使用footprintOnlyUrl
    footprintOtherUrl: [],
    // 只监听指定url
    footprintOnlyUrl: [],
    // 是否忽略监听hash变化
    footprintIgnoreHash:false


  },
  error: {
    // 错误类型的上报至少需要几条数据
    scriptCollectCount: 4
  }
}

export function initNotice(notice, config) {
  Report.prototype.notice = notice;

  const target =  Report.prototype.config
  //在原对象基础上配置合并 通过遍历是为了保持二层对象指针不被覆盖
  for(const key in config){
    if(target[key]){
      Object.assign(target[key], config[key])
    }
  }
}