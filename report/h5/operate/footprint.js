import { OperateReport } from './operate';

class Footprint extends OperateReport {

  // 初始的history对象
  static originHistory = window.history
  static originHistoryDescriptor = Object.getOwnPropertyDescriptor(window, 'history');

  // 监听滚动
  static depth = 0
  scrollCallback = ()=>{
    const element = document.documentElement

    const depth = (element.clientHeight + element.scrollTop)/element.scrollHeight
    Footprint.depth = Math.max(Footprint.depth,parseInt((depth+0.01)*100))
  }

  // 对history代理的proxy对象
  historyProxy = new Proxy(history, {
    get:(target, key)=>{
      // 可能是执行 也有可能是单纯获取 change方法会兜底
      if(key === "back" || key === "forward" || key === "go" || key === "pushState" || key === "replaceState"){
        const time = parseInt(performance.now())
        setTimeout(()=> this.change(time))
        
      }
      return Footprint.originHistory[key].bind(Footprint.originHistory)
    },
  })
  //上次url变化的时间
  lastTime = 0
  //上次的url
  lastPath = ""

  /**
   * 上报回调接口 url变动之后调用
   * @param {number} newLastTime 
   * @returns 
   */
  change = (newLastTime)=>{

    const newPath = this.getPath()
    // url没变则不执行
    if(newPath === this.lastPath){
      return
    }
    // 检查配置url的过滤
    if(this.config.footprintOtherUrl.length){
      if(this.config.footprintOtherUrl.indexOf(this.lastPath) !== -1){
        return
      }
      
    }else if(this.config.footprintOnlyUrl.length){
      if(this.config.footprintOnlyUrl.indexOf(this.lastPath) === -1){
        return
      }
    }
    // 最新相对时间检查
    newLastTime = ( parseInt(newLastTime) && newLastTime) || parseInt(performance.now())

    // 上报
    this.noticeSuper({
      type:"footprint",
      data:{
        url:this.lastPath,
        stopTime: newLastTime - this.lastTime,
        depth:Footprint.depth,
      }
    
    })

    //更新记录
    this.lastPath =  newPath
    this.lastTime = newLastTime
    Footprint.depth = 0
  }
  
  init = function() {
    // 初始记录当前url
    this.lastPath = this.getPath()

    // hash改变
    if(!this.config.footprintIgnoreHash){
      window.addEventListener("hashchange",this.change)
    }

    // 监听  覆盖history
    Object.defineProperty(window,"history",{
      get:()=>{
        return this.historyProxy 
      }
    })

    // 用户手动前进后退
    window.addEventListener("popstate",this.change)
    // 页面关闭前
    window.addEventListener("beforeunload", this.change)

    document.addEventListener("scroll",this.scrollCallback)
  }

  destroy = function() {
    if(!this.config.footprintIgnoreHash){
      window.removeEventListener("hashchange",this.change)
    }
    // 还原
    Object.defineProperty(window,"history",Footprint.originHistoryDescriptor)

    window.removeEventListener("popstate",this.change)

    window.removeEventListener("beforeunload",this.change)

    document.removeEventListener("scroll",this.scrollCallback)
  }

  // 获取要上传的地址
  getPath(){
    return location.pathname + ( this.config.footprintIgnoreHash ? "" : location.hash )
  }
}


export const footprint = new Footprint();