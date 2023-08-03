import type { Page } from '@playwright/test';

// 目标数据
interface Content {
  type: string;
  data: unknown;
}

// 检查函数类型
type FindTarget = (contents: Content[]) => void | Content;

export async function checkReport(page: Page, findTarget: FindTarget, config = { url: 'https://cn.vitest.dev', isConsole: false }) {
  // 测试环境是否复现所有浏览器打印数据
  if (config.isConsole) {
    page.on('console', async (msg) => {
      const args = msg.args();
      const promises = args.map(arg => arg.jsonValue());
      const values = await Promise.all(promises);
      console.log(...values);
    });
  }

  await page.addInitScript({ path: './tests/report-jump/entry.js' });
  await page.goto(config.url);

  return page.evaluate((findTarget) => {
    // window加入report声明
    const testWindow = window as (Window & typeof globalThis & { report: Content[] });
    // eslint-disable-next-line no-new-func
    const findTargetFunc = new Function(`return ${findTarget}`) as FindTarget;
    return new Promise((resolve) => {
      const contents = testWindow.report;

      // 检查函数
      const check = () => {
        const resultTarget = findTargetFunc(contents);
        // 通过放回, 错误则清空数组
        if (resultTarget) {
          resolve(resultTarget);
        } else {
          contents.length = 0;
        }
      };

      testWindow.report = new Proxy(contents, {
        set(target, p, newValue) {
          target[p] = newValue;
          // 触发后检查
          check();
          return true;
        },
      });
      // 初始检查一次
      check();
    });
  }, findTarget.toString());
}
