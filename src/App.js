import React, { useLayoutEffect, useRef } from 'react';
import { scrollTop, scrollGate, toFixed, map } from './utils/index';
import './App.css';

function App() {
  const componentReference = useRef({
    animationData: [
      { key: 'left', defaultValue: 100, currentValue: 100, target: 800, duration: 2000, startTime: 0 },
      { key: 'rotateX', defaultValue: 0, currentValue: 1, target: 270, duration: 1000, startTime: 2000 },
      { key: 'rotateY', defaultValue: 0, currentValue: 1, target: 180, duration: 1000, startTime: 2000 }
    ],
    status: 'start',
    currentTime: 0,
    endTime: 0,
    perTime: 1000 / 60,
    reverse: false,
    target: null
  });

  const cRef = componentReference.current;

  function _linear (t, b, _c, d) {
    var c = _c - b;
    return c * t / d + b;
  }

  function _render () {
    if (cRef.status === 'running') {
      cRef.currentTime = Math.max(map(scrollTop(window), 0, document.body.scrollHeight - window.innerHeight, 0, cRef.endTime), 0);
    }

    if (cRef.status === 'start') {
      cRef.currentTime = 0;
    }

    if (cRef.status === 'ended') {
      cRef.currentTime = cRef.endTime;
    }

    cRef.animationData.forEach(item => {
      const { startTime, duration, defaultValue, target } = item;
      if (cRef.currentTime >= startTime && cRef.currentTime <= startTime + duration) {
        let calcValue = _linear(cRef.currentTime - startTime, defaultValue, target, duration);
        item.currentValue = toFixed(calcValue);
      }

      if (cRef.currentTime < startTime) {
        item.currentValue = defaultValue;
      }
    });

    cRef.target.style.left = cRef.animationData[0].currentValue + 'px';
    // cRef.target.style.opacity = cRef.animationData[1].currentValue;
    cRef.target.style.transform = `rotateX(${cRef.animationData[1].currentValue}deg) rotateY(${cRef.animationData[2].currentValue}deg)`;
  }

  function _scrollHandler (dir) {
    if (dir === 'down') {
      cRef.reverse = false;
      if (cRef.currentTime < cRef.endTime) {
        cRef.status = 'running';
      } else {
        cRef.status = 'ended'
      }
    }

    if (dir === 'up') {
      cRef.reverse = true;
      if (cRef.currentTime > 0) {
        cRef.status = 'running';
      } else {
        cRef.status = 'start';
      }
    }

    window.requestAnimationFrame(_render);
  }

  useLayoutEffect(() => {
    const myDiv = document.querySelector('#box');
    cRef.target = myDiv;
    cRef.animationData.forEach(item => {
      const { duration, startTime } = item;
      cRef.endTime = Math.max(duration + startTime, cRef.endTime);
    });

    const scrollHandler = scrollGate(_scrollHandler)

    window.addEventListener('scroll', scrollHandler);
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    }
  }, []);

  return (
    <div className="container">
      <div id="box" className="box" />
    </div>
  );
}

export default App;
