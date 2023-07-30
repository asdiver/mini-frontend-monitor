// import { Report } from '../../report-class';

// /**
//  * @deprecated
//  */
// class FirstScreenPaint extends Report {
//   firstScreenPaintObserver = null;

//   startTime = -1;

//   imageLoad = 0;

//   intervalTime = 250;

//   init = function () {
//     const next = requestAnimationFrame || setTimeout;

//     // 上报时机为用户第一次点击
//     window.addEventListener('click', () => {
//       // 处理
//       const clickTime = performance.now();

//       const time = parseInt(clickTime) - parseInt(this.startTime);
//       // 有效数据
//       const data = time > 0 && time < 250
//         ? { startTime: -1 }
//         : { startTime: parseInt(this.startTime) };

//       // 上报
//       this.notice('FirstScreenPaint', data);
//       // 废弃
//       this.destroy();
//     }, { once: true });

//     this.firstScreenPaintObserver = new MutationObserver((mutationList) => {
//       for (const mutation of mutationList) {
//         if (mutation.addedNodes.length && this.isInScreen(mutation.target)) {
//           next(() => {
//             this.startTime = performance.now();
//           });
//         }
//       }
//     });

//     this.firstScreenPaintObserver.observe(document, {
//       childList: true,
//       subtree: true,
//     });
//   };

//   destroy = function () {
//     this.firstScreenPaintObserver.disconnect();
//   };

//   isInScreen = function (element) {
//     const ignoreDOMList = ['STYLE', 'SCRIPT', 'LINK'];
//     const { left, top } = element.getBoundingClientRect();
//     const find = ignoreDOMList.indexOf(element.tagName);
//     return Boolean(find === -1 && left < window.innerWidth && top < window.innerHeight);
//   };
// }

// export const firstScreenPaint = new FirstScreenPaint();
