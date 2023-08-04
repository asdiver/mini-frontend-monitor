import type { Page } from '@playwright/test';

// 目标数据
interface Content {
  type: string;
  data: any;
}

// 检查函数类型 void 继续检查，Content| true 成功检查 返回结果， false 检查错误 返回结果
type FindTarget = (contents: Content[]) => undefined | Content[] | true | false;

interface Config {
  url: string;
  isConsole: boolean;
}
const defineConfig = { url: 'https://cn.vitest.dev', isConsole: true };
export async function checkReport(page: Page, findTarget: FindTarget, gotoNext = () => {}, config: Partial<Config> = defineConfig) {
  const finalConfig = Object.assign(defineConfig, config);

  // 测试环境是否复现所有浏览器打印数据
  if (finalConfig.isConsole) {
    page.on('console', async (msg) => {
      const args = msg.args();
      const promises = args.map(arg => arg.jsonValue());
      const values = await Promise.all(promises);
      console.log(...values);
    });
  }
  await page.addInitScript({ path: './tests/interface/report-jump/entry.js' });
  await page.goto(finalConfig.url);
  gotoNext();
  return page.evaluate((findTarget) => {
    // window加入report声明
    const testWindow = window as (Window & typeof globalThis & { report: Content[] });
    // eslint-disable-next-line no-new-func
    const findTargetFunc = new Function(`return ${findTarget}`)() as FindTarget;
    return new Promise((resolve) => {
      const contents = testWindow.report;

      // 检查函数
      const check = () => {
        const resultTarget = findTargetFunc(contents);
        // undefined 为继续校验 详情看FindTarget
        if (resultTarget !== undefined) {
          resolve(resultTarget);
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
