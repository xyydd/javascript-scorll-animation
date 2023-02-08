// s 是 区间[a1, a2] 的值
// 返回 s map 映射到 [b1, b2] 后的值
export function map (s, a1, a2, b1, b2) {
  return ((s - a1) / (a2 - a1)) * (b2 - b1) + b1
}

const isWindow = obj => {
  const toString = Object.prototype.toString.call(obj);
  return toString === '[object global]' || toString === '[object Window]' || toString === '[object DOMWindow]';
};

export const scrollTop = (ele, target) => {
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

export function scrollGate(callback) {
  let before = 0;

  return function () {
    const current = scrollTop(window);
    const delta = current - before;

    if (delta >= 0) {
      callback && callback('down');
    } else {
      callback && callback('up');
    }

    before = current;
  };
}

export function toFixed(num, length) {
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
