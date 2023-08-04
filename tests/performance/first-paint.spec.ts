import { expect, test } from '@playwright/test';
import { checkReport } from '../interface/report-jump/index';

test('first-paint', async ({ page }) => {
  // 调用通用检查接口
  await checkReport(page, (contents) => {
    for (const item of contents) {
      if (item.type === 'first-contentful-paint' || item.type === 'first-paint') {
        return [];
      }
    }
  });
  expect(true).toBeTruthy();
});
