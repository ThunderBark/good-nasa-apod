import Vector2 from "./Vector2";

export const clamp = (x: number, min: number, max: number): number => {
  return Math.min(Math.max(x, min), max);
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

export const vectorToCircleEdge = (
  point: Vector2,
  center: Vector2,
  radius: number
): Vector2 => {
  const dx = point.x - center.x;
  const dy = point.y - center.y;

  const len = Math.hypot(dx, dy);

  if (len === 0) {
    return new Vector2(radius, 0);
  }

  const scale = radius / len;

  const closestX = center.x + dx * scale;
  const closestY = center.y + dy * scale;

  return new Vector2(
    closestX - point.x,
    closestY - point.y
  );
}
