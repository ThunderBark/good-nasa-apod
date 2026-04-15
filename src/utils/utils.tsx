export type point2d = {
  x: number,
  y: number
};

export const getVec = (
  point1: point2d,
  point2: point2d
): {x: number, y: number} => {

  return {
    x: point2.x - point1.x,
    y: point2.y - point1.y
  };
}

export const vecLen = (
  vec: point2d
) => {
  return Math.sqrt(
    vec.x * vec.x + vec.y * vec.y
  );
}

export const vecNorm = (
  vec: point2d
): point2d => {
  return {
    x: vec.x / vecLen({x: vec.x, y: vec.y}),
    y: vec.y / vecLen({x: vec.x, y: vec.y})
  };
}

export const cubicBezier = (
  t: number,
  p1: number,
  p2: number,
  p3: number,
  p4: number
): number => {
  return Math.pow((1 - t), 3) * p1 +
  3 * Math.pow((1 - t), 2) * t * p2 + 
  3 * (1 - t) * t * t * p3 +
  Math.pow(t, 3) * p4;
}

export const debounce = (func: () => any) => {
  var timeToWait = 50;
  var timer: number | undefined;
  return (event: Event) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(func, timeToWait, event);
  };
}
