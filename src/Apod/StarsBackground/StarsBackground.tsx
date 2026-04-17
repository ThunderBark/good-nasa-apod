import React from 'react';
import { memo } from 'react';
import styles from './StarsBackground.module.css'
import { cubicBezier, debounce, vectorToCircleEdge, clamp } from '../../utils/utils';
import Vector2 from '../../utils/Vector2';

const ANIMATION_DURATION_S = 20000;
type starData = {
  start: Vector2,
  startOffset: number,
  pathVec: Vector2,
};

const drawStars = (
  canvasId: string,
  w: number,
  h: number,
  starDataArr: Array<starData>
) => {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  const ctx: CanvasRenderingContext2D = canvas.getContext('2d', { alpha: false })!;
  const borderRadius = 1.3 * Math.max(w, h);
  const progress = ((new Date).getTime() % ANIMATION_DURATION_S) / ANIMATION_DURATION_S;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#FFFFFF'
  starDataArr.map((item) => {
    const itemProgress = (((progress + item.startOffset) * 1000) % 1000) / 1000;

    // В конце каждого цикла анимации двигаем начальное положение звезды
    if (Math.floor(itemProgress * 10000) === 0) {
      item.start.x = Math.random() * w;
      item.start.y = Math.random() * h;

      item.pathVec = vectorToCircleEdge(
        new Vector2(item.start.x, item.start.y),
        new Vector2(w / 2, h / 2),
        borderRadius
      );
    }

    const pathProgress: number = cubicBezier(
      itemProgress,
      0.0,
      0.0,
      0.0,
      1
    );
    const closenessCoef = item.pathVec.length() / (borderRadius / 2);
    const sizeProgress: number = cubicBezier(
      itemProgress,
      closenessCoef * 0.1,
      closenessCoef * 0.3,
      closenessCoef * 0.5,
      closenessCoef
    );

    ctx.globalAlpha = clamp(sizeProgress, 0.0, 1.0);
    ctx.beginPath();
    ctx.arc(
      item.start.x + pathProgress * item.pathVec.x,
      item.start.y + pathProgress * item.pathVec.y,
      Math.abs(sizeProgress * 3),
      0,
      2 * Math.PI
    );
    ctx.fill();
    return 0;
  });
  ctx.globalAlpha = 1;
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
      const start = new Vector2(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      )
      const spaceSize = 1.3 * Math.max(window.innerWidth, window.innerHeight);
      const startPosVec = vectorToCircleEdge(
        start.clone(),
        new Vector2(window.innerWidth / 2, window.innerHeight / 2),
        spaceSize
      )

      starDataArr.push({
        start: start,
        startOffset: Math.random(),
        pathVec: startPosVec,
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
        style={{ height: '100vh', width: '100vw' }}
        width={canvasWidth}
        height={canvasHeight}
      />
    </div>
  )
});