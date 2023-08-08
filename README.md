# mini-frontend-monitor

[English](https://github.com/asdiver/mini-frontend-monitor/blob/main/README.md) | [简体中文](https://github.com/asdiver/mini-frontend-monitor/blob/main/README.zh-CN.md)

Frontend monitoring reporting system, designed for H5 platforms, fully functional and ready for use.

## Currently Supported Monitoring

### Errors

Report Trigger: When the error threshold is reached

* "script error" :Uncaught JavaScript errors
  
  Data:
  
  ```js
  export interface ScriptData {
    lineno: number;
    colno: number;
    error: any;
  }
  ```

* "resource error": HTML resource loading failure (Note: This error report is not completely accurate)
  
  Data:
  
  ```js
  export interface ResourceData {
    /**
     * Resource URL
     */
    url: string;
    /**
     * Tag name that fetched the resource
     */
    tagName: string;
  }
  ```

tips:Due to browser API triggering mechanism, these two error types cannot capture all errors completely.

* 'request error': XHR or fetch requests with response status code >= 400
  
  Data:
  
  ```js
  export interface RequestData {
    /**
     * Request URL
     */
    responseURL: string;
    /**
     * Result status text
     */
    statusText: string;
    /**
     * Result status code
     */
    status: number;
    /**
     * Request mode (xhr or fetch)
     */
    mode: 'xhr' | 'fetch';
  }
  ```

* 

### Performance

Report Trigger: When all performance indicators are collected and reported at once

* “load”:Time when the browser's load event is triggered (time when the first screen's HTML network resources are loaded)
  
  Data:
  
  ```js
  data: { 
    startTime //Time triggered in milliseconds
  }
  ```

* “first-paint”:Standard performance metric
  
  Data: Same as above

* “first-contentful-paint”:Standard performance metric
  
  Data: Same as above

* 

### User

Report Trigger: When the user leaves the current URL

* "footprint":User access monitoring
  
  Data:
  
  ```js
   data:{
    url,//URL visited by the user
    stopTime,//Time the user stayed in milliseconds
    depth,//Access depth from 0 to 100
  }
  ```

* 

## Getting Started

```js
import { Monitor,expand } from 'mini-frontend-monitor';

// Instantiate and register monitoring in object form
const monitor = new Monitor(
//Reporting callback function; all data reports go through this function and are extended by the user
function(contents) {
  console.log(contents);
}, 
//Custom configurations
{
  operate: {
    // URLs excluded from monitoring; otherUrl has higher priority than onlyUrl
    // When footprintOtherUrl is empty, footprintOnlyUrl will be used
    footprintOtherUrl: ["xxx"],
    // Only monitor specified URLs
    footprintOnlyUrl: [],
    // Ignore hash changes in monitoring
    footprintIgnoreHash:false


  },
  error: {
    // Minimum number of data required for error type reporting (all remaining data will be reported before the page is closed)
    scriptCollectCount: 4
  }
});

//Integrate class to expand and customize monitoring reports for your project's needs
class myRport extends expand.PerformanceReport{
  init(){
    this.superNotice({type:"xxx",data:{}})
  }
  destroy(){

  }
}
//Stop monitoring
monitor.destroy()
```

## Notes

mini-frontend-monitor has slightly overwritten the following browser APIs to achieve monitoring purposes

* window.history

* window.XMLHttpRequest

* window.fetch

Rest assured, this has no impact on your use of native APIs. To achieve monitoring purposes, it's recommended to execute mini-frontend-monitor before other scripts.

## todo

- [x] Develop the development system using ESLint, Rollup, and TypeScript

- [x] Write unit tests using the Playwright library

- [x]  Integrate and publish as a standard npm package

- [x] More monitoring data: XHR and fetch request error reporting

- [ ] Add more monitoring points: `unhandledrejection` and other necessary points



Feel free to ask if you have further questions or if there's anything else you'd like to know about this project!
