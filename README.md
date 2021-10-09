# fiber_stydy
 make fiber with requestAnimationFrame
## fiber
js为单线程，如果存在大量任务运行的话会阻塞其他优先级更高/渲染线程的执行。

参考react实现，增加纤程概念，将耗时的工作根据比例分配给纤程。

基于以下API实现
[requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)
[Generator](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator)
