import { Report } from '../../../report';

/**
 * 禁止实例化此对象
 */
export class ErrorReport extends Report {

  static contents = []

  static reports = []

  // 获取ErrorReport所属配置
  config =this.config.error

  constructor() {
    /**
     * 收集被继承后实例化对象
     */
    super();
    ErrorReport.reports.push(this);
  }

  /**
   * 累计收集
   * @param {*} content
   */
  noticeSuper(content) {
    ErrorReport.contents.push(content);
    // 提交
    if (ErrorReport.contents.length >= this.config.scriptCollectCount) {
      this.notice(ErrorReport.contents);
      ErrorReport.contents = [];
    }
  }
}

// 页面卸载前上报所有数据
window.addEventListener("beforeunload", ()=>{
  ErrorReport.prototype.notice(ErrorReport.contents)
})