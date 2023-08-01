import { expect, test } from '@playwright/test';
import type { Content } from '../src/report';

test('first-paint', async ({ page }) => {
  await page.goto('https://cn.vitest.dev');
  // page.on('console', msg => console.log(msg.text()));

  let resultProxy: Content[];
  const update = new Promise((resolve) => {
    resultProxy = new Proxy<Content[]>([], {
      set: (target, p, newValue) => {
        target[p] = newValue;
        resolve(1);
        return true;
      },
    });
  });

  await page.evaluate(() => {
    window.addEventListener('report', (e) => {
      const contents = (e as CustomEvent<Content[]>).detail;
      resultProxy.push(...contents);
    });
  });
  // await page.addInitScript(() => {
  //   window.addEventListener('report', (e) => {
  //     const contents = (e as CustomEvent<Content[]>).detail;
  //     resultProxy.push(...contents);
  //   });
  // });

  await page.addScriptTag({ path: './tests/index1.js' });
  await update;
  expect(true).toBeTruthy();
});
