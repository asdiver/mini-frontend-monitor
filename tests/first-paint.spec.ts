import { expect, test } from '@playwright/test';
import { checkReport } from './report-jump/index';

test('first-paint', async ({ page }) => {
  // 调用通用检查接口
  await checkReport(page, (contents) => {
    return contents[0];
  });
  expect(true).toBeTruthy();
});
