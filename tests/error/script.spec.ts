import { expect, test } from '@playwright/test';
import { checkReport } from '../interface/report-jump/index';

// test('script [resource]', async ({ page }) => {
//   // 调用通用检查接口
//   const promise = checkReport(page, (contents) => {
//     for (const item of contents) {
//       if (item.type === 'script error') {
//         return true;
//       }
//     }
//   }, () => {
//     page.evaluate(() => {
//       setTimeout(() => {
//         throw new Error('error test');
//       }, 2500);
//     });
//   });
//   const result = await promise;

//   expect(Boolean(result)).toBeTruthy();
// });

test('script [error]', async ({ page }) => {
  // 调用通用检查接口
  const promise = checkReport(page, (contents) => {
    for (const item of contents) {
      if (item.type === 'script error') {
        return true;
      }
    }
  }, () => {
    page.evaluate(() => {
      setTimeout(() => {
        throw new Error('error test');
      }, 2500);
    });
  });
  const result = await promise;

  expect(Boolean(result)).toBeTruthy();
});
