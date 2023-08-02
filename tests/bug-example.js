console.log('this callback never be called in addScriptTag');
const firstPaintObserver = new window.PerformanceObserver((list) => {
  console.log(list);
  const custom = new CustomEvent('report', { detail: list });
  window.dispatchEvent(custom);
});

firstPaintObserver.observe({ entryTypes: ['paint'] });

console.log("list has PerformancePaintTiming");
performance.getEntries().forEach((list) => {
  console.log(list);
});
