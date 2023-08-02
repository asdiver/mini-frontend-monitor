import { expect, test } from '@playwright/test';
import type { Content } from '../src/report';

test('first-paint', async ({ page }) => {
  await page.goto('https://cn.vitest.dev');

  // paint all
  page.on('console', msg => {console.log(msg)});

  const update = page.evaluate(() => {
    let resultProxy: Content[];

    window.addEventListener('report', (e) => {
      const contents = (e as CustomEvent<Content[]>).detail;
      resultProxy.push(...contents);
    });

    return new Promise((resolve) => {
      resultProxy = new Proxy<Content[]>([], {
        set: (target, p, newValue) => {
          target[p] = newValue;
          resolve(1);
          return true;
        },
      });
    });
  });
  
  console.log('this callback never be called in evaluate');
  page.evaluate(() => {
    const firstPaintObserver = new window.PerformanceObserver((list) => {
      console.log(list);
      const custom = new CustomEvent('report', { detail: list });
      window.dispatchEvent(custom);
    });
  })
  
  await page.addScriptTag({ path: './tests/bug-example.js' });
  // await page.addScriptTag({ path: './tests/index.js' });


  await update;
  expect(true).toBeTruthy();
});
