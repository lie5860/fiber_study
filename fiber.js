function isGenerator(fn) {
  return fn.constructor.name === "GeneratorFunction";
}
const tag = Symbol("fiber");
class Fiber {
  works = [];
  isWork = false;
  // 暂定为60帧的场景
  intervalTime = 33;
  preTime = -1;
  percent = 0.5;
  runWork = function* () {
    if (this.works.length) {
      const work = this.works.shift();
      isGenerator(work) ? yield* work() : yield work();
    } else {
      yield null;
    }
  };
  gen = function* () {
    while (true) {
      yield* this.runWork();
    }
  };
  // count = 1;
  raqCallback = function (time) {
    if (!this.isWork) return;
    this.preTime = time;
    // console.log(`第${count++}次执行回调函数`);
    // 根据比例时间提供给纤程执行
    while (
      this.works.length &&
      performance.now() - this.preTime < this.intervalTime * this.percent &&
      this.isWork
    ) {
      this.fiber.next();
    }
    requestAnimationFrame(this.raqCallback);
  };
  constructor(percent = 0.5) {
    if (window[tag]) {
      window[tag].percent = percent;
      return window[tag];
    }
    this.fiber = this.gen();
    this.percent = percent;
    this.raqCallback = this.raqCallback.bind(this);
    this.stop = this.stop.bind(this);
    window[tag] = this;
  }
  setPercent(percent) {
    this.percent = percent;
  }
  clear() {
    this.works = [];
  }
  start() {
    this.isWork = true;
    requestAnimationFrame(this.raqCallback);
    return this.stop;
  }
  stop() {
    this.clear();
    this.isWork = false;
  }
}

// 测试代码

console.log("前置 - 这是一个正常主线程执行的指令");
const fiber2 = new Fiber();
const fiber = new Fiber(0.1);
console.log("单例测试", fiber === fiber2);
const stop = fiber.start();
for (let i = 1; i < 10000; i++) {
  fiber.works.push(function* test() {
    console.log("生成器回调值1-" + i);
    yield "添加的生成器回调值1-" + i;
    console.log("生成器回调值2-" + i);
    yield "添加的生成器回调值2-" + i;
  });
  fiber2.works.push(() => {
    console.log("添加的普通函数回调值1-" + i);
    return "添加的普通函数回调值1-" + i;
  });
}
setTimeout(() => {
  stop();
  console.log("100毫秒后关闭");
  console.log("进行一次累加计算");
  let count = 0;
  for (let i = 1; i < 10000; i++) {
    fiber2.works.push(() => {
      count += i;
    });
  }
  fiber2.works.push(() => {
    console.log("任务结束 最终值为" + count);
  });
  fiber2.start();
  console.log("关闭后的一个指令 - 这是一个正常主线程执行的指令");
}, 100);
console.log("后置 - 这是一个正常主线程执行的指令");
