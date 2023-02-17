import React, { useLayoutEffect } from 'react';
import ScrollAnimation from './utils/ScrollAnimation';
import './App.css';

function App() {

  useLayoutEffect(() => {
    const myDiv = document.querySelector('#box');
    const scrollAnimation = new ScrollAnimation(myDiv, {
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
      ]
    });

    return () => {
      scrollAnimation.destroy();
    }
  }, []);

  return (
    <div className="container">
      <div id="box" className="box" />
    </div>
  );
}

export default App;
