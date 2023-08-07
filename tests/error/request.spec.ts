import { expect, test } from '@playwright/test';
import { checkReport } from '../interface/report-jump/index';

test('request [xhr]', async ({ page }) => {
  // 调用通用检查接口
  const result = await checkReport(page, (contents) => {
    for (const item of contents) {
      if (item.type === 'request error') {
        return true;
      }
    }
  }, () => {
    page.evaluate(() => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'test');
      xhr.send();
    });
  });

  expect(Boolean(result)).toBeTruthy();
});

test('request [fetch]', async ({ page }) => {
  // 调用通用检查接口
  const result = await checkReport(page, (contents) => {
    for (const item of contents) {
      if (item.type === 'request error') {
        return true;
      }
    }
  }, () => {
    page.evaluate(() => {
      fetch('test', { method: 'POST' });
    });
  });

  expect(Boolean(result)).toBeTruthy();
});
