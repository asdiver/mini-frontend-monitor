import { ErrorReport } from './error';


class Script extends ErrorReport {
  errorCallback = (e)=> {
    
    if(e.target === window){
      const {lineno, colno, error} = e
      this.noticeSuper({type:"script error", data:{lineno, colno, error}})
    }else{
      const url = e.target.src || e.target.href
      if(url !== undefined){
        this.noticeSuper({type:"resource error", data:{url, tagName:e.target.tagName}})
      }
    }
    
  }

  init = function() {
    window.addEventListener('error', this.errorCallback,true);
  }

  destroy = function() {
    window.removeEventListener('error', this.errorCallback);
  }
}


export const script = new Script();







