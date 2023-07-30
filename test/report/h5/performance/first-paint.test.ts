import { Monitor } from '@/index';
import { PerformanceType } from '@/report/h5/performance/type-enum';

describe('performance', () => {
  test('first-paint', async () => {
    const result = await new Promise((resolve) => {
      const monitor = new Monitor((contents) => {
        console.log(contents);
        const find = contents.some((item) => {
          return item.type === PerformanceType.firstPaint;
        });
        resolve(find);
      });
      monitor.destroy();
    });

    expect(result).toBeTruthy();
  });
});
