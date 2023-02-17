export default class ScrollAnimation {

  options = {
    animationData: [
      { key: 'left', unit: 'px', defaultValue: 100, currentValue: 100, target: 800, duration: 2000, startTime: 0 },
      { key: 'rotateX', showInStyle: false, unit: 'deg', defaultValue: 0, currentValue: 1, target: 270, duration: 1000, startTime: 2000 },
      { key: 'rotateY', showInStyle: false, unit: 'deg', defaultValue: 0, currentValue: 1, target: 180, duration: 1000, startTime: 2000 },
      {
        key: 'transform',
        dataIndex: [1, 2],
        notPartInCalc: true,
        defaultValueFormatter: (v1Option, v2Option) => {
          return `rotateX(${v1Option.currentValue}${v1Option.unit}) rotateY(${v2Option.currentValue}${v2Option.unit})`
        },
        currentValueFormatter: (v1Option, v2Option) => {
          return `rotateX(${v1Option.currentValue}${v1Option.unit}) rotateY(${v2Option.currentValue}${v2Option.unit})`
        },
      }
    ],
  };
  status = 'start'
  currentTime = 0
  endTime = 0
  perTime = 1000 / 60
  reverse = false
  target = null

  constructor(el, options) {
    this.target = el;
    this.options.animationData = [];
    this.options = this.#handleOptions(options);
    this.start();
  }

  start() {
    const options = this.options;
    if (options.animationData.length > 0) {
      options.animationData.forEach(item => {
        if (!item.notPartInCalc) {
          const {duration, startTime} = item;
          this.endTime = Math.max(duration + startTime, this.endTime);
        }
      });
      this.scrollHandler = this.#scrollGate(this.#_scrollHandler)

      window.addEventListener('scroll', this.scrollHandler);
    }
    return;
  }

  destroy() {
    window.removeEventListener('scroll', this.scrollHandler);
  }

  #handleOptions(options) {
    let resOptions = {...options};
    if (options.animationData && options.animationData.length > 0) {
      resOptions.animationData = options.animationData.map((item) => {
        const res = {...item};
        if (!item.hasOwnProperty('unit')) {
          res.unit = 'px';
        }
        if (!item.hasOwnProperty('showInStyle')) {
          res.showInStyle = true;
        }
        if (!item.hasOwnProperty('notPartInCalc')) {
          res.notPartInCalc = false;
        }
        return res;
      });
    }
    return resOptions;
  }

   #_linear (t, b, _c, d) {
    const c = _c - b;
    return c * t / d + b;
  }

  #_render () {
    const options = this.options;
    if (this.status === 'running') {
      this.currentTime = Math.max(intervalMap(scrollTop(window), 0, document.body.scrollHeight - window.innerHeight, 0, this.endTime), 0);
    }

    if (this.status === 'start') {
      this.currentTime = 0;
    }

    if (this.status === 'ended') {
      this.currentTime = this.endTime;
    }
    // 计算
    options.animationData.forEach(item => {
      if (!item.notPartInCalc) {
        const {startTime, duration, defaultValue, target} = item;
        if (this.currentTime >= startTime && this.currentTime <= startTime + duration) {
          let calcValue = this.#_linear(this.currentTime - startTime, defaultValue, target, duration);
          item.currentValue = toFixed(calcValue);
        }

        if (this.currentTime < startTime) {
          item.currentValue = defaultValue;
        }
      }
    });

    options.animationData.forEach(item => {
      if (item.showInStyle) {
        if (item.dataIndex && item.dataIndex.length > 0) {
          const optionDataList = [];
          item.dataIndex.forEach(i => {
            optionDataList.push(options.animationData[i]);
          });
          if (item.currentValue) {
            this.target.style[item.key] = item.currentValue + item.unit;
          }
          if (item.currentValueFormatter) {
            this.target.style[item.key] = item.currentValueFormatter(...optionDataList);
          }
        } else {
          this.target.style[item.key] = item.currentValue + item.unit;
        }
      }
    });
  }

  #scrollGate(callback) {
    let before = 0;
    const that = this;

    return function () {
      // debugger;
      const current = scrollTop(window);
      const delta = current - before;

      if (delta >= 0) {
        callback && callback.call(that, 'down');
      } else {
        callback && callback.call(that, 'up');
      }

      before = current;
    };
  }

  #_scrollHandler (dir) {
    if (dir === 'down') {
      this.reverse = false;
      if (this.currentTime < this.endTime) {
        this.status = 'running';
      } else {
        this.status = 'ended'
      }
    }
    if (dir === 'up') {
      this.reverse = true;
      if (this.currentTime > 0) {
        this.status = 'running';
      } else {
        this.status = 'start';
      }
    }
    window.requestAnimationFrame(this.#_render.bind(this));
  }
};

// ScrollAnimation util
// s 是 区间[a1, a2] 的值
// 返回 s map 映射到 [b1, b2] 后的值
function intervalMap (s, a1, a2, b1, b2) {
  return ((s - a1) / (a2 - a1)) * (b2 - b1) + b1
}

const isWindow = obj => {
  const toString = Object.prototype.toString.call(obj);
  return toString === '[object global]' || toString === '[object Window]' || toString === '[object DOMWindow]';
};

const scrollTop = (ele, target) => {
  const isWin = isWindow(ele);
  const y =
    window.pageYOffset !== undefined ?
      window.pageYOffset :
      (document.documentElement || document.body.parentNode || document.body).scrollTop;

  if (typeof target === 'number' && !isNaN(target)) {
    if (isWin) {
      document.documentElement.scrollTop = target;
      document.body.scrollTop = target;
    } else {
      ele.scrollTop = target;
    }
  }

  return isWin ? y : ele.scrollTop;
};

function toFixed(num, length) {
  const _rnd = length ? Math.pow(10, length) : 100000;
  const n = num | 0;
  const dec = num - n;
  let fixed = num;
  if (dec) {
    const r = ((dec * _rnd + (num < 0 ? -0.5 : 0.5) | 0) / _rnd);
    const t = r | 0;
    const str = r.toString();
    const decStr = str.split('.')[1] || '';
    fixed = `${num < 0 && !(n + t) ? '-' : ''}${n + t}.${decStr}`;
  }
  return parseFloat(fixed);
}
