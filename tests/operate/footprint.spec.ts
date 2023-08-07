import { expect, test } from '@playwright/test';
import { checkReport } from '../interface/report-jump/index';

// [history replaceState]
test('footprint [history replaceState]', async ({ page }) => {
  // 调用通用检查接口
  const result = await checkReport(page, (contents) => {
    const right: typeof contents = [];
    for (const item of contents) {
      if (item.type === 'footprint' && (item.data.url === '/' || item.data.url === '/test.html')) {
        right.push(item);
        if (right.length === 2) {
          return right;
        }
      }
    }
  }, () => {
    page.evaluate(() => {
      // 调用两次history方法
      history.replaceState({}, '', 'test.html');
      setTimeout(() => {
        history.replaceState({}, '', 'test1.html');
      });
    });
  });

  expect(Boolean(result)).toBeTruthy();
});

// [history pushState]
test('footprint [history pushState]', async ({ page }) => {
  // 调用通用检查接口
  const result = await checkReport(page, (contents) => {
    for (const item of contents) {
      if (item.type === 'footprint' && item.data.url === '/') {
        return true;
      }
    }
  }, () => {
    page.evaluate(() => {
      history.pushState({}, '', 'test.html');
    });
  });

  expect(Boolean(result)).toBeTruthy();
});

// [history go]
test('footprint [history go]', async ({ page }) => {
  // 调用通用检查接口
  const result = await checkReport(page, (contents) => {
    for (const item of contents) {
      if (item.type === 'footprint' && item.data.url === '/test.html') {
        return true;
      }
    }
  }, async () => {
    await page.evaluate(() => {
      history.pushState({}, '', 'test.html');
      setTimeout(() => {
        // 返回
        history.go(-1);
      });
    });
  });

  expect(Boolean(result)).toBeTruthy();
});

// [unload]
test('footprint [unload]', async ({ page }) => {
  // 调用通用检查接口
  const pend = checkReport(page, (contents) => {
    for (const item of contents) {
      if (item.type === 'footprint' && item.data.url === '/') {
        console.log(item);
        return true;
      }
    }
  }, () => {
    page.evaluate(() => {
      window.dispatchEvent(new Event('beforeunload', { cancelable: true }));
    });
  });

  const result = await pend;
  expect(Boolean(result)).toBeTruthy();
});
