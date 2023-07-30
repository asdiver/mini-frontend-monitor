# mini-frontend-monitor

个人前端监控研究学习，平台为h5，可正常使用。



## 目前支持的监控

### 错误

上报时机：达到错误阈值条数

* "script error" :js执行报错
  
  数据:
  
  ```js
  data:{
    lineno, //错误行
    colno,//错误列
    error//错误对象
  }
  ```

* "resource error": html资源获取失败
  
  数据:
  
  ```js
  data:{
    url, //失败的url
    tagName//标签名
  }
  ```

* 

tips:因为浏览器机制，这两个错误类型并不能完全捕获所有错误，后续完善

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
import { Monitor,expand } from './monitor/index';

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



## todo

1. 整合为标准npm包

2. 完善开发体系 eslint，husky，rollup，ts ...

3. 加入更多监控点：xhr错误、`unhandledrejection`、performance监听所有网络资源获取以更强大...

4. 
