import { expect, test } from '@playwright/test';
import { checkReport } from '../interface/report-jump/index';

test('load', async ({ page }) => {
  // 调用通用检查接口
  await checkReport(page, (contents) => {
    for (const item of contents) {
      if (item.type === 'load') {
        return true;
      }
    }
  });
  expect(true).toBeTruthy();
});
