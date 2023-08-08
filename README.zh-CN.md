# mini-frontend-monitor

[English](https://github.com/asdiver/mini-frontend-monitor/blob/main/README.md) | [简体中文](https://github.com/asdiver/mini-frontend-monitor/blob/main/README.zh-CN.md)

前端监控上报系统，平台为h5，可正常使用。

## 目前支持的监控

### 错误

上报时机：达到错误阈值条数

* "script error" :js执行未捕获的报错
  
  数据:
  
  ```js
  export interface ScriptData {
    lineno: number;
    colno: number;
    error: any;
  }
  ```

* "resource error": html资源获取失败，注：此报错不完全严谨
  
  数据:
  
  ```js
  export interface ResourceData {
    /**
     * 资源地址
     */
    url: string;
    /**
     * 获取资源的标签名
     */
    tagName: string;
  }
  ```

tips:因为浏览器api触发机制，这两个错误类型并不能完全捕获所有错误。

* 'request error': js请求xhr或者fetch请求出错，依据为响应状态码 >= 400
  
  数据:
  
  ```js
  export interface RequestData {
    /**
     * 请求url
     */
    responseURL: string;
    /**
     * 结果状态文本提示
     */
    statusText: string;
    /**
     * 结果状态码
     */
    status: number;
    /**
     * 请求发起方式
     */
    mode: 'xhr' | 'fetch';
  }
  ```

* 

### 性能

上报时机：所有性能指标收集完成后一次性上报

* “load”:浏览器load事件触发时间（首屏html网络资源加载完成时间）
  
  数据:
  
  ```js
  data: { 
    startTime //触发时间毫秒
  }
  ```

* “first-paint”:标准性能指标
  
  数据:同上

* “first-contentful-paint”:标准性能指标
  
  数据:同上

* 

### 用户

上报时机：用户离开当前url

* "footprint":用户访问监控
  
  数据:
  
  ```js
   data:{
    url,//用户访问的url地址
    stopTime,//用户停留时长 毫秒
    depth,//访问深度 0-100
  }
  ```

* 

## 快速上手

```js
import { Monitor,expand } from 'mini-frontend-monitor';

// 实例化形式注册监控
const monitor = new Monitor(
//上报回调函数 所有数据上报都走此函数，由使用者拓展
function(contents) {
  console.log(contents);
}, 
//自定义配置
{
  operate: {
    // 排除监听的url  otherUrl比onlyUrl优先级更高 
    // 当footprintOtherUrl长度为0则会使用footprintOnlyUrl

    //监控除了url外其他url
    footprintOtherUrl: ["xxx"],
    // 只监听指定url
    footprintOnlyUrl: [],
    // 是否忽略监听hash变化
    footprintIgnoreHash:false


  },
  error: {
    // 错误类型的上报至少需要几条数据才上报（页面关闭前会上报所有剩下数据）
    scriptCollectCount: 4
  }
});

//集成class 拓展用户自己项目需要的的监控上报
class myRport extends expand.PerformanceReport{
  init(){
    this.superNotice({type:"xxx",data:{}})
  }
  destroy(){

  }
}
//停止监控
monitor.destroy()
```

## 注意事项

mini-frontend-monitor对以下浏览器api进行了小部分重写以达到监听目的

* window.history

* window.XMLHttpRequest

* window.fetch

放心，这对你调用原生api是无感的，同时为了达到监听目的，最好在执行其他脚本之前执行mini-frontend-monitor。

## todo

- [x] 完善开发体系 使用eslint，rollup，ts

- [x] 使用playwright库编写单元测试

- [x] 整合发布为标准npm包

- [x] 更多的监控数据：xhr和fetch请求错误上报

- [ ] 加入更多监控点：`unhandledrejection`等其他需要


如果你还有进一步的问题，或者对这个项目还有其他想了解的内容，请随意提问！不管是什么技术问题，项目解释，还是其他任何疑问，都欢迎你向我询问！
