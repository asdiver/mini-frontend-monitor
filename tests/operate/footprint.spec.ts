import { expect, test } from '@playwright/test';
import { checkReport } from '../interface/report-jump/index';

test('footprint [use history]', async ({ page }) => {
  // 调用通用检查接口
  const result = await checkReport(page, (contents) => {
    if (typeof contents === undefined) {
      return false;
    }
    // contents some times undefined
    for (const item of contents) {
      if (item.type === 'footprint') {
        return item;
      }
    }
  }, () => {
    page.evaluate(() => {
      history.replaceState({}, '', 'test.html');
    });
  });

  expect(Boolean(result)).toBeTruthy();
});
