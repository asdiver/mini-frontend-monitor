import { expect, test } from '@playwright/test';
import { checkReport } from '../interface/report-jump/index';
import { PerformanceType } from '../../src/report/h5/performance/type-enum';

test('first-paint', async ({ page }) => {
  // 调用通用检查接口
  await checkReport(page, (contents) => {
    let status = 0;
    for (const item of contents) {
      if (item.type === PerformanceType.firstContentfulPaint || item.type === PerformanceType.firstPaint) {
        status++;
        if (status === 2) {
          return true;
        }
      }
    }
  });
  expect(true).toBeTruthy();
});
