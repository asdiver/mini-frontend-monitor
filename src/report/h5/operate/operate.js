import { Report } from '../../../report';

/**
 * 禁止实例化此对象
 */
export class OperateReport extends Report {

  static reports = []

  // 获取OperateReport所属配置
  config =this.config.operate

  constructor(){
    /**
     * 收集被继承后实例化对象
     */
    super();
    OperateReport.reports.push(this);
  }

  /**
   * 直接上报
   * @param {*} content
   */
  noticeSuper(content) {
    this.notice(content)
  }
}