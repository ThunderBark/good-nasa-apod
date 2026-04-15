import React from 'react';
import { memo } from 'react';
import styles from './StarsBackground.module.css'
import { point2d, cubicBezier, getVec, vecLen, vecNorm, debounce } from '../../utils/utils';


type starData = {
  start: point2d,
  startOffset: number,
  pathDir: point2d,
  pathLen: number
};

/**
 * 
 * @param canvasId 
 * @param w 
 * @param h 
 */
const drawStars = (
  canvasId : string,
  w : number,
  h : number,
  starDataArr: Array<starData>
) => {
  const animationDuration = 20000;

  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  const ctx : CanvasRenderingContext2D = canvas.getContext('2d', { alpha: false })!;
  const spaceSize = 1.3 *  Math.max(w, h);


  ctx.clearRect(0, 0, w, h);

  const t = ((new Date).getTime() % animationDuration) / animationDuration;

  starDataArr.map((item) => {
    const offset_t = (((t + item.startOffset) * 1000) % 1000) / 1000;

    // В конце каждого цикла анимации двигаем начальное положение звезды
    if (Math.floor(offset_t * 10000) === 0) {
      item.start.x = Math.random() * w;
      item.start.y = Math.random() * h;

      const startPosVec = getVec(
        {x: window.innerWidth / 2, y: window.innerHeight / 2},
        {x: item.start.x, y: item.start.y}
      );

      item.pathDir = vecNorm(startPosVec);
      item.pathLen = spaceSize / 2 - vecLen(startPosVec);
    }

    const pathProgress: number = cubicBezier(
      offset_t,
      0.0,
      0.0,
      0.0,
      1
    );
    const closenessCoef = item.pathLen / (spaceSize / 2);
    const sizeProgress: number = cubicBezier(
      offset_t,
      closenessCoef * 0.1,
      closenessCoef * 0.3,
      closenessCoef * 0.5,
      closenessCoef
    );

    ctx.fillStyle = 'rgb(' + sizeProgress * 255 + ', ' + sizeProgress * 255 + ', ' + sizeProgress * 255 + ')';
    ctx.beginPath();
    ctx.arc(
      item.start.x + pathProgress * item.pathDir.x * item.pathLen,
      item.start.y + pathProgress * item.pathDir.y * item.pathLen,
      Math.abs(sizeProgress * 5),
      0,
      2 * Math.PI
    );
    ctx.fill();
    return 0;
  });
};


export const StarsBackground = memo(() => {
  const dpi_x = document.getElementById('dpi')!.offsetWidth;
  const dpi_y = document.getElementById('dpi')!.offsetHeight;
  const starNumber: number = Math.round((dpi_x * dpi_y) / 4);

  const [canvasWidth, setCanvasWidth] = React.useState<number>(window.innerWidth);
  const [canvasHeight, setCanvasHeight] = React.useState<number>(window.innerHeight);

  var starDataArr: Array<starData> = [];

  
  var drawId = 0;
  const draw = () => {
    drawStars(
      'starsCanvas',
      window.innerWidth,
      window.innerHeight,
      starDataArr
    );

    drawId = window.requestAnimationFrame(draw);
  };

  const resetStarDataArr = () => {
    starDataArr = [];
    Array.from(Array(starNumber)).map(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const spaceSize = 1.3 *  Math.max(window.innerWidth, window.innerHeight);
      const startPosVec = getVec(
        {x: window.innerWidth / 2, y: window.innerHeight / 2},
        {x: x, y: y}
      );

      starDataArr.push({
        start: {x: x, y: y},
        startOffset: Math.random(),
        pathDir: vecNorm(startPosVec),
        pathLen: spaceSize / 2 - vecLen(startPosVec),
      })
    });
  }

  React.useEffect(() => {
    resetStarDataArr();
    draw();

    onresize = debounce(() => {
      window.cancelAnimationFrame(drawId);

      setCanvasHeight(window.innerHeight);
      setCanvasWidth(window.innerWidth);

      resetStarDataArr();

      draw();
    });
  }, []);


  return (
    <div className={styles.wrapper}>
      <canvas 
        id='starsCanvas'
        style={{height: '100vh', width: '100vw'}}
        width={canvasWidth}
        height={canvasHeight}
      />
    </div>
  )
});